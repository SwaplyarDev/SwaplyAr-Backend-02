/**
 * Test unitarios para el controlador OtpController.
 *
 * Este archivo valida dos funcionalidades principales:
 * 1. Envío de códigos OTP por correo electrónico.
 * 2. Validación de códigos OTP y generación de tokens de acceso.
 *
 * Se utilizan mocks para simular el comportamiento de OtpService y AuthService,
 * permitiendo testear el controlador de forma aislada.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { AuthService } from '@auth/auth.service';

describe('OtpController', () => {
  let controller: OtpController;

  let otpService: {
    sendOtpToEmail: jest.Mock;
    validateOtpAndGetUser: jest.Mock;
  };

  let authService: {
    generateTokens: jest.Mock;
  };

  beforeEach(async () => {
    otpService = {
      sendOtpToEmail: jest.fn(),
      validateOtpAndGetUser: jest.fn(),
    };

    authService = {
      generateTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],

      providers: [
        { provide: OtpService, useValue: otpService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    controller = module.get<OtpController>(OtpController);
  });

  it('Debe enviar un código OTP al e-mail y devolver un mensaje de éxito', async () => {
    const dto = { email: 'adrianclark@example.com' };
    otpService.sendOtpToEmail.mockResolvedValue(undefined);
    const result = await controller.send(dto);
    expect(otpService.sendOtpToEmail).toHaveBeenCalledWith(dto.email);

    expect(result).toEqual({
      success: true,
      message: 'Código enviado correctamente',
    });
  });

  it('Debe validar el código OTP y devolver tokens', async () => {
    const dto = { email: 'adrianclark@example.com', code: '123456' };
    const fakeUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: dto.email,
    };
    const tokens = { access_token: 'token123', refresh_token: 'refresh123' };
    otpService.validateOtpAndGetUser.mockResolvedValue(fakeUser);
    authService.generateTokens.mockResolvedValue(tokens);
    const result = await controller.validateAndLogin(dto);
    expect(otpService.validateOtpAndGetUser).toHaveBeenCalledWith(dto.email, dto.code);
    expect(authService.generateTokens).toHaveBeenCalledWith(fakeUser);
    expect(result).toEqual(tokens);
  });
});
