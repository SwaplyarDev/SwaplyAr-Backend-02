export const normalizeEmail = (email?: string) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

export const isValidEmail = (email?: string) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getPaymentMethodImg = (method?: string, currency?: string): string => {
  switch (method) {
    case 'paypal':
      return currency === 'USD'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224913/paypal.big_phrzvb.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png';
    case 'payoneer':
      return currency === 'EUR'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224887/payoneer.eur.big_xxdjxd.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224899/payoneer.usd.big_djd07t.png';
    case 'bank':
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725223550/banco.medium_vy2eqp.webp';
    case 'wise':
      return currency === 'EUR'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225416/wise.eur.big_etdolw.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225432/wise.usd.big_yvnpez.png';
    case 'tether':
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329683/TetherLight_jkyojt.png';
    case 'pix':
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329734/Pix1_lib603.png';
    default:
      return '';
  }
};
