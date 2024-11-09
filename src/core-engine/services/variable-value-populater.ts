import { Service } from "typedi";
import { PlaceholderDataSource } from "../core/types";
import { VariableValueResolver } from "./variable-value-resolver";

@Service()
export class VariableValuePopulaterService {
  private readonly variableValueResolver: VariableValueResolver =
    new VariableValueResolver();

  public replaceVariables(
    payloadWithPlaceHolderOrResolverValue: unknown,
    input: PlaceholderDataSource,
  ): unknown {
    if (
      payloadWithPlaceHolderOrResolverValue === null ||
      payloadWithPlaceHolderOrResolverValue === undefined
    ) {
      return payloadWithPlaceHolderOrResolverValue;
    }
    // handle array
    if (Array.isArray(payloadWithPlaceHolderOrResolverValue)) {
      const replacedVariablesInArr: unknown[] = [];
      payloadWithPlaceHolderOrResolverValue.forEach((payloadArrayElement) => {
        const processedArrayEle = this.replaceVariables(
          payloadArrayElement,
          input,
        );
        replacedVariablesInArr.push(processedArrayEle);
      });
      return replacedVariablesInArr;
    }
    // handle object
    else if (typeof payloadWithPlaceHolderOrResolverValue === "object") {
      const replacedVariablesInObject: Record<string, unknown> = {};
      Object.keys(payloadWithPlaceHolderOrResolverValue ?? {}).forEach(
        (key) => {
          const valueAtObjectKey = (
            payloadWithPlaceHolderOrResolverValue as any
          )?.[key];
          replacedVariablesInObject[key] = this.replaceVariables(
            valueAtObjectKey,
            input,
          );
        },
      );
      return replacedVariablesInObject;
    }

    const primitiveValue = payloadWithPlaceHolderOrResolverValue;
    if (
      typeof primitiveValue === "string" &&
      primitiveValue.startsWith("${") &&
      primitiveValue.endsWith("}")
    ) {
      const replacedValue = this.variableValueResolver.resolve(
        primitiveValue,
        input,
      );
      return replacedValue;
    }
    return primitiveValue;
  }
}
