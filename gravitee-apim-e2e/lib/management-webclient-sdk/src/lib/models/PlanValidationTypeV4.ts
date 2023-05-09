/* tslint:disable */
/* eslint-disable */
/**
 * Gravitee.io - Management API
 * Some news resources are in alpha version. This implies that they are likely to be modified or even removed in future versions. They are marked with the 🧪 symbol
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * 
 * @export
 */
export const PlanValidationTypeV4 = {
    AUTO: 'AUTO',
    MANUAL: 'MANUAL'
} as const;
export type PlanValidationTypeV4 = typeof PlanValidationTypeV4[keyof typeof PlanValidationTypeV4];


export function PlanValidationTypeV4FromJSON(json: any): PlanValidationTypeV4 {
    return PlanValidationTypeV4FromJSONTyped(json, false);
}

export function PlanValidationTypeV4FromJSONTyped(json: any, ignoreDiscriminator: boolean): PlanValidationTypeV4 {
    return json as PlanValidationTypeV4;
}

export function PlanValidationTypeV4ToJSON(value?: PlanValidationTypeV4 | null): any {
    return value as any;
}
