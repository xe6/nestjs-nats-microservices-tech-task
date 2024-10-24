import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HUBSPOT_MICROSERVICE } from './constants/provider-injection-tokens';
import { HUBSPOT_MICROSERVICE_QUEUE } from 'shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../nats.env'],
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: HUBSPOT_MICROSERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get('NATS_URL')],
            token: configService.get('NATS_TOKEN'),
            queue: HUBSPOT_MICROSERVICE_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
