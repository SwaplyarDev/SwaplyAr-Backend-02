import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contants.entity';
import { ContactController } from './contacts.controller';
import { ContactService } from './contacts.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), UsersModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
