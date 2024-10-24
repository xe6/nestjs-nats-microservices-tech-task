import { Injectable, Logger } from '@nestjs/common';
import { UpdateHubspotUserDto } from './dto';
import { Client as HubspotClient } from '@hubspot/api-client';
import { ConfigService } from '@nestjs/config';
import pRetry from 'p-retry';

@Injectable()
export class HubspotService {
  private readonly logger = new Logger(HubspotService.name);
  private hubspotSdk: HubspotClient;

  constructor(private readonly configService: ConfigService) {
    this.hubspotSdk = new HubspotClient({
      accessToken: configService.get<string>('HUBSPOT_ACCESS_TOKEN'),
    });
  }

  public async updateHubspotContact(data: UpdateHubspotUserDto) {
    if (!data.firstName && !data.lastName) {
      this.logger.warn(
        `Nothing to update for user ${data.email}, empty firstName and lastName`,
      );
      return;
    }

    try {
      await pRetry(
        async (attempt) => {
          this.logger.log(`Attempt No. 1 ${attempt} to update Hubspot...`);
          await this.hubspotSdk.crm.contacts.basicApi.update(
            data.email,
            {
              properties: {
                // >> Updating only firstName and lastName,
                // >> because email is used as the identifier
                firstname: data.firstName,
                lastname: data.lastName,
              },
            },
            'email',
          );

          this.logger.log('Hubspot update successful!');
        },
        {
          retries: 3,
          factor: 2, // >> Exponential backoff factor to wait longer after each attempt
          minTimeout: 5000,
          onFailedAttempt: (error) => {
            this.logger.warn(
              `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left. Error: ${error.message}`,
            );
          },
        },
      );
    } catch (error) {
      this.logger.error('Hubspot update failed after maximum retries', error);
    }
  }
}
