import { Module } from '@nestjs/common';
import { HttpTagPlusClient, MockTagPlusClient } from './tagplus/tagplus.client';
import { TagPlusAclService } from './tagplus/tagplus-acl.service';
import { TAGPLUS_CLIENT } from './tagplus/tagplus.types';

@Module({
  providers: [
    TagPlusAclService,
    {
      provide: TAGPLUS_CLIENT,
      useFactory: () =>
        process.env.TAGPLUS_MODE === 'http'
          ? new HttpTagPlusClient()
          : new MockTagPlusClient(),
    },
  ],
  exports: [TAGPLUS_CLIENT, TagPlusAclService],
})
export class IntegrationsModule {}
