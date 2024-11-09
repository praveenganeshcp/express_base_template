import { ObjectId } from 'mongodb';
import { ParamDataTypes } from '../core/types';
import { Service } from 'typedi';

@Service()
export class ParamsParserService {

  parse(input: Record<string, string>): Record<string, unknown> {
    const keys = Object.keys(input);
    const parsedResult: Record<string, unknown> = {};
    for (let key of keys) {
      const paramValue = input[key];
      key = key.substring(0, key.length);
      const [type, paramKey] = key.split('::');
      parsedResult[paramKey] = this.parseType(
        type as ParamDataTypes,
        paramValue
      );
    }
    return parsedResult;
  }

  private parseType(type: ParamDataTypes, value: unknown) {
    if (type === 'string') {
      return value;
    } else if (type === 'number') {
      try {
        return parseInt(value as string, 10);
      } catch (err) {
        throw new Error('cannot parse params to number');
      }
    } else if (type === 'boolean') {
      try {
        if (value === 'true') {
          return true;
        } else if (value === 'false') {
          return false;
        }
        throw 'err';
      } catch (err) {
        throw new Error('cannot parse params to boolean');
      }
    } else if (type === 'ObjectId') {
      try {
        return new ObjectId(value as string);
      } catch (err) {
        throw new Error('cannot parse params to ObjectId');
      }
    }
    return value;
  }
}
