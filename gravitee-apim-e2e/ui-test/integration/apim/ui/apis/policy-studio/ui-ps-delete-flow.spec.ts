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
import { ADMIN_USER, API_PUBLISHER_USER } from '@fakers/users/users';
import { MAPIV2ApisFaker } from '@gravitee/fixtures/management/MAPIV2ApisFaker';
import { ApiType, FlowV4 } from '@gravitee/management-v2-webclient-sdk/src/lib';
import faker from '@faker-js/faker';
import { MAPIV2PlansFaker } from '@gravitee/fixtures/management/MAPIV2PlansFaker';

const envId = 'DEFAULT';

describe('Deleting a flow', () => {
  let v4apiId: string;
  const commonFlow_name = `${faker.commerce.productName()} flow`;
  const planFlow: FlowV4 = MAPIV2PlansFaker.newFlowV4();

  before(() => {
    cy.log('Create v4 API');
    cy.request({
      method: 'POST',
      url: `${Cypress.env('managementApi')}/management/v2/environments/DEFAULT/apis`,
      auth: { username: API_PUBLISHER_USER.username, password: API_PUBLISHER_USER.password },
      body: MAPIV2ApisFaker.newApi({
        type: ApiType.PROXY,
        listeners: [MAPIV2ApisFaker.newHttpListener()],
        endpointGroups: [MAPIV2ApisFaker.newHttpEndpointGroup()],
        flows: [MAPIV2ApisFaker.newFlow({ name: commonFlow_name })],
      }),
    }).then((response) => {
      expect(response.status).to.eq(201);
      v4apiId = response.body.id;

      cy.log('Create a plan with a flow');
      cy.request({
        method: 'POST',
        url: `${Cypress.env('managementApi')}/management/v2/environments/${envId}/apis/${v4apiId}/plans`,
        auth: { username: ADMIN_USER.username, password: ADMIN_USER.password },
        body: MAPIV2PlansFaker.newPlanV4({ flows: [planFlow] }),
      })
        .then((response) => {
          expect(response.status).to.eq(201);
          return response.body.id;
        })
        .then((planId) => {
          cy.log('Publish Plan');
          cy.request({
            method: 'POST',
            url: `${Cypress.env('managementApi')}/management/v2/environments/DEFAULT/apis/${v4apiId}/plans/${planId}/_publish`,
            auth: { username: ADMIN_USER.username, password: ADMIN_USER.password },
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
    });
  });

  beforeEach(() => {
    cy.loginInAPIM(API_PUBLISHER_USER.username, API_PUBLISHER_USER.password);
    cy.visit(`/#!/environments/default/apis/ng/${v4apiId}/policy-studio`);
    cy.url().should('include', '/policy-studio');
  });

  it('should delete a common flow using trash icon', () => {
    cy.contains('.list__flowsGroup__flow__name', commonFlow_name, { timeout: 20000 }).should('be.visible').click();
    cy.get('.header__configBtn__delete').click();
    cy.contains('.list__flowsGroup__flow__name', commonFlow_name).should('not.exist');
    cy.contains('button', 'Save').should('be.visible').click();
    cy.contains('Policy Studio configuration saved').should('be.visible');
    cy.contains('.banner__wrapper__title', 'This API is out of sync').scrollIntoView().should('be.visible');
  });

  it('should delete a plan-flow using trash icon', () => {
    cy.contains('.list__flowsGroup__flow__name', planFlow.name, { timeout: 20000 }).should('be.visible').click();
    cy.get('.header__configBtn__delete').click();
    cy.contains('.list__flowsGroup__flow__name', planFlow.name).should('not.exist');
  });

  after(() => {
    cy.clearCookie('Auth-Graviteeio-APIM');
    cy.log('Clean up APIs');
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('managementApi')}/management/v2/environments/${envId}/apis/${v4apiId}?closePlans=true`,
      auth: { username: ADMIN_USER.username, password: ADMIN_USER.password },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });
});
