import { IFusion } from '../utils/types/fusion.types';
import { DatabaseResult, IFusionRepository } from '../utils/types/database.types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand,PutCommandInput,ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { Fusion } from '@/models/Fusion';

export class FusionRepository implements IFusionRepository {

  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;


  constructor() {
    this.tableName = process.env.FUSIONS_TABLE || 'Fusions';
    this.client = new DynamoDBClient({
      region: process.env.REGION || process.env.AWS_REGION || 'us-east-1',
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public async create(fusion: Fusion): Promise<Fusion> {
    try {
      const params: PutCommandInput = {
        TableName: this.tableName,
        Item: fusion.toJSON()
      };

      await this.docClient.send(new PutCommand(params));
      return fusion;
    } catch (error: any) {
      console.error('Error creating fusion:', error.message);
      throw new Error(`Error creating fusion: ${error.message}`);
    }
  }

  public async findAll(
    limit: number = 50, 
    lastEvaluatedKey: string | null = null
  ): Promise<DatabaseResult<IFusion>> {
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
        data: (result.Items as IFusion[]) || [],
        lastEvaluatedKey: result.LastEvaluatedKey?.id as string || null,
        count: result.Items?.length || 0
      };
    } catch (error: any) {
      console.error('Error finding all fusions:', error.message);
      throw new Error(`Error finding all fusions: ${error.message}`);
    }
  }
}