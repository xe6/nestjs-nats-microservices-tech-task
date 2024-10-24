import { Controller } from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { EventPattern } from '@nestjs/microservices';
import { HubspotMicroserviceRequestPatterns } from 'shared';
import { UpdateHubspotUserDto } from './dto';

@Controller()
export class HubspotController {
  constructor(private readonly hubspotService: HubspotService) {}

  @EventPattern(HubspotMicroserviceRequestPatterns.UPDATE_HUBSPOT_USER)
  public async updateHubspotContact(data: UpdateHubspotUserDto) {
    await this.hubspotService.updateHubspotContact(data);
  }
}
