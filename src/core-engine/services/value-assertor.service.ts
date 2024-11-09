import { Service } from "typedi";
import { CRUDValidationOperators } from "../core/types";

@Service()
export class ValueAssertorService {
  assert(
    value: unknown,
    expectedValue: unknown,
    operator: CRUDValidationOperators,
  ): boolean {
    let result = false;
    if (operator === "eq") {
      result = value === expectedValue;
    } else if (operator === "ne") {
      result = value !== expectedValue;
    }
    return result;
  }
}
