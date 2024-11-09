import {
    PlaceholderDataSource,
    RequestDataValidation,
  } from '../core/types';
  import { Db } from 'mongodb';
  import { RequestDataValidatorService } from './request-data-validator.service';
import { Container, Service } from 'typedi';
import { RequestDataAsyncValidatorService } from './request-data-async-validator';
  
  interface RequestDataValidatorFacadeInput {
    db: Db;
    requestData: PlaceholderDataSource;
    validations: RequestDataValidation;
  }
  
  @Service()
  export class RequestDataValidatorFacadeService {
    private readonly requestDataValidatorService: RequestDataValidatorService = Container.get(RequestDataValidatorService);
    private readonly requestDataAsyncValidatorService: RequestDataAsyncValidatorService = Container.get(RequestDataAsyncValidatorService);
  
    async validate(input: RequestDataValidatorFacadeInput) {
      this.requestDataValidatorService.validate({
        requestData: input.requestData,
        validations: input.validations,
      });
  
      await this.requestDataAsyncValidatorService.validateAsync({
        db: input.db,
        requestData: input.requestData,
        validations: input.validations,
      });
    }
  }
  