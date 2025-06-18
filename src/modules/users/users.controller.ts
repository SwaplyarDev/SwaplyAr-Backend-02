import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UsersService } from '@users//users.service';
import { User } from '@users/entities/user.entity';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)

  @Post('register')
  async register(@Body() userDto: RegisterUserDto): Promise<User> {
    return this.usersService.register(userDto);
  }
}
