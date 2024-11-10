import { Usecase } from "@commons/types";
import Container, { Service } from "typedi";
import { CoreEngineCRUDUsecase, CoreEngineCRUDUsecaseInput } from "./crud-engine.usecase";
import { CoreEngineJWTService } from "@core-engine/services/jwt.service";

interface CoreEngineSignupUsecaseOutput {
  user: CoreEngineSignupResponse;
  token: string;
}
interface CoreEngineSignupResponse {
  id: string;
  username: string;
  emailId: string;
}

@Service()
export class CoreEngineSignupUsecase
  implements Usecase<CoreEngineCRUDUsecaseInput, CoreEngineSignupUsecaseOutput>
{
    private readonly coreEngineCRUDUsecase: CoreEngineCRUDUsecase = Container.get(CoreEngineCRUDUsecase);

    private readonly coreEngineJWTService: CoreEngineJWTService = Container.get(CoreEngineJWTService);

  async execute(
    data: CoreEngineCRUDUsecaseInput
  ): Promise<CoreEngineSignupUsecaseOutput> {
    const response = (await this.coreEngineCRUDUsecase.execute(
      data
    )) as CoreEngineSignupResponse;
    const token = this.coreEngineJWTService.createToken(response.id);
    return { user: response, token };
  }
}