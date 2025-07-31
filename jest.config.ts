

/**
 * Configuración de Jest para ejecutar tests en un proyecto NestJS con TypeScript.
 * Incluye:
 * - Integración con ts-jest como preset.
 * - Entorno de test configurado como 'node'.
 * - Alias de rutas personalizados definidos en moduleNameMapper para facilitar las importaciones.
 * - Reconocimiento de archivos .ts, .js y .json.
 * - Patrón de nombres para reconocer archivos de pruebas (testRegex).
 * - Transformación de archivos TS/JS usando ts-jest.
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
 moduleNameMapper: {
  '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
  '^@users/(.*)$': '<rootDir>/src/modules/users/$1',
  '^@transactions/(.*)$': '<rootDir>/src/modules/transactions/$1',
  '^@mailer/(.*)$': '<rootDir>/src/modules/mailer/$1',
  '^@financial-accounts/(.*)$': '<rootDir>/src/modules/financial-accounts/$1',
  '^@common/(.*)$': '<rootDir>/src/common/$1',
  '^src/(.*)$': '<rootDir>/src/$1',
},
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
