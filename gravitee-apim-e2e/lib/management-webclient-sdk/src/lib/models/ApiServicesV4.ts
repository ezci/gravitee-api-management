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

import { exists, mapValues } from '../runtime';
import type { ServiceV4 } from './ServiceV4';
import {
    ServiceV4FromJSON,
    ServiceV4FromJSONTyped,
    ServiceV4ToJSON,
} from './ServiceV4';

/**
 * The configuration of API services like the dynamic properties.
 * @export
 * @interface ApiServicesV4
 */
export interface ApiServicesV4 {
    /**
     * 
     * @type {ServiceV4}
     * @memberof ApiServicesV4
     */
    dynamicProperty?: ServiceV4;
}

/**
 * Check if a given object implements the ApiServicesV4 interface.
 */
export function instanceOfApiServicesV4(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ApiServicesV4FromJSON(json: any): ApiServicesV4 {
    return ApiServicesV4FromJSONTyped(json, false);
}

export function ApiServicesV4FromJSONTyped(json: any, ignoreDiscriminator: boolean): ApiServicesV4 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'dynamicProperty': !exists(json, 'dynamicProperty') ? undefined : ServiceV4FromJSON(json['dynamicProperty']),
    };
}

export function ApiServicesV4ToJSON(value?: ApiServicesV4 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'dynamicProperty': ServiceV4ToJSON(value.dynamicProperty),
    };
}
