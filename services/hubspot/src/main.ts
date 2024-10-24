import { NestFactory } from '@nestjs/core';
import { HubspotModule } from './hubspot.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HUBSPOT_MICROSERVICE_QUEUE } from 'shared';

async function bootstrap() {
  // >> Create an application context to access ConfigService
  const appContext = await NestFactory.createApplicationContext(HubspotModule);
  const configService = appContext.get(ConfigService);

  const natsUrl = configService.get<string>('NATS_URL');
  const natsAuthToken = configService.get<string>('NATS_TOKEN');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    HubspotModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        token: natsAuthToken,
        queue: HUBSPOT_MICROSERVICE_QUEUE,
      },
    },
  );

  await app.listen();
}
bootstrap();
