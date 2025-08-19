
export class VerificationDataDto {

  verification_id: string;
  verification_status: string;

}

export class CreateVerificationResponseDto {

  success: boolean;
  message: string;
  data: VerificationDataDto;

}





