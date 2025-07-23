

import { Test, TestingModule } from '@nestjs/testing';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { AuthService } from '@auth/auth.service';

describe ('OtpController', () => {

  let controller: OtpController;

  let otpService: {

    sendOtpToEmail: jest.Mock;
    validateOtpAndGetUser: jest.Mock;

  };

  let authService: {

    generateTokens: jest.Mock;

  };

  beforeEach (async () => {

    otpService = {

      sendOtpToEmail: jest.fn (),
      validateOtpAndGetUser: jest.fn (),

    };

    authService = {

      generateTokens: jest.fn (),

    };

    const module: TestingModule = await Test.createTestingModule ({

      controllers: [OtpController],

      providers: [

        { provide: OtpService, useValue: otpService },
        { provide: AuthService, useValue: authService },

      ],

    }).compile ();

    controller = module.get <OtpController> (OtpController);

  });

  it ('Debe enviar un código OTP al e-mail y devolver un mensaje de éxito', async () => {

    const dto = { email: 'test@example.com' };
    otpService.sendOtpToEmail.mockResolvedValue (undefined); 
    const result = await controller.send (dto);
    expect (otpService.sendOtpToEmail).toHaveBeenCalledWith (dto.email);

    expect (result).toEqual ({

      success: true,
      message: 'Código enviado correctamente',

    });

  });

});
