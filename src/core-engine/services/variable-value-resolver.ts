import { Document, ObjectId } from 'mongodb';
import { VariableTypeResolverService } from './variable-type-resolver';
import { CRUDSupportedVariablesInfo, CRUDSystemVariables, PlaceholderDataSource } from '../core/types';
import { CoreEngineInvalidVariablePathException, CoreEngineUnSupportedVariableTypeException } from '../core/exceptions';
import { Service } from 'typedi';

@Service()
export class VariableValueResolver {

  private readonly variableTypeResolverService: VariableTypeResolverService =
    new VariableTypeResolverService();

  private resolveRequestBodyVariable(value: string, inputBody: Document) {
    const variableBodyPrefixLen =
      CRUDSupportedVariablesInfo.RequestBody.prefix.length;
    const valueKey: string = value.slice(
      variableBodyPrefixLen,
      value.length - 1
    );
    const valuePathSeperatedByPeriods = valueKey.split('.').slice(1);
    let valueObject = { ...inputBody };
    for (const key of valuePathSeperatedByPeriods) {
      if (!valueObject[key]) {
        throw new CoreEngineInvalidVariablePathException(value);
      }
      valueObject = valueObject[key];
    }
    return valueObject;
  }

  private resolveAuthUserVariable(value: string, inputBody: Document) {
    const variableAuthUserPrefixLen =
      CRUDSupportedVariablesInfo.Authuser.prefix.length;
    const valueKey: string = value.slice(
      variableAuthUserPrefixLen,
      value.length - 1
    );
    const valuePathSeperatedByPeriods = valueKey.split('.').slice(1);
    let valueObject = { ...inputBody };
    for (const key of valuePathSeperatedByPeriods) {
      if (!valueObject[key]) {
        throw new CoreEngineInvalidVariablePathException(value);
      }
      valueObject = valueObject[key];
    }
    return valueObject;
  }

  private resolveRequestParamsVariable(value: string, inputParams: Document) {
    const variableParamPrefixLen =
      CRUDSupportedVariablesInfo.RequestPathParams.prefix.length;
    const valueKey: string = value.slice(
      variableParamPrefixLen,
      value.length - 1
    );
    return inputParams[valueKey];
  }

  private resolveRequestQueryVariable(value: string, inputParams: Document) {
    const variableParamPrefixLen =
      CRUDSupportedVariablesInfo.RequestQueryParams.prefix.length;
    const valueKey: string = value.slice(
      variableParamPrefixLen,
      value.length - 1
    );
    return inputParams[valueKey];
  }

  private resolveSystemVariable(value: string) {
    const systemVariablePrefixLen =
      CRUDSupportedVariablesInfo.System.prefix.length;
    const systemVariableName: string = value.slice(
      systemVariablePrefixLen,
      value.length - 1
    );
    if (systemVariableName === CRUDSystemVariables.UTCDateTime) {
      return new Date();
    } else {
      throw new CoreEngineUnSupportedVariableTypeException(systemVariableName);
    }
  }

  private resolveObjectIdVariable(value: string) {
    const objectIdPrefixLen = CRUDSupportedVariablesInfo.ObjectId.prefix.length;
    const valueKey: string = value.slice(objectIdPrefixLen, value.length - 1);
    return new ObjectId(valueKey);
  }

  private resolveStepVariable(value: string, stepsInput: Array<Document>) {
    const stepVariablePrefixLen =
      CRUDSupportedVariablesInfo.Steps.prefix.length;
    const valueKey: string = value.slice(
      stepVariablePrefixLen,
      value.length - 1
    );
    const valuePathSeperatedByPeriods = valueKey.split('.').slice(1);
    let stepsInputObject: Document = stepsInput.slice();
    for (const key of valuePathSeperatedByPeriods) {
      if (!stepsInputObject[key as unknown as number]) {
        return null;
      }
      stepsInputObject = stepsInputObject[key as unknown as number];
    }
    return stepsInputObject as unknown;
  }

  public resolve(value: string, inputData: PlaceholderDataSource) {
    const type = this.variableTypeResolverService.resolve(value);
    switch (type) {
      case 'RequestBody': {
        const result = this.resolveRequestBodyVariable(
          value,
          inputData.requestBody
        );
        if (
          this.variableTypeResolverService.resolve(
            result as unknown as string
          ) === 'ObjectId'
        ) {
          return this.resolveObjectIdVariable(result as unknown as string);
        }
        return result;
      }
      case 'ObjectId': {
        return this.resolveObjectIdVariable(value);
      }
      case 'Steps': {
        return this.resolveStepVariable(value, inputData.crudSteps);
      }
      case 'System': {
        return this.resolveSystemVariable(value);
      }
      case 'RequestPathParams': {
        return this.resolveRequestParamsVariable(value, inputData.pathParams);
      }
      case 'RequestQueryParams': {
        return this.resolveRequestQueryVariable(value, inputData.queryParams);
      }
      case 'Authuser': {
        return this.resolveAuthUserVariable(value, inputData.authUser ?? {});
      }
      default: {
        return value;
      }
    }
  }
}
