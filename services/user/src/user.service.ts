import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { HUBSPOT_MICROSERVICE } from './constants/provider-injection-tokens';
import { ClientProxy } from '@nestjs/microservices';
import { HubspotMicroserviceRequestPatterns } from 'shared';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(HUBSPOT_MICROSERVICE) private hubspotMicroservice: ClientProxy,
  ) {}

  public async updateUser({ userId, ...data }: UpdateUserDto) {
    // >> Mocked call to DB to update local database
    await this.mockedUpdate(userId, data);
    // >> Asynchronously firing Hubspot update to keep it in sync
    // >> Assuming user exists (should be checked during DB update)
    this.hubspotMicroservice.emit(
      HubspotMicroserviceRequestPatterns.UPDATE_HUBSPOT_USER,
      data,
    );
    return {
      success: true,
      message: 'User updated in DB; Hubspot update fired.',
    };
  }

  private async mockedUpdate(
    userId: string,
    data: Omit<UpdateUserDto, 'userId'>,
  ): Promise<void> {
    this.logger.log(
      `Updated user ${userId} with data: ${JSON.stringify(data)}`,
    );
    return new Promise((resolve) => setTimeout(resolve, 100));
  }
}
