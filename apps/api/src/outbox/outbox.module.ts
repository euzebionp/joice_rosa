import { Module } from '@nestjs/common';
import { IntegrationsModule } from '../integrations/integrations.module';
import { OutboxController } from './outbox.controller';
import { OutboxService } from './outbox.service';

@Module({
  imports: [IntegrationsModule],
  controllers: [OutboxController],
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
