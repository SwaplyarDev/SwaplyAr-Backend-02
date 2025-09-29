import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserLocation } from '@users/entities/user-location.entity';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { UserSocials } from '@users/entities/user-socials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, UserLocation, UserSocials]), FileUploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
