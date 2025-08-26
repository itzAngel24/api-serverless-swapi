import { CreateUserData } from '../../../src/utils/types/user.types';

export const testUsers = {
  validUser: {
    name: 'John Doe',
    email: 'john.doe@example.com'
  } as CreateUserData,
  
  anotherValidUser: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com'
  } as CreateUserData,
  
  invalidUserNoName: {
    email: 'invalid@example.com'
  } as CreateUserData,
  
  invalidUserNoEmail: {
    name: 'No Email User'
  } as CreateUserData,
  
  invalidUserBadEmail: {
    name: 'Bad Email User',
    email: 'invalid-email'
  } as CreateUserData,
  
  duplicateEmailUser: {
    name: 'Duplicate User',
    email: 'john.doe@example.com' // Same as validUser
  } as CreateUserData
};