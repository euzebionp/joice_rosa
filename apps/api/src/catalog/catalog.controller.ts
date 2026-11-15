import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ListProductsQueryDto } from './dto/list-products.query';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  list(@Query() query: ListProductsQueryDto) {
    return this.catalog.list(query);
  }

  @Get('facets')
  facets() {
    return this.catalog.facets();
  }

  @Get('variants/:sku')
  variant(@Param('sku') sku: string) {
    return this.catalog.findVariantBySku(sku);
  }

  @Get('products/:slug')
  detail(@Param('slug') slug: string) {
    return this.catalog.findBySlug(slug);
  }
}
