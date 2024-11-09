import Container, { Service } from 'typedi';
import {
  ALLOWED_DB_OPERATIONS,
  CRUDActionDefinition,
  CRUDActionResponse,
  FindActionPayload,
} from '../core/types';
import { Db } from 'mongodb';
import { CanBeNull, Usecase } from '@commons/types';
import { CoreEngineInsertActionUsecase } from './insert-one.usecase';
import { CoreEngineFindOneActionUsecase } from './find-one.usecase';
import { CoreEngineFindAllActionUsecase } from './find-all.usecase';
import { CoreEngineUnSupportedActionException } from '../core/exceptions';

interface CRUDActionExecutorUsecaseInput {
  db: Db;
  actionDef: CRUDActionDefinition;
}

@Service()
export class CRUDActionExecutorUsecase
  implements
    Usecase<CRUDActionExecutorUsecaseInput, CanBeNull<CRUDActionResponse>>
{

    private readonly insertActionUsecase: CoreEngineInsertActionUsecase = Container.get(CoreEngineInsertActionUsecase);
    private readonly findOneActionUsecase: CoreEngineFindOneActionUsecase = Container.get(CoreEngineFindOneActionUsecase);
    private readonly findAllActionUsecase: CoreEngineFindAllActionUsecase = Container.get(CoreEngineFindAllActionUsecase)

  async execute(
    data: CRUDActionExecutorUsecaseInput
  ): Promise<CanBeNull<CRUDActionResponse>> {
    const { db, actionDef } = data;
    switch (actionDef.operation) {
      case ALLOWED_DB_OPERATIONS.insertOne: {
        const result = await this.insertActionUsecase.execute({
          db,
          collectionName: actionDef.collectionName,
          data: actionDef.payload,
        });
        return result;
      }
      case ALLOWED_DB_OPERATIONS.findOne: {
        const result = await this.findOneActionUsecase.execute({
          db,
          collectionName: actionDef.collectionName,
          query: actionDef.payload as FindActionPayload,
        });
        return result;
      }
      case ALLOWED_DB_OPERATIONS.find: {
        const result = await this.findAllActionUsecase.execute({
          db,
          collectionName: actionDef.collectionName,
          query: actionDef.payload as FindActionPayload,
        });
        return result;
      }
      default: {
        throw new CoreEngineUnSupportedActionException(actionDef.operation);
      }
    }
  }
}
