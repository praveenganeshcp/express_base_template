import { Filter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import { CanBeNull } from "@commons/types";

export enum ALLOWED_DB_OPERATIONS {
  findOne = "findOne",
  find = "find",
  insertOne = "insertOne",
  insertMany = "insertMany",
  updateOne = "updateOne",
  updateMany = "updateMany",
  deleteOne = "deleteOne",
  deleteMany = "deleteMany",
}

export interface FindActionPayload {
  filter: Filter<Document>;
  options: FindOptions;
}

export interface UpdateActionPayload {
  filter: Filter<Document>;
  patch: UpdateFilter<Document>;
}

export interface DeleteActionPayload {
  filter: Filter<Document>;
}

export interface SaveActionPayload extends Document {}

export interface PlaceholderDataSource {
  requestBody: Document;
  crudSteps: Document[];
  queryParams: Record<string, unknown>;
  pathParams: Record<string, unknown>;
  authUser: CanBeNull<{
    id: ObjectId;
    username: string;
    emailId: string;
  }>;
}

export type RequestDataFieldSyncValidators =
  | "string-type"
  | "numeric-type"
  | "boolean-type";

export type ParamDataTypes = "string" | "number" | "boolean" | "ObjectId";

export interface RequestDataSyncValidation {
  name: RequestDataFieldSyncValidators;
  message: string;
  options: Record<string, unknown>;
}

export interface RequestDataAsyncValidation {
  operation: ALLOWED_DB_OPERATIONS.find | ALLOWED_DB_OPERATIONS.findOne;
  expectedValue: unknown;
  collectionName: string;
  query: Filter<Document>;
  operator: CRUDValidationOperators;
  message: string;
}

export interface RequestDataFieldValidation {
  [key: string]: {
    sync?: RequestDataSyncValidation[];
    async?: RequestDataAsyncValidation[];
  };
}

export type CRUDValidationOperators = "eq" | "ne";

export interface RequestDataValidation {
  body?: RequestDataFieldValidation;
}

export function applicationDbName(applicationId: ObjectId) {
  return `api-crud-${applicationId.toString()}`;
}

export type CRUDActionPayload =
  | SaveActionPayload
  | FindActionPayload
  | UpdateActionPayload
  | DeleteActionPayload;

export interface CRUDActionDefinition {
  operation: ALLOWED_DB_OPERATIONS;
  collectionName: string;
  payload: CRUDActionPayload;
}

export interface CRUDActionResponse extends Document {}

export type CRUDEngineHttpMethods = "GET" | "POST" | "PATCH" | "DELETE";

export type CRUDSupportedVariablesTypes =
  | "ObjectId"
  | "System"
  | "RequestBody"
  | "RequestPathParams"
  | "RequestQueryParams"
  | "Steps"
  | "Authuser";

export const CRUDSupportedVariablesInfo: Record<
  CRUDSupportedVariablesTypes,
  { prefix: string; suffix: string }
> = {
  ObjectId: {
    prefix: "ObjectId(",
    suffix: ")",
  },
  System: {
    prefix: "${System.var.",
    suffix: "}",
  },
  RequestBody: {
    prefix: "${Request.body",
    suffix: "}",
  },
  Steps: {
    prefix: "${Steps",
    suffix: "}",
  },
  RequestPathParams: {
    prefix: "${Request.params.",
    suffix: "}",
  },
  RequestQueryParams: {
    prefix: "${Request.query.",
    suffix: "}",
  },
  Authuser: {
    prefix: "${Authuser",
    suffix: "}",
  },
};

export enum CRUDSystemVariables {
  UTCDateTime = "UTCDateTime",
}
