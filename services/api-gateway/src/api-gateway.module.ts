import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_MICROSERVICE_QUEUE } from 'shared';
import { USER_MICROSERVICE } from './constants/provider-injection-tokens';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../nats.env'],
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: USER_MICROSERVICE,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get('NATS_URL')],
            token: configService.get('NATS_TOKEN'),
            queue: USER_MICROSERVICE_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
