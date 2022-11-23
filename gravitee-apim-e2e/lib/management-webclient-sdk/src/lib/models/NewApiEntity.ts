/* tslint:disable */
/* eslint-disable */
/**
 * Gravitee.io - Management API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Flow,
    FlowFromJSON,
    FlowFromJSONTyped,
    FlowToJSON,
} from './';

/**
 * 
 * @export
 * @interface NewApiEntity
 */
export interface NewApiEntity {
    /**
     * API's context path.
     * @type {string}
     * @memberof NewApiEntity
     */
    contextPath: string;
    /**
     * API's description. A short description of your API.
     * @type {string}
     * @memberof NewApiEntity
     */
    description: string;
    /**
     * API's first endpoint (target url).
     * @type {string}
     * @memberof NewApiEntity
     */
    endpoint: string;
    /**
     * API's flow mode.
     * @type {string}
     * @memberof NewApiEntity
     */
    flow_mode?: NewApiEntityFlowModeEnum;
    /**
     * API's paths. A json representation of the design of each flow.
     * @type {Array<Flow>}
     * @memberof NewApiEntity
     */
    flows?: Array<Flow>;
    /**
     * API's gravitee definition version
     * @type {string}
     * @memberof NewApiEntity
     */
    gravitee?: string;
    /**
     * API's groups. Used to add team in your API.
     * @type {Array<string>}
     * @memberof NewApiEntity
     */
    groups?: Array<string>;
    /**
     * Api's name. Duplicate names can exists.
     * @type {string}
     * @memberof NewApiEntity
     */
    name: string;
    /**
     * API's paths. A json representation of the design of each path.
     * @type {Array<string>}
     * @memberof NewApiEntity
     */
    paths?: Array<string>;
    /**
     * Api's version. It's a simple string only used in the portal.
     * @type {string}
     * @memberof NewApiEntity
     */
    version: string;
}

export function NewApiEntityFromJSON(json: any): NewApiEntity {
    return NewApiEntityFromJSONTyped(json, false);
}

export function NewApiEntityFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewApiEntity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contextPath': json['contextPath'],
        'description': json['description'],
        'endpoint': json['endpoint'],
        'flow_mode': !exists(json, 'flow_mode') ? undefined : json['flow_mode'],
        'flows': !exists(json, 'flows') ? undefined : ((json['flows'] as Array<any>).map(FlowFromJSON)),
        'gravitee': !exists(json, 'gravitee') ? undefined : json['gravitee'],
        'groups': !exists(json, 'groups') ? undefined : json['groups'],
        'name': json['name'],
        'paths': !exists(json, 'paths') ? undefined : json['paths'],
        'version': json['version'],
    };
}

export function NewApiEntityToJSON(value?: NewApiEntity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contextPath': value.contextPath,
        'description': value.description,
        'endpoint': value.endpoint,
        'flow_mode': value.flow_mode,
        'flows': value.flows === undefined ? undefined : ((value.flows as Array<any>).map(FlowToJSON)),
        'gravitee': value.gravitee,
        'groups': value.groups,
        'name': value.name,
        'paths': value.paths,
        'version': value.version,
    };
}

/**
* @export
* @enum {string}
*/
export enum NewApiEntityFlowModeEnum {
    DEFAULT = 'DEFAULT',
    BESTMATCH = 'BEST_MATCH'
}

