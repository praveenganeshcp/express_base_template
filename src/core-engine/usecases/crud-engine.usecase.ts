import { Db, MongoServerError } from "mongodb";
import {
  CRUDActionResponse,
  PlaceholderDataSource,
  RequestDataValidation,
} from "../core/types";
import Container, { Service } from "typedi";
import { Usecase } from "@commons/types";
import { VariableValuePopulaterService } from "../services/variable-value-populater";
import { DATABASE } from "@commons/tokens";
import { CoreEngineProcessingException } from "../core/exceptions";
import { CRUDActionExecutorUsecase } from "./crud-action-executor.usecase";
import { RequestDataValidatorFacadeService } from "../services/request-data-validator-facade.service";
import { ParamsParserService } from "../services/params-parser.service";

export interface CoreEngineCRUDUsecaseInput {
  placeholderDataSouce: Omit<PlaceholderDataSource, "crudSteps">;
  handlerLogic: { crud: any, response: any, validations: any };
}

@Service()
export class CoreEngineCRUDUsecase
  implements Usecase<CoreEngineCRUDUsecaseInput, CRUDActionResponse>
{
  private readonly variableValuePopulater = Container.get(
    VariableValuePopulaterService,
  );

  private readonly db: Db = Container.get(DATABASE);

  private readonly crudActionExecutorUsecase: CRUDActionExecutorUsecase =
    Container.get(CRUDActionExecutorUsecase);
  private readonly requestDataValidatorService: RequestDataValidatorFacadeService =
    Container.get(RequestDataValidatorFacadeService);
  private readonly paramsParserService: ParamsParserService =
    Container.get(ParamsParserService);

  async execute(
    input: CoreEngineCRUDUsecaseInput,
  ): Promise<CRUDActionResponse> {
    const {
      placeholderDataSouce: requestPlaceholderSource,
      handlerLogic,
    } = input;

    const placeholderDataSouce: PlaceholderDataSource = {
      ...requestPlaceholderSource,
      crudSteps: [],
    };

    placeholderDataSouce.pathParams = this.paramsParserService.parse(placeholderDataSouce.pathParams as Record<string, string>);
    placeholderDataSouce.queryParams = this.paramsParserService.parse(
      placeholderDataSouce.queryParams as Record<string, string>,
    );

    const { crud, response, validations } = handlerLogic;

    try {
      await this.requestDataValidatorService.validate({
        db: this.db,
        requestData: placeholderDataSouce,
        validations: this.variableValuePopulater.replaceVariables(
          validations,
          placeholderDataSouce,
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
          db: this.db,
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
