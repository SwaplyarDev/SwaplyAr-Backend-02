import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminMasterDto } from './create-admin-master.dto';

export class UpdateAdminMasterDto extends PartialType(CreateAdminMasterDto) {}
