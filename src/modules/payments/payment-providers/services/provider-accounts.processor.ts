// services/provider-accounts.processor.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderAccountsProcessor {
  process(
    accounts: any[],
    providersMap: Map<string, any>,
    filters?: {
      platformCode?: string;
      fiatCurrencyCode?: string;
      cryptoNetworkCode?: string;
    },
  ) {
    for (const account of accounts) {
      const provider = account.paymentProvider;

      if (filters?.platformCode && provider.paymentPlatform.code !== filters.platformCode) {
        continue;
      }

      // FIAT
      if (filters?.fiatCurrencyCode) {
        if (!('currency' in account)) continue;
        if (account.currency !== filters.fiatCurrencyCode) continue;
      }

      // CRYPTO
      if (filters?.cryptoNetworkCode) {
        if (!('cryptoNetwork' in account)) continue;
        if (account.cryptoNetwork?.code !== filters.cryptoNetworkCode) continue;
      }

      const providerId = provider.paymentProviderId;

      if (!providersMap.has(providerId)) {
        providersMap.set(providerId, {
          provider,
          accounts: [],
        });
      }

      providersMap.get(providerId).accounts.push(account);
    }
  }
}
