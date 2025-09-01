import { BadRequestException } from '@nestjs/common';

export function validateFields(
  typeAccount: string,
  formData: Record<string, any>,
  typeVerif: 'create' | 'update',
) {
  const requiredFields = {
    bank: [
      'currency',
      'bank_name',
      'send_method_key',
      'send_method_value',
      'document_type',
      'document_value',
    ],

    virtual_bank: ['currency', 'email_account', 'transfer_code'],
    pix: ['virtual_bank_id', 'pix_key', 'cpf', 'pix_value'],
    paypal: ['email_account', 'transfer_code'],
    payoneer: ['email_account'],
    wise: ['iban', 'bic', 'email_account', 'transfer_code'],
    receiver_crypto: ['currency', 'network', 'wallet'],
  };

  const updateFields = {
    bank: ['bank_id', 'account_id'],
    pix: ['pix_id', 'account_id'],
    paypal: ['paypal_id', 'account_id'],
    payoneer: ['payoneer_id', 'account_id'],
    wise: ['wise_id', 'account_id'],
    receiver_crypto: ['crypto_id', 'account_id'],
  };

  if (!requiredFields[typeAccount]) {
    throw new BadRequestException(`Invalid account type: ${typeAccount}`);
  }

  const missingFields = requiredFields[typeAccount].filter((field) => !formData[field]);
  if (missingFields.length) {
    throw new BadRequestException(
      `Missing required fields for ${typeAccount} account: ${missingFields.join(', ')}`,
    );
  }

  if (typeVerif === 'update' && updateFields[typeAccount]) {
    const missingUpdateFields = updateFields[typeAccount].filter((field) => !formData[field]);
    if (missingUpdateFields.length) {
      throw new BadRequestException(
        `Missing required fields for updating ${typeAccount} account: ${missingUpdateFields.join(', ')}`,
      );
    }
  }
}
