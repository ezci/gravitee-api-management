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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController } from '@angular/common/http/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { PolicyStudioConfigComponent } from './policy-studio-config.component';
import { PolicyStudioConfigModule } from './policy-studio-config.module';

import { CONSTANTS_TESTING, GioHttpTestingModule } from '../../../../shared/testing';
import { fakeApi } from '../../../../entities/api/Api.fixture';
import { fakeFlowConfigurationSchema } from '../../../../entities/flow/configurationSchema.fixture';
import { User } from '../../../../entities/user';
import { PolicyStudioService } from '../policy-studio.service';
import { toApiDefinition } from '../models/ApiDefinition';

describe('PolicyStudioConfigComponent', () => {
  let fixture: ComponentFixture<PolicyStudioConfigComponent>;
  let loader: HarnessLoader;
  let component: PolicyStudioConfigComponent;
  let httpTestingController: HttpTestingController;
  let policyStudioService: PolicyStudioService;

  const currentUser = new User();
  currentUser.userApiPermissions = ['api-plan-r', 'api-plan-u'];

  const configurationSchema = fakeFlowConfigurationSchema();
  const api = fakeApi();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, GioHttpTestingModule, PolicyStudioConfigModule, MatIconTestingModule],
      providers: [
        {
          provide: 'Constants',
          useValue: {
            ...CONSTANTS_TESTING,
            org: {
              ...CONSTANTS_TESTING.org,
              settings: {
                ...CONSTANTS_TESTING.org.settings,
                emulateV4Engine: { enabled: true },
              },
            },
          },
        },
      ],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true, // This traps focus checks and so avoid warnings when dealing with
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PolicyStudioConfigComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;

    httpTestingController = TestBed.inject(HttpTestingController);
    policyStudioService = TestBed.inject(PolicyStudioService);
    policyStudioService.setApiDefinition(toApiDefinition(api));

    fixture.detectChanges();

    httpTestingController.expectOne(`${CONSTANTS_TESTING.org.baseURL}/configuration/flows/configuration-schema`).flush(configurationSchema);
  });

  describe('ngOnInit', () => {
    it('should setup properties', async () => {
      expect(component.apiDefinition).toStrictEqual({
        id: api.id,
        name: api.name,
        origin: 'management',
        flows: api.flows,
        flow_mode: api.flow_mode,
        resources: api.resources,
        plans: api.plans,
        version: api.version,
        services: api.services,
        properties: api.properties,
        execution_mode: api.execution_mode,
      });
      expect(component.flowConfigurationSchema).toStrictEqual(configurationSchema);
    });
  });

  it('should emulate v4 engine', async (done) => {
    await fixture.whenStable();
    fixture.detectChanges();
    const activateSupportSlideToggle = await loader.getHarness(MatSlideToggleHarness.with({ name: 'emulateV4Engine' }));
    expect(await activateSupportSlideToggle.isDisabled()).toEqual(false);
    await fixture.whenStable();

    // Expect last apiDefinition
    policyStudioService.getApiDefinitionToSave$().subscribe((apiDefinition) => {
      expect(apiDefinition.execution_mode).toEqual('v4-emulation-engine');
      done();
    });

    await activateSupportSlideToggle.check();
  });

  it('should disable field when origin is kubernetes', async () => {
    const api = fakeApi({
      definition_context: { origin: 'kubernetes' },
    });
    policyStudioService.setApiDefinition(toApiDefinition(api));

    const activateSupportSlideToggle = await loader.getHarness(MatSlideToggleHarness.with({ name: 'emulateV4Engine' }));
    expect(await activateSupportSlideToggle.isDisabled()).toEqual(true);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
