// Variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.REGION = 'us-east-1';
process.env.USERS_TABLE = 'test-users-table';

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  __esModule: true,
  default: {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: jest.fn().mockReturnValue({
          promise: jest.fn()
        }),
        get: jest.fn().mockReturnValue({
          promise: jest.fn()
        }),
        scan: jest.fn().mockReturnValue({
          promise: jest.fn()
        }),
        query: jest.fn().mockReturnValue({
          promise: jest.fn()
        })
      }))
    }
  }
}));