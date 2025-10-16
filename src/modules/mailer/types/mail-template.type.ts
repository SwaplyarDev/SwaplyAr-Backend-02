export type MailPayload = {
  ID?: string;
  NAME: string;
  VERIFICATION_CODE: string;
  BASE_URL: string;
  LOCATION?: string;
  EXPIRATION_MINUTES: number;
};

export type MailTemplateInfo = {
  file: string;
  subject: string;
};
