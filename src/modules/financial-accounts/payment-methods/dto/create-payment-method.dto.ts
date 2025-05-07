export class CreatePaymentMethodDto {
  platformId: string; // fk de la tabla plataform
  method_type: 'bank' | 'virtul_bank' | 'receiver_crypto' | 'pix';
  methodId: string; // fk de la tabla de banco o billeteras
}
