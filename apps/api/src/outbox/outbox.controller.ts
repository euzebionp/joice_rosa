import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminTokenGuard } from '../common/admin-token.guard';
import { OutboxService } from './outbox.service';

@Controller('admin/outbox')
@UseGuards(AdminTokenGuard)
export class OutboxController {
  constructor(private readonly outbox: OutboxService) {}

  @Post('process')
  process(@Body('limit') limit?: number) {
    const parsed = Number(limit);
    return this.outbox.processPending(Number.isFinite(parsed) && parsed > 0 ? parsed : 20);
  }

  @Get('stats')
  stats() {
    return this.outbox.stats();
  }
}
