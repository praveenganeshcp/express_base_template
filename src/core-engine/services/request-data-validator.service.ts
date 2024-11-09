import { Service } from "typedi";
import {
  PlaceholderDataSource,
  RequestDataSyncValidation,
  RequestDataValidation,
} from "../core/types";
import { HttpException } from "@commons/types";

interface RequestDataValidatorInput {
  validations: RequestDataValidation;
  requestData: PlaceholderDataSource;
}

@Service()
export class RequestDataValidatorService {
  validate(data: RequestDataValidatorInput): void {
    const { validations, requestData } = data;
    if (validations.body) {
      for (let key of Object.keys(requestData.requestBody)) {
        if (requestData.requestBody?.[key]) {
          this.validateData(
            key,
            requestData.requestBody[key],
            validations.body[key]?.sync,
          );
        }
      }
    }
    return;
  }

  private validateData(
    key: string,
    value: unknown,
    fieldValidations: RequestDataSyncValidation[] = [],
  ) {
    for (let validation of fieldValidations) {
      try {
        switch (validation.name) {
          case "string-type": {
            this.validateStringType(key, value);
            return;
          }
          case "numeric-type": {
            this.validateNumericType(key, value);
            return;
          }
          case "boolean-type": {
            this.validateBooleanType(key, value);
            return;
          }
        }
      } catch (err) {
        if (err instanceof HttpException) {
          throw new HttpException(validation.message, 400);
        }
        throw err;
      }
    }
  }

  private validateBooleanType(key: string, value: unknown) {
    if (typeof value !== "boolean") {
      throw new HttpException(
        `${key} must be boolean type. Received ${value}`,
        400,
      );
    }
  }

  private validateStringType(key: string, value: unknown) {
    if (typeof value !== "string") {
      throw new HttpException(
        `${key} must be string type. Received ${value}`,
        400,
      );
    }
  }

  private validateNumericType(key: string, value: unknown) {
    if (typeof value !== "number") {
      throw new HttpException(
        `${key} must be number type. Received ${value}`,
        400,
      );
    }
  }
}
