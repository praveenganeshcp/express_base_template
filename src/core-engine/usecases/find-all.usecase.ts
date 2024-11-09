import { Db } from 'mongodb';
import { FindActionPayload } from '../core/types';
import { Service } from 'typedi';
import { Usecase } from '@commons/types';

interface CoreEngineFindAllActionUsecaseInput {
  query: FindActionPayload;
  db: Db;
  collectionName: string;
}

@Service()
export class CoreEngineFindAllActionUsecase
  implements Usecase<CoreEngineFindAllActionUsecaseInput, Object[]>
{
  execute(input: CoreEngineFindAllActionUsecaseInput): Promise<Object[]> {
    return input.db
      .collection(input.collectionName)
      .find(input.query.filter, input.query.options)
      .toArray();
  }
}
