
import { CoreEngineSignupUsecase } from "@core-engine/usecases/signup.usecase";
import { Request, Response } from "express";
import Container from "typedi";

export default async function handleRequest(req: Request, res: Response) {
  const coreEngineCRUDUSecase = Container.get(CoreEngineSignupUsecase);
  const response = await coreEngineCRUDUSecase.execute({
    handlerLogic: {
      crud: [{"collectionName":"users","operation":"insertOne","payload":{"username":"${Request.body.username}","emailId":"${Request.body.emailId}","password":"${Request.body.password}"}},{"collectionName":"users","operation":"findOne","payload":{"filter":{"_id":"${Steps.0.insertedId}"},"options":{}}}],
      response: {"message":"User account created successfully","user":{"id":"${Steps.1._id}","username":"${Steps.1.username}","emailId":"${Steps.1.emailId}"}},
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

