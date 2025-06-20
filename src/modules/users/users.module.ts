// src/modules/users/users.module.ts
import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService }    from './users.service';
import { User }            from './entities/user.entity';
import { OtpModule }       from '@otp/otp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // sólo ENTIDAD User
    OtpModule,                         // módulo OTP para enviar al registrar
  ],
  controllers: [UsersController],
  providers:   [UsersService],
  exports:     [UsersService],
})
export class UsersModule {}
