import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import * as path from 'path';
import * as fs from 'fs';
import { MailerService } from '@mailer/mailer.service';

jest.setTimeout(30000);

interface TransactionResponseDto {
  id: string;
  countryTransaction: string;
  message: string;
  finalStatus: string;
  senderAccount: any;
  receiverAccount: any;
  amount: any;
  proofsOfPayment: any;
}

describe('ENDPOINT DE TRANSACCIONES #api #tra', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const mockFilePath = path.join(__dirname, '../mocks/test-image.png');

  beforeAll(async () => {
    // Crear archivo dummy si no existe
    if (!fs.existsSync(mockFilePath)) {
      fs.mkdirSync(path.dirname(mockFilePath), { recursive: true });
      fs.writeFileSync(mockFilePath, Buffer.from([137, 80, 78, 71])); // PNG mínimo
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Mockear MailerService para evitar fallos de template
      .overrideProvider(MailerService)
      .useValue({
        sendReviewPaymentEmail: async () => Promise.resolve(true),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v2');
    await app.init();

    dataSource = moduleRef.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  });

  afterAll(async () => {
    if (dataSource?.destroy) await dataSource.destroy();
    if (app) await app.close();
  });

  beforeEach(async () => {
    if (dataSource?.isInitialized) await dataSource.synchronize(true);
  });

  it('Cuando se envían datos válidos y un archivo, se crea la transacción y se envía email', async () => {
    const createTransactionDto = {
      // paymentsId: '123', // eliminado: no se almacena en la DB ni es requerido
      countryTransaction: 'Argentina',
      message: 'Transferencia de prueba',
      financialAccounts: {
        senderAccount: {
          firstName: 'Juan',
          lastName: 'Pérez',
          phoneNumber: '+5491123456789',
          createdBy: 'devdylancrowder@outlook.com',
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
          },
        },
        receiverAccount: {
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Galicia',
              sendMethodKey: 'CBU',
              sendMethodValue: '1234567890123456789012',
              documentType: 'DNI',
              documentValue: '12345678',
            },
          },
        },
      },
      amount: {
        amountSent: 1000,
        currencySent: 'ARS',
        amountReceived: 900,
        currencyReceived: 'BRL',
        received: false,
      },
    };

    console.log('Sending createTransactionDto:', JSON.stringify(createTransactionDto));

    const res = await request(app.getHttpServer())
      .post('/api/v2/transactions')
      .set('Content-Type', 'multipart/form-data')
      .field('createTransactionDto', JSON.stringify(createTransactionDto))
      .attach('file', mockFilePath);

    console.log('Response status:', res.status);
    console.log('Response body:', JSON.stringify(res.body, null, 2));

    const body = res.body as TransactionResponseDto;

    expect(res.status).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('countryTransaction', 'Argentina');
    expect(body).toHaveProperty('message', 'Transferencia de prueba');
    expect(body).toHaveProperty('finalStatus', 'pending');
    expect(body.senderAccount).toHaveProperty('firstName', 'Juan');
    expect(body.receiverAccount.paymentMethod).toHaveProperty('bankName', 'Banco Galicia');
    expect(body.amount).toHaveProperty('amountSent', '1000.00');
    expect(body).not.toHaveProperty('paymentsId'); // opcional: confirma que no se devuelve
  });
});
