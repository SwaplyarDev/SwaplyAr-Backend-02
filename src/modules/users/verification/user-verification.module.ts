import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerification } from '../entities/user-verification.entity';
import { User } from '../entities/user.entity';
import { UserVerificationController } from './user-verification.controller';
import { UserVerificationService } from './user-verification.service';
import { CloudinaryService } from '../../../service/cloudinary/cloudinary.service';
import { DiscountModule } from '@discounts/discounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserVerification, User]),
    DiscountModule,
  ],
  controllers: [UserVerificationController],
  providers: [UserVerificationService, CloudinaryService],
  exports: [UserVerificationService],
})
export class UserVerificationModule {}
