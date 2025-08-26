import { User } from '../models/User';
import { IUser } from '../utils/types/user.types';
import { DatabaseResult, IUserRepository } from '../utils/types/database.types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand,PutCommandInput,ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';

export class UserRepository implements IUserRepository {

  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;


  constructor() {
    this.tableName = process.env.USERS_TABLE || 'Users';
    this.client = new DynamoDBClient({
      // Puedes agregar configuración específica aquí si es necesario
      region: process.env.REGION || process.env.AWS_REGION || 'us-east-1',
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public async create(user: User): Promise<User> {
    try {
      const params: PutCommandInput = {
        TableName: this.tableName,
        Item: user.toJSON(),
        ConditionExpression: 'attribute_not_exists(email)'
      };

      await this.docClient.send(new PutCommand(params));
      return user;
    } catch (error: any) {
      if (error instanceof ConditionalCheckFailedException || error.name === 'ConditionalCheckFailedException') {
        throw new Error('Email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  public async findAll(
    limit: number = 50, 
    lastEvaluatedKey: string | null = null
  ): Promise<DatabaseResult<IUser>> {
    try {
      const params: ScanCommandInput = {
        TableName: this.tableName,
        Limit: limit
      };

      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = { id: lastEvaluatedKey };
      }

      const result = await this.docClient.send(new ScanCommand(params));

      return {
        data: (result.Items as IUser[]) || [],
        lastEvaluatedKey: result.LastEvaluatedKey?.id as string || null,
        count: result.Items?.length || 0
      };
    } catch (error: any) {
      throw new Error(`Error finding all users: ${error.message}`);
    }
  }
}