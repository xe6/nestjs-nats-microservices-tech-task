import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMicroserviceRequestPatterns } from 'shared';
import { UpdateUserDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMicroserviceRequestPatterns.UPDATE_USER)
  public async updateUser(
    @Payload()
    data: UpdateUserDto,
  ) {
    return this.userService.updateUser(data);
  }
}
