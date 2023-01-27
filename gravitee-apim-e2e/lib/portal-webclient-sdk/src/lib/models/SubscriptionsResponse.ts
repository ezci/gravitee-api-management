/* tslint:disable */
/* eslint-disable */
/**
 * Gravitee.io Portal Rest API
 * API dedicated to the devportal part of Gravitee
 *
 * Contact: contact@graviteesource.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Links,
    LinksFromJSON,
    LinksFromJSONTyped,
    LinksToJSON,
    Subscription,
    SubscriptionFromJSON,
    SubscriptionFromJSONTyped,
    SubscriptionToJSON,
} from './';

/**
 * 
 * @export
 * @interface SubscriptionsResponse
 */
export interface SubscriptionsResponse {
    /**
     * List of subscriptions.
     * @type {Array<Subscription>}
     * @memberof SubscriptionsResponse
     */
    data?: Array<Subscription>;
    /**
     * Map of Map of Object
     * @type {{ [key: string]: { [key: string]: any; }; }}
     * @memberof SubscriptionsResponse
     */
    metadata?: { [key: string]: { [key: string]: any; }; };
    /**
     * 
     * @type {Links}
     * @memberof SubscriptionsResponse
     */
    links?: Links;
}

export function SubscriptionsResponseFromJSON(json: any): SubscriptionsResponse {
    return SubscriptionsResponseFromJSONTyped(json, false);
}

export function SubscriptionsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubscriptionsResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(SubscriptionFromJSON)),
        'metadata': !exists(json, 'metadata') ? undefined : json['metadata'],
        'links': !exists(json, 'links') ? undefined : LinksFromJSON(json['links']),
    };
}

export function SubscriptionsResponseToJSON(value?: SubscriptionsResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(SubscriptionToJSON)),
        'metadata': value.metadata,
        'links': LinksToJSON(value.links),
    };
}

