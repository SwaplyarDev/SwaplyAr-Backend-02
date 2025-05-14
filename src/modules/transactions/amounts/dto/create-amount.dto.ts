export class CreateAmountDto {
    amount_sent: number; // cantidad enviada
    currency_sent: string; // moneda enviada
    amount_received: number; // cantidad recibida
    currency_received: string; // moneda recibida
    received: boolean; // recibido o no
}
