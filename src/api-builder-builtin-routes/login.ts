
import { CoreEngineLoginUsecase } from "@core-engine/usecases/login.usecase";
import { Request, Response } from "express";
import Container from "typedi";

export default async function handleRequest(req: Request, res: Response) {
  const coreEngineCRUDUSecase = Container.get(CoreEngineLoginUsecase);
  const response = await coreEngineCRUDUSecase.execute({
    handlerLogic: {
      crud: [{"collectionName":"users","operation":"findOne","payload":{"filter":{"emailId":"${Request.body.emailId}"},"options":{}}}],
      response: {"message":"User loggedin successfully","user":"${Steps.0}"},
      validations: {}
    },
    placeholderDataSouce: {
      authUser: null,
      requestBody: req.body,
      pathParams: req.params,
      queryParams: req.query
    }
  })
  res.json(response);
}

