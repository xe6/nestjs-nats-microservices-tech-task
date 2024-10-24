import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MICROSERVICE } from './constants/provider-injection-tokens';
import { UserMicroserviceRequestPatterns } from 'shared';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject(USER_MICROSERVICE) private userMicroservice: ClientProxy,
  ) {}

  public async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    // >> Synchronously calling the user microservice to update the user
    return this.userMicroservice.send(
      UserMicroserviceRequestPatterns.UPDATE_USER,
      {
        ...updateUserDto,
        userId,
      },
    );
  }
}
