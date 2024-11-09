import { Db, Document, InsertOneResult } from 'mongodb';
import { SaveActionPayload } from '../core/types';
import { Usecase } from '@commons/types';
import { Service } from 'typedi';

interface CoreEngineInsertActionUsecaseInput {
  data: SaveActionPayload;
  db: Db;
  collectionName: string;
}

@Service()
export class CoreEngineInsertActionUsecase
  implements Usecase<CoreEngineInsertActionUsecaseInput, InsertOneResult>
{
  execute(
    input: CoreEngineInsertActionUsecaseInput
  ): Promise<InsertOneResult<Document>> {
    return input.db.collection(input.collectionName).insertOne(input.data);
  }
}
