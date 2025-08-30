// prettier.config.js

/**
 * Prettier configuration file.
 * @see https://prettier.io/docs/configuration
 * @type {import('prettier').Config}
 */
module.exports = {
  // -------------------------------------------
  // Estilo de comillas
  singleQuote: true,         // Usa comillas simples en JS/TS
  jsxSingleQuote: false,     // Usa comillas dobles en JSX (por si luego hay UI)

  // -------------------------------------------
  // Punto y coma al final de sentencias
  semi: true,                // Siempre incluye punto y coma

  // -------------------------------------------
  // Líneas y envoltura de texto
  printWidth: 100,           // Longitud preferida de línea
  proseWrap: 'preserve',     // Mantiene saltos automáticos en Markdown según ya están

  // -------------------------------------------
  // Indentación
  tabWidth: 2,               // 2 espacios por nivel
  useTabs: false,            // No usar tabs

  // -------------------------------------------
  // Comas al final y espacios en llaves
  trailingComma: 'all',      // Coma final en objetos, arrays, etc.
  bracketSpacing: true,      // { foo: bar } con espacios entre llaves y propiedades

  // -------------------------------------------
  // Paréntesis en arrow functions
  arrowParens: 'always',     // Siempre incluir paréntesis: (x) => y

  // -------------------------------------------
  // Citas en propiedades de objetos
  quoteProps: 'as-needed',   // Solo comillas en claves cuando son necesarias

  // -------------------------------------------
  // Fin de línea
  endOfLine: 'lf',           // Forzar LF para evitar problemas en distintos sistemas operativos
};
