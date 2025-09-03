import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { MailerService } from '@mailer/mailer.service';
import { FakeMailerService } from './fake.mailer';

describe('ENDPOINT DE REGISTRO #api #sanity', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let mailer: FakeMailerService;

  beforeAll(async () => {
    process.env.DATABASE_TEST_URL = 'postgres://testuser:testpass@localhost:5438/testdb';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useClass(FakeMailerService)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v2');
    await app.init();

    dataSource = moduleRef.get(DataSource);
    mailer = moduleRef.get(MailerService) as FakeMailerService;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
    mailer.clear();
  });

  it('Cuando se envían datos válidos, se registra y envía email', async () => {
    const user = {
      firstName: 'dylan',
      lastName: 'rojo',
      email: 'devdylancrowder@outlook.com',
      termsAccepted: true,
    };

    const res = await request(app.getHttpServer()).post('/api/v2/users/register').send(user);

    // Status HTTP
    expect(res.status).toBe(201);

    // Validar propiedades del usuario devuelto
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('role', 'user');
    expect(res.body).toHaveProperty('termsAccepted', true);
    expect(res.body).toHaveProperty('isActive', true);
    expect(res.body).toHaveProperty('isValidated', false);

    // Validar mails enviados
    expect(mailer.sentMails.length).toBe(1);
    expect(mailer.sentMails[0].to).toBe('devdylancrowder@outlook.com');
  });

  it('Cuando se envía un email ya registrado, devuelve 409 y no envía mail', async () => {
    const user = {
      firstName: 'dylan',
      lastName: 'rojo',
      email: 'devdylancrowder@outlook.com',
      termsAccepted: true,
    };

    await request(app.getHttpServer()).post('/api/v2/users/register').send(user);
    mailer.clear();

    const res = await request(app.getHttpServer()).post('/api/v2/users/register').send(user);

    expect(res.status).toBe(409);
    expect(mailer.sentMails.length).toBe(0);
  });

  it('Cuando falta algún campo obligatorio, devuelve 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v2/users/register')
      .send({ firstName: 'dylan' }); // email y terms faltan

    expect(res.status).toBe(400);
  });
});
