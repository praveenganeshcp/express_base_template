import Container, { Service } from 'typedi';
import {
    PlaceholderDataSource,
    RequestDataAsyncValidation,
    RequestDataValidation,
  } from '../core/types';
  import { Db } from 'mongodb';
import { ValueAssertorService } from './value-assertor.service';
import { CRUDActionExecutorUsecase } from '../usecases/crud-action-executor.usecase';
import { HttpException } from '@commons/types';
  
  interface RequestDataAsyncValidatorInput {
    db: Db;
    requestData: PlaceholderDataSource;
    validations: RequestDataValidation;
  }
  
  @Service()
  export class RequestDataAsyncValidatorService {
  
    private readonly valueAssetor = Container.get(ValueAssertorService)
  
    private readonly crudActionExecutor = Container.get(CRUDActionExecutorUsecase)
  
    async validateAsync(data: RequestDataAsyncValidatorInput) {
      const { validations, requestData, db } = data;
      if (validations.body) {
        for (let key of Object.keys(requestData.requestBody)) {
          if (validations.body?.[key]) {
            await this.runDbQueries(db, validations.body[key]?.async);
          }
        }
      }
    }
  
    private async runDbQueries(
      db: Db,
      validations: RequestDataAsyncValidation[] = []
    ) {
      for (const validation of validations) {
        const result = await this.crudActionExecutor.execute({
          db,
          actionDef: {
            collectionName: validation.collectionName,
            payload: {
              filter: validation.query,
              options: {},
            },
            operation: validation.operation,
          },
        });
        if (
          !this.valueAssetor.assert(
            result,
            validation.expectedValue,
            validation.operator
          )
        ) {
          throw new HttpException(validation.message, 400);
        }
      }
    }
  }
  