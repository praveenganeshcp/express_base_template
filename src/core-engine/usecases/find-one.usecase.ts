import { Db } from "mongodb";
import { FindActionPayload } from "../core/types";
import { CanBeNull, Usecase } from "@commons/types";
import { Service } from "typedi";

interface CoreEngineFindOneActionUsecaseInput {
  query: FindActionPayload;
  db: Db;
  collectionName: string;
}

@Service()
export class CoreEngineFindOneActionUsecase
  implements Usecase<CoreEngineFindOneActionUsecaseInput, CanBeNull<Object>>
{
  execute(
    input: CoreEngineFindOneActionUsecaseInput,
  ): Promise<CanBeNull<Object>> {
    return input.db
      .collection(input.collectionName)
      .findOne(input.query.filter, input.query.options);
  }
}
