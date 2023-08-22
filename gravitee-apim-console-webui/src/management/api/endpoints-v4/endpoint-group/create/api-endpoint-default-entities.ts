/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { EndpointV4 } from '../../../../../entities/management-api-v2';

type ENDPOINT_TYPES = 'kafka' | 'mock' | 'mqtt5' | 'rabbitmq' | 'solace' | any;

const KafkaEndpoint: EndpointV4 = {
  name: 'Default Kafka Endpoint',
  type: 'kafka',
  inheritConfiguration: true,
};

const MockEndpoint: EndpointV4 = {
  name: 'Default Mock Endpoint',
  type: 'mock',
  configuration: {},
};

const Mqtt5Endpoint: EndpointV4 = {
  name: 'Default MQTT 5.X Endpoint',
  type: 'mqtt5',
  inheritConfiguration: true,
};

const RabbitMQEndpoint: EndpointV4 = {
  name: 'Default RabbitMQ Endpoint',
  type: 'rabbitmq',
  inheritConfiguration: true,
};

const SolaceEndpoint: EndpointV4 = {
  name: 'Default Solace Endpoint',
  type: 'solace',
  inheritConfiguration: true,
};

export const ApiEndpointDefaultEntities = {
  byType: (type: ENDPOINT_TYPES): EndpointV4 => {
    switch (type) {
      case 'kafka': {
        return KafkaEndpoint;
      }
      case 'mqtt5': {
        return Mqtt5Endpoint;
      }
      case 'rabbitmq': {
        return RabbitMQEndpoint;
      }
      case 'solace': {
        return SolaceEndpoint;
      }
      case 'mock': {
        return MockEndpoint;
      }
      default: {
        return undefined;
      }
    }
  },
};
