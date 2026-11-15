import { Injectable, Logger } from '@nestjs/common';
import { OutboxStatus } from '@prisma/client';
import { TagPlusAclService } from '../integrations/tagplus/tagplus-acl.service';
import type { OrderCreatedPayload } from '../integrations/tagplus/tagplus.types';
import { PrismaService } from '../common/prisma.service';

const MAX_ATTEMPTS = 5;

type EventResult = {
  id: string;
  status: 'PROCESSED' | 'RETRY' | 'FAILED' | 'SKIPPED';
  error?: string;
};

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tagplusAcl: TagPlusAclService,
  ) {}

  async processPending(limit = 20) {
    const events = await this.prisma.outboxEvent.findMany({
      where: {
        status: OutboxStatus.PENDING,
        availableAt: { lte: new Date() },
      },
      orderBy: { createdAt: 'asc' },
      take: Math.min(Math.max(limit, 1), 100),
    });

    const results: EventResult[] = [];
    for (const event of events) {
      results.push(await this.processEvent(event.id));
    }

    return {
      scanned: events.length,
      processed: results.filter((result) => result.status === 'PROCESSED').length,
      retried: results.filter((result) => result.status === 'RETRY').length,
      failed: results.filter((result) => result.status === 'FAILED').length,
      skipped: results.filter((result) => result.status === 'SKIPPED').length,
      results,
    };
  }

  async stats() {
    const groups = await this.prisma.outboxEvent.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const failedEvents = await this.prisma.outboxEvent.findMany({
      where: { status: OutboxStatus.FAILED },
      select: { id: true, type: true, aggregateId: true, lastError: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return {
      statuses: Object.fromEntries(
        groups.map((group) => [group.status, group._count._all]),
      ),
      pending: groups.find((group) => group.status === OutboxStatus.PENDING)?._count
        ._all ?? 0,
      failed: groups.find((group) => group.status === OutboxStatus.FAILED)?._count
        ._all ?? 0,
      failedEvents,
    };
  }

  private async processEvent(id: string): Promise<EventResult> {
    const claimed = await this.prisma.outboxEvent.updateMany({
      where: { id, status: OutboxStatus.PENDING },
      data: {
        status: OutboxStatus.PROCESSING,
        attempts: { increment: 1 },
      },
    });

    if (claimed.count === 0) {
      return { id, status: 'SKIPPED' };
    }

    const event = await this.prisma.outboxEvent.findUniqueOrThrow({
      where: { id },
    });

    try {
      if (event.type === 'order.created') {
        const payload = event.payload as unknown as OrderCreatedPayload;
        const external = await this.tagplusAcl.createOrder(payload);

        await this.prisma.$transaction([
          this.prisma.order.update({
            where: { id: event.aggregateId },
            data: {
              syncStatus: 'SYNCED',
              tagplusId: external.externalId,
            },
          }),
          this.prisma.syncLedger.upsert({
            where: {
              entity_localId_direction: {
                entity: 'Order',
                localId: event.aggregateId,
                direction: 'OUTBOUND',
              },
            },
            update: {
              externalId: external.externalId,
              status: 'SYNCED',
              syncedAt: new Date(),
              lastError: null,
            },
            create: {
              entity: 'Order',
              localId: event.aggregateId,
              externalId: external.externalId,
              direction: 'OUTBOUND',
              status: 'SYNCED',
              syncedAt: new Date(),
            },
          }),
          this.prisma.outboxEvent.update({
            where: { id },
            data: {
              status: OutboxStatus.PROCESSED,
              processedAt: new Date(),
              lastError: null,
            },
          }),
        ]);

        return { id, status: 'PROCESSED' };
      }

      await this.prisma.outboxEvent.update({
        where: { id },
        data: {
          status: OutboxStatus.PROCESSED,
          processedAt: new Date(),
          lastError: `Evento sem handler: ${event.type}`,
        },
      });

      return { id, status: 'PROCESSED' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const shouldFail = event.attempts >= MAX_ATTEMPTS;
      const backoffMs = Math.min(300_000, 2 ** event.attempts * 1000);

      this.logger.warn(
        `Falha ao processar evento ${id} (tentativa ${event.attempts}): ${message}`,
      );

      await this.prisma.$transaction([
        this.prisma.outboxEvent.update({
          where: { id },
          data: {
            status: shouldFail ? OutboxStatus.FAILED : OutboxStatus.PENDING,
            lastError: message,
            availableAt: new Date(Date.now() + backoffMs),
          },
        }),
        this.prisma.order.updateMany({
          where: { id: event.aggregateId },
          data: { syncStatus: 'FAILED' },
        }),
      ]);

      return { id, status: shouldFail ? 'FAILED' : 'RETRY', error: message };
    }
  }
}
