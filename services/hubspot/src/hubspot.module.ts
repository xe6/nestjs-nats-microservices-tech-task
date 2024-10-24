import { Module } from '@nestjs/common';
import { HubspotController } from './hubspot.controller';
import { HubspotService } from './hubspot.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '../../nats.env'],
      isGlobal: true,
    }),
  ],
  controllers: [HubspotController],
  providers: [HubspotService],
})
export class HubspotModule {}
