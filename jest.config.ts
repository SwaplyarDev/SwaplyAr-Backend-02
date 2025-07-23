

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
  '^src/(.*)$': '<rootDir>/src/$1',
},
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
