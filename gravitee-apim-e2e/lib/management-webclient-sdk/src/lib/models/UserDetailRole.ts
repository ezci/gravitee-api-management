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
/**
 * 
 * @export
 * @interface UserDetailRole
 */
export interface UserDetailRole {
    /**
     * 
     * @type {string}
     * @memberof UserDetailRole
     */
    name?: string;
    /**
     * 
     * @type {{ [key: string]: Array<string>; }}
     * @memberof UserDetailRole
     */
    permissions?: { [key: string]: Array<string>; };
    /**
     * 
     * @type {string}
     * @memberof UserDetailRole
     */
    scope?: string;
}

/**
 * Check if a given object implements the UserDetailRole interface.
 */
export function instanceOfUserDetailRole(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UserDetailRoleFromJSON(json: any): UserDetailRole {
    return UserDetailRoleFromJSONTyped(json, false);
}

export function UserDetailRoleFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserDetailRole {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'permissions': !exists(json, 'permissions') ? undefined : json['permissions'],
        'scope': !exists(json, 'scope') ? undefined : json['scope'],
    };
}

export function UserDetailRoleToJSON(value?: UserDetailRole | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'permissions': value.permissions,
        'scope': value.scope,
    };
}
