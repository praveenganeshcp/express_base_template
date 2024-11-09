import { Db, MongoServerError, ObjectId } from 'mongodb';
import { CRUDActionResponse, CRUDEngineHttpMethods, PlaceholderDataSource, RequestDataValidation } from '../core/types';
import Container, { Service } from 'typedi';
import { Usecase } from '@commons/types';
import { VariableValuePopulaterService } from '../services/variable-value-populater';
import { DATABASE } from '@commons/tokens';
import { CoreEngineProcessingException } from '../core/exceptions';
import { CRUDActionExecutorUsecase } from './crud-action-executor.usecase';
import { RequestDataValidatorFacadeService } from '../services/request-data-validator-facade.service';
import { ParamsParserService } from '../services/params-parser.service';

export interface CoreEngineCRUDUsecaseInput {
  url: string;
  placeholderDataSouce: Omit<PlaceholderDataSource, 'crudSteps' | 'authUser'>;
  applicationId: ObjectId;
  method: CRUDEngineHttpMethods;
  token?: string;
  matchedEndpoint: any
}

@Service()
export class CoreEngineCRUDUsecase
  implements Usecase<CoreEngineCRUDUsecaseInput, CRUDActionResponse>
{
  private readonly variableValuePopulater = Container.get(VariableValuePopulaterService);

  private readonly dbConnection: Db = Container.get(DATABASE);

    private readonly crudActionExecutorUsecase: CRUDActionExecutorUsecase = Container.get(CRUDActionExecutorUsecase);
    private readonly requestDataValidatorService: RequestDataValidatorFacadeService = Container.get(RequestDataValidatorFacadeService);
    private readonly paramsParserService: ParamsParserService = Container.get(ParamsParserService);

  async execute(
    input: CoreEngineCRUDUsecaseInput
  ): Promise<CRUDActionResponse> {
    const {
      url,
      placeholderDataSouce: requestPlaceholderSource,
      applicationId,
      token,
      matchedEndpoint
    } = input;

    const placeholderDataSouce: PlaceholderDataSource = {
      ...requestPlaceholderSource,
      crudSteps: [],
      authUser: null,
    };

    if (!matchedEndpoint) {
      throw new Error('Endpoint not found for the URL:' + url);
    }

    const { endpoint, params } = matchedEndpoint;

    const db: Db = Container.get(DATABASE);

    if (endpoint.isAuthenticated) {
      placeholderDataSouce.authUser = null
    }

    placeholderDataSouce.pathParams = this.paramsParserService.parse(params);
    placeholderDataSouce.queryParams = this.paramsParserService.parse(
      placeholderDataSouce.queryParams as Record<string, string>
    );

    const { crud, response, validations, useCloudCode } = endpoint;

    try {
      await this.requestDataValidatorService.validate({
        db,
        requestData: placeholderDataSouce,
        validations: this.variableValuePopulater.replaceVariables(
          validations,
          placeholderDataSouce
        ) as RequestDataValidation,
      });
      let stepsResponse: Document[] = [];
      for (const action of crud) {
        let payloadPlaceholdersPopulatedWithValues =
          this.variableValuePopulater.replaceVariables(action.payload, {
            ...placeholderDataSouce,
            crudSteps: stepsResponse,
          });
        let currentStepResponse = await this.crudActionExecutorUsecase.execute({
          db,
          actionDef: {
            collectionName: action.collectionName,
            payload: payloadPlaceholdersPopulatedWithValues as Document,
            operation: action.operation,
          },
        });
        stepsResponse = [...stepsResponse, currentStepResponse as Document];
      }
      return this.variableValuePopulater.replaceVariables(response, {
        ...placeholderDataSouce,
        crudSteps: stepsResponse,
      }) as CRUDActionResponse;
    } catch (err) {
      console.error(err);
      if (err instanceof MongoServerError)
        throw new CoreEngineProcessingException();
      else throw err;
    }
  }
}
