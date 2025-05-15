export class CreateAdminUserDto {
  nombreCompleto: string;
  nombre: string;
  apellido: string;
  horaTrabajo?: Date;
  horaEntrada?: Date;
  horaSalida?: Date;
  phone?: string;
  mail?: string;
  dni?: string;
  fechaContratacion?: Date;
} 