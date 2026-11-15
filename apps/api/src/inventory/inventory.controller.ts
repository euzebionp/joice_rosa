import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get(':sku')
  availability(@Param('sku') sku: string) {
    return this.inventory.availability(sku);
  }
}
