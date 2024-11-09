import { Request, Response } from "express";
import { DATABASE } from "@commons/tokens";
import { CoreEngineCRUDUsecase } from "@core-engine/usecases/crud-engine.usecase";
import { Container } from "typedi";
import { ObjectId } from "mongodb";

export default async function handleRequest(req: Request, res: Response) {
  const db = Container.get(DATABASE);
  const crudEngine: CoreEngineCRUDUsecase = Container.get(
    CoreEngineCRUDUsecase,
  );
  const response = await crudEngine.execute({
    method: "GET",
    matchedEndpoint: {
      params: {},
      endpoint: {
        isAuthenticated: false,
        crud: [
          {
            collectionName: "emps",
            operation: "find",
            payload: {
              filter: {},
              options: {},
            },
          },
        ],
        response: {
          message: "hello",
          data: "${Steps.0}",
        },
        validations: {},
        useCloudCode: false,
      },
    },
    url: "/",
    placeholderDataSouce: {
      requestBody: {},
      pathParams: {},
      queryParams: {},
    },
    applicationId: new ObjectId(),
  });
  res.json({ message: "hello praveen", response });
}
