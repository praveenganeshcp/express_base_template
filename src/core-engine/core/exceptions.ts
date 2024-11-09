  
  export class CoreEngineUnSupportedVariableTypeException extends Error {
    constructor(variableType: string) {
      super(`${variableType} currently not supported`);
    }
  }
  
  export class CoreEngineUnSupportedActionException extends Error{
    constructor(actionName: string) {
      super(`${actionName} currently not supported`);
    }
  }
  
  export class CoreEngineFindActionPayloadMissingException extends Error{
    constructor() {
      super('filter or options object is missing in the payload object');
    }
  }
  
  export class CoreEngineUpdateActionPayloadMissingException extends Error{
    constructor() {
      super('filter or patch object is missing in the payload object');
    }
  }
  
  export class CoreEngineInvalidVariablePathException extends Error{
    constructor(variableName: string) {
      super(`${variableName} does not resolve to the value`);
    }
  }
  
  export class CoreEngineInsertManyActionInvalidDataException extends Error{
    constructor() {
      super('InsertMany actiom should array type payload');
    }
  }
  
  export class CoreEngineProcessingException extends Error{
    constructor() {
      super('Error in processing the action. Please check the payload');
    }
  }
  
  export class InvalidFilePathException extends Error{
    constructor() {
      super('File path does not exist in your folder');
    }
  }
  
  export class InvalidLoginException extends Error {
    constructor() {
      super('Invalid emailId or password');
    }
  }
  
  export class SessionExpiredException extends Error {
    constructor() {
      super('Session expired');
    }
  }
  