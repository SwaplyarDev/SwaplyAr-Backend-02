/**
 * Reglas de comisiones hardcodeadas (versión inicial)
 * La comisión se aplica SIEMPRE en el destino (plataforma receptora)
 * Algunas relaciones usan una divisa base (USD o EUR) según el cálculo mostrado en la tabla original.***
 */

export const COMMISSION_RULES = [
  // === BANCO → PLATAFORMAS ===
  { from: 'Banco ARS', to: 'Payoneer USD', rate: 0.04, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'PayPal USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'PayPal EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Banco BRL', to: 'PayPal USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'Payoneer EUR', rate: 0.04, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'Wise USD', rate: 0.04, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'Wise EUR', rate: 0.04, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'Banco BRL', rate: 0.05, chargedBy: 'destination' },
  { from: 'Banco ARS', to: 'tether USD', rate: 0.04, chargedBy: 'destination' },

  // === PAYPAL → OTROS ===
  { from: 'PayPal USD', to: 'Banco ARS', rate: 0.12, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'Banco BRL', rate: 0.14, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'Payoneer USD', rate: 0.14, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'Payoneer EUR', rate: 0.14, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'Wise USD', rate: 0.14, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'Wise EUR', rate: 0.14, chargedBy: 'destination' },
  { from: 'PayPal USD', to: 'tether USD', rate: 0.14, chargedBy: 'destination' },


  // === PAYONEER → OTROS ===
  { from: 'Payoneer EUR', to: 'Banco ARS', rate: 0.04, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'Banco BRL', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Banco ARS', rate: 0.04, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Banco BRL', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'PayPal USD', rate: 0.04, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'PayPal EUR', rate: 0.04, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'PayPal USD', rate: 0.02, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'PayPal EUR', rate: 0.02, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'Payoneer USD', rate: 0.02, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Payoneer EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'Wise USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'Wise EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Wise USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Wise EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Wise EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer EUR', to: 'Tether USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Payoneer USD', to: 'Tether USD', rate: 0.05, chargedBy: 'destination' },

  // === WISE → OTROS ===
  { from: 'Wise EUR', to: 'Banco ARS', rate: 0.04, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'Banco BRL', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'Banco ARS', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'Banco BRL', rate: 0.06, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'PayPal USD', rate: 0.02, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'PayPal USD', rate: 0.02, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'Payoneer EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'Payoneer USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'Payoneer EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'Payoneer USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'Wise EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'Wise USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise EUR', to: 'tether USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Wise USD', to: 'tether USD', rate: 0.05, chargedBy: 'destination' },
  
  
  // === TETHER (USDT) → OTROS ===
  { from: 'Tether USD', to: 'Banco ARS', rate: 0.04, chargedBy: 'destination' },
  { from: 'Tether USD', to: 'Banco BRL', rate: 0.05, chargedBy: 'destination' }, 
  { from: 'Tether USD', to: 'PayPal USD', rate: 0.02, chargedBy: 'destination' },
  { from: 'Tether USD', to: 'Payoneer EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Tether USD', to: 'Payoneer USD', rate: 0.05, chargedBy: 'destination' },
  { from: 'Tether USD', to: 'Wise EUR', rate: 0.05, chargedBy: 'destination' },
  { from: 'Tether USD', to: 'Wise USD', rate: 0.05, chargedBy: 'destination' },
];
