import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OutboxService } from './outbox/outbox.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const outbox = app.get(OutboxService);
  const intervalMs = Number(process.env.OUTBOX_POLL_INTERVAL_MS ?? 5000);
  let running = true;

  const tick = async () => {
    if (!running) {
      return;
    }
    try {
      const result = await outbox.processPending(20);
      if (result.scanned > 0) {
        console.log(
          `[outbox] analisados=${result.scanned} processados=${result.processed} retentativas=${result.retried} falhas=${result.failed}`,
        );
      }
    } catch (error) {
      console.error('[outbox] erro inesperado', error);
    }
  };

  const timer = setInterval(() => void tick(), intervalMs);

  const shutdown = async (signal: string) => {
    running = false;
    clearInterval(timer);
    console.log(`[outbox] encerrando (${signal})`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  await tick();
  console.log(`[outbox] worker ativo (intervalo ${intervalMs}ms)`);
}

void bootstrap();
