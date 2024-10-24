import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USER_MICROSERVICE_QUEUE } from 'shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // >> Create an application context to access ConfigService
  const appContext = await NestFactory.createApplicationContext(UserModule);
  const configService = appContext.get(ConfigService);

  const natsUrl = configService.get<string>('NATS_URL');
  const natsAuthToken = configService.get<string>('NATS_TOKEN');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        token: natsAuthToken,
        queue: USER_MICROSERVICE_QUEUE,
      },
    },
  );

  await app.listen();
}
bootstrap();
