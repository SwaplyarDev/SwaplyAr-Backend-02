import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import {
  AccountType,
  CreateBankAccountDto,
} from './dto/create-bank-account.dto';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';
import { BadRequestException } from '@nestjs/common';

const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };
const mockAccountsService = {
  createUserBank: jest.fn(),
  deleteBankAccount: jest.fn(),
  findAllByUser: jest.fn(),
};

describe('AccountsController', () => {
  let accountsController: AccountsController;

  const mockRequest = { user: { id: 'user-uuid-123' } };

  const createBankAccountDto: CreateBankAccountDto = {
    typeAccount: AccountType.BANK,
    formData: {
      currency: 'ARS',
      bank_name: 'Banco Nación',
      send_method_key: 'CBU',
      send_method_value: '1234567890123456789012',
      document_type: 'DNI',
      document_value: '12345678',
      alias: 'juan.nacion',
      branch: 'Sucursal Centro',
    },
    userAccValues: {
      first_name: 'Juan',
      last_name: 'Pérez',
      identification: '12345678',
      currency: 'ARS',
      account_name: 'Cuenta Principal',
      account_type: 1,
    },
  };

  const deleteDto: DeleteBankAccountDto = { bankAccountId: 'bank-uuid-123' };

  const expectCreateUserBankCalled = () => {
    expect(mockAccountsService.createUserBank).toHaveBeenCalledWith(
      createBankAccountDto.formData,
      createBankAccountDto.typeAccount,
      createBankAccountDto.userAccValues,
      mockRequest.user.id,
    );
  };

  const expectDeleteBankAccountCalled = (id: string) => {
    expect(mockAccountsService.deleteBankAccount).toHaveBeenCalledWith(
      mockRequest.user,
      id,
    );
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockAccountsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    accountsController = moduleRef.get<AccountsController>(AccountsController);

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(accountsController).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cuenta bancaria y devolver el resultado', async () => {
      const createdBankAccount = {
        id: 'bank-uuid-123',
        ...createBankAccountDto,
      };
      mockAccountsService.createUserBank.mockResolvedValue(createdBankAccount);

      const result = await accountsController.create(
        mockRequest,
        createBankAccountDto,
      );

      expectCreateUserBankCalled();
      expect(mockAccountsService.createUserBank).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: 'Banco creado correctamente',
        bank: createdBankAccount,
      });
    });

    it('debería lanzar un error si falla la creación de la cuenta bancaria', async () => {
      mockAccountsService.createUserBank.mockRejectedValueOnce(
        new BadRequestException('No se pudo crear la cuenta bancaria'),
      );

      await expect(
        accountsController.create(mockRequest, createBankAccountDto),
      ).rejects.toThrow(BadRequestException);

      expectCreateUserBankCalled();
      expect(mockAccountsService.createUserBank).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('debería eliminar una cuenta bancaria correctamente', async () => {
      mockAccountsService.deleteBankAccount.mockResolvedValueOnce({
        message: 'Cuenta eliminada correctamente',
      });

      const result = await accountsController.delete(mockRequest, deleteDto);

      expectDeleteBankAccountCalled(deleteDto.bankAccountId);
      expect(mockAccountsService.deleteBankAccount).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Cuenta eliminada correctamente' });
    });

    it('debería lanzar un error si la cuenta no existe', async () => {
      mockAccountsService.deleteBankAccount.mockRejectedValueOnce(
        new BadRequestException(
          'Cuenta no encontrada o no pertenece al usuario',
        ),
      );

      await expect(
        accountsController.delete(mockRequest, deleteDto),
      ).rejects.toThrow(BadRequestException);

      expectDeleteBankAccountCalled(deleteDto.bankAccountId);
      expect(mockAccountsService.deleteBankAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las cuentas del usuario autenticado', async () => {
      const expectedAccounts = [
        { id: 'bank-uuid-123', ...createBankAccountDto },
      ];
      mockAccountsService.findAllByUser.mockResolvedValue(expectedAccounts);

      const result = await accountsController.findAll(mockRequest);

      expect(mockAccountsService.findAllByUser).toHaveBeenCalledWith(
        mockRequest.user,
      );
      expect(mockAccountsService.findAllByUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedAccounts);
    });

    it('debería lanzar un error si falla la obtención de las cuentas', async () => {
      mockAccountsService.findAllByUser.mockRejectedValueOnce(
        new BadRequestException('Error al obtener las cuentas'),
      );

      await expect(accountsController.findAll(mockRequest)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockAccountsService.findAllByUser).toHaveBeenCalledWith(
        mockRequest.user,
      );
      expect(mockAccountsService.findAllByUser).toHaveBeenCalledTimes(1);
    });
  });
});
