

/**
 * Test unitario para el controlador AuthController.
 * 
 * Este archivo prueba la funcionalidad de renovación del access token 
 * utilizando un refresh token válido.
 * 
 * Se utiliza un mock de AuthService para verificar que el controlador
 * llama correctamente al método `refreshAccessToken` y retorna el token esperado.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@auth/auth.service';

describe ('AuthController', () => {

  let controller: AuthController;

  let authService: {

    refreshAccessToken: jest.Mock;

  };


  beforeEach (async () => {

    authService = {

      refreshAccessToken: jest.fn (),

    };

    const module: TestingModule = await Test.createTestingModule ({

      controllers: [AuthController],

      providers: [

        { provide: AuthService, useValue: authService },

      ],

    }).compile ();

    controller = module.get <AuthController> (AuthController);

  });

  it ('Debe renovar el accsess token usando refresh token', async () => {

    const dto = { refresh_token: 'refresh123' };
    const expectedtoken = { access_token: 'refresh123'};
    authService.refreshAccessToken.mockResolvedValue (expectedtoken); 
    const result = await controller.refresh (dto);  
    expect (authService.refreshAccessToken).toHaveBeenCalledWith (dto.refresh_token);
    expect (result).toEqual (expectedtoken);

  })

});