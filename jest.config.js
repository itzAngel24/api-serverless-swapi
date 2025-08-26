module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Archivos TypeScript
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  
  // Transformaciones
  transform: {
    '^.+\\.ts'
      : 'ts-jest',
  },
  
  // Path mapping para TypeScript
  moduleNameMapping: {
    '^@/(.*)'
      : '<rootDir>/src/$1',
    '^@tests/(.*)'
      : '<rootDir>/tests/$1'
  },
  
  // Extensiones de archivos
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/handlers/index.ts'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Ignores
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],
  
  // Configuración ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  
  // Timeout
  testTimeout: 10000,
  
  verbose: true,
  clearMocks: true
};