import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { DeleteBankAccountDto } from './dto/delete-user-account.dto';
import { BadRequestException } from '@nestjs/common';

const mockJwtAuthGuard = { canActivate: jest.fn(() => true) };
const mockRolesGuard = { canActivate: jest.fn(() => true) };
const mockAccountsService = {
  createUserAccountWithFinancial: jest.fn(),
  deleteUserAccount: jest.fn(),
  findAllAccount: jest.fn(),
  findOneUserAccount: jest.fn(),
};

describe('AccountsController', () => {
  let accountsController: AccountsController;

  const mockRequest = { user: { id: 'user-uuid-123' } };

  const createBankAccountDto: CreateUserAccountDto = {
    platformId: 'bank' as any,
    method: 'bank',
    firstName: 'Juan',
    lastName: 'Pérez',
    accountName: 'Cuenta Principal',
    bank: {
      currency: 'ARS',
      bankName: 'Banco Nación',
      sendMethodKey: 'CBU',
      sendMethodValue: '1234567890123456789012',
      documentType: 'DNI',
      documentValue: '87654321',
    },
  };

  const deleteDto: DeleteBankAccountDto = { userAccountId: 'bank-uuid-123' };

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
      const createdAccount = {
        id: 'account-uuid-1',
        ...createBankAccountDto,
      };

      const expectedResult = {
        message: 'Cuenta financiera creada correctamente',
        bank: createdAccount,
      };

      mockAccountsService.createUserAccountWithFinancial.mockResolvedValue(createdAccount);

      const result = await accountsController.create(mockRequest, createBankAccountDto);

      expect(result).toEqual(expectedResult);
      expect(mockAccountsService.createUserAccountWithFinancial).toHaveBeenCalledWith(
        mockRequest.user.id,
        expect.objectContaining({
          platformId: 'bank',
          method: 'bank',
          bank: expect.any(Object),
        }),
        expect.objectContaining({
          firstName: 'Juan',
          lastName: 'Pérez',
          accountName: 'Cuenta Principal',
        }),
      );
    });

    it('debería lanzar un error si falla la creación de la cuenta bancaria', async () => {
      mockAccountsService.createUserAccountWithFinancial.mockRejectedValueOnce(
        new BadRequestException('No se pudo crear la cuenta bancaria'),
      );

      await expect(accountsController.create(mockRequest, createBankAccountDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockAccountsService.createUserAccountWithFinancial).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('debería eliminar una cuenta bancaria correctamente', async () => {
      mockAccountsService.deleteUserAccount.mockResolvedValueOnce({
        message: 'Cuenta eliminada correctamente',
      });

      const result = await accountsController.delete(mockRequest, deleteDto);

      expect(mockAccountsService.deleteUserAccount).toHaveBeenCalledWith(
        mockRequest.user,
        deleteDto.userAccountId,
      );
      expect(result).toEqual({ message: 'Cuenta eliminada correctamente' });
    });

    it('debería lanzar un error si la cuenta no existe', async () => {
      mockAccountsService.deleteUserAccount.mockRejectedValueOnce(
        new BadRequestException('Cuenta no encontrada o no pertenece al usuario'),
      );

      await expect(accountsController.delete(mockRequest, deleteDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockAccountsService.deleteUserAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('debería devolver todas las cuentas del usuario autenticado', async () => {
      const expectedAccounts = [{ id: 'bank-uuid-123', ...createBankAccountDto }];
      mockAccountsService.findAllAccount.mockResolvedValue(expectedAccounts);

      const result = await accountsController.findAll(mockRequest);

      expect(mockAccountsService.findAllAccount).toHaveBeenCalledWith(mockRequest.user.id);
      expect(result).toEqual(expectedAccounts);
    });

    it('debería lanzar un error si falla la obtención de las cuentas', async () => {
      mockAccountsService.findAllAccount.mockRejectedValueOnce(
        new BadRequestException('Error al obtener las cuentas'),
      );

      await expect(accountsController.findAll(mockRequest)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneUserBank', () => {
    it('debería devolver una cuenta bancaria específica de un usuario', async () => {
      const userId = 'user-uuid-123';
      const bankAccountId = 'bank-uuid-456';

      const expectedAccount = {
        accountName: 'Cuenta Principal',
        currency: 'USD',
        status: true,
        payment_type: 'paypal',
        details: [
          {
            account_id: bankAccountId,
            email_account: 'juan@example.com',
            transfer_code: 'XYZ123',
          },
        ],
      };

      mockAccountsService.findOneUserAccount.mockResolvedValue(expectedAccount);

      const result = await accountsController.findOneUserBank(userId, bankAccountId);

      expect(result).toEqual(expectedAccount);
      expect(mockAccountsService.findOneUserAccount).toHaveBeenCalledWith(userId, bankAccountId);
    });

    it('debería lanzar un error si la cuenta no se encuentra', async () => {
      const userId = 'user-uuid-123';
      const bankAccountId = 'bank-uuid-456';

      mockAccountsService.findOneUserAccount.mockRejectedValue(new Error('Cuenta no encontrada'));

      await expect(accountsController.findOneUserBank(userId, bankAccountId)).rejects.toThrow(
        'Cuenta no encontrada',
      );
    });
  });
});



