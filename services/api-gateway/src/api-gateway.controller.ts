import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { UpdateUserDto } from './dto';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Patch('/users/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.apiGatewayService.updateUser(userId, updateUserDto);
  }
}
