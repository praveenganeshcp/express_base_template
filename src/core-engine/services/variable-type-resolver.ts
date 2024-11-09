import { Service } from "typedi";
import {
  CRUDSupportedVariablesInfo,
  CRUDSupportedVariablesTypes,
} from "../core/types";

@Service()
export class VariableTypeResolverService {
  private isRequestVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.RequestBody.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.RequestBody.suffix)
    );
  }

  private isSystemVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.System.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.System.suffix)
    );
  }

  private isObjectIdVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.ObjectId.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.ObjectId.suffix)
    );
  }

  private isStepVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.Steps.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.Steps.suffix)
    );
  }

  private isAuthUserVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.Authuser.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.Authuser.suffix)
    );
  }

  private isRequestParamsVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.RequestPathParams.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.RequestPathParams.suffix)
    );
  }

  private isRequestQueryVariable(value: string) {
    return (
      value.startsWith(CRUDSupportedVariablesInfo.RequestQueryParams.prefix) &&
      value.endsWith(CRUDSupportedVariablesInfo.RequestQueryParams.suffix)
    );
  }

  public resolve(value: string): CRUDSupportedVariablesTypes | "" {
    if (this.isRequestVariable(value)) {
      return "RequestBody";
    } else if (this.isSystemVariable(value)) {
      return "System";
    } else if (this.isObjectIdVariable(value)) {
      return "ObjectId";
    } else if (this.isStepVariable(value)) {
      return "Steps";
    } else if (this.isRequestParamsVariable(value)) {
      return "RequestPathParams";
    } else if (this.isRequestQueryVariable(value)) {
      return "RequestQueryParams";
    } else if (this.isAuthUserVariable(value)) {
      return "Authuser";
    }
    return "";
  }
}
