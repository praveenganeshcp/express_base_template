import { CanBeNull, Usecase } from '@commons/types';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { CoreEngineCRUDUsecase, CoreEngineCRUDUsecaseInput } from './crud-engine.usecase';
import { CoreEngineJWTService } from '@core-engine/services/jwt.service';
import { InvalidLoginException } from '@core-engine/core/exceptions';

interface CoreEngineLoginUsecaseOutput {
  user: {
    id: string;
    username: string;
    emailId: string;
  };
  token: string;
}

interface CoreEngineLoginResponse {
  user: {
    _id: ObjectId;
    username: string;
    emailId: string;
    password: string;
  };
}

@Service()
export class CoreEngineLoginUsecase
  implements Usecase<CoreEngineCRUDUsecaseInput, CoreEngineLoginUsecaseOutput>
{
    private readonly coreEngineCRUDUsecase: CoreEngineCRUDUsecase = Container.get(CoreEngineCRUDUsecase);
    private readonly coreEngineJWTService: CoreEngineJWTService = Container.get(CoreEngineJWTService);

  async execute(
    data: CoreEngineCRUDUsecaseInput
  ): Promise<CoreEngineLoginUsecaseOutput> {
    const response = (await this.coreEngineCRUDUsecase.execute(
      data
    )) as CanBeNull<CoreEngineLoginResponse>;
    if (!response?.user) {
      throw new InvalidLoginException();
    }
    const { user } = response;
    if (
      response.user.password !==
      data.placeholderDataSouce.requestBody['password']
    ) {
      throw new InvalidLoginException();
    }
    const token = this.coreEngineJWTService.createToken(user._id.toString());
    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        emailId: user.emailId,
      },
      token,
    };
  }
}