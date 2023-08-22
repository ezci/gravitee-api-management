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
import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subject } from 'rxjs';
import { GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR } from '@gravitee/ui-particles-angular';
import { MatStepper } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';
import { StateService } from '@uirouter/angular';

import { ApiEndpointDefaultEntities } from './api-endpoint-default-entities';

import { ApiEndpointGroupSelectionComponent } from '../selection/api-endpoint-group-selection.component';
import { ApiEndpointGroupConfigurationComponent } from '../configuration/api-endpoint-group-configuration.component';
import { ApiEndpointGroupGeneralComponent } from '../general/api-endpoint-group-general.component';
import { ApiV2Service } from '../../../../../services-ngx/api-v2.service';
import { isUnique } from '../../../../../shared/utils';
import { ApiV4, EndpointGroupV4, UpdateApiV4 } from '../../../../../entities/management-api-v2';
import { UIRouterState, UIRouterStateParams } from '../../../../../ajs-upgraded-providers';
import { SnackBarService } from '../../../../../services-ngx/snack-bar.service';

@Component({
  selector: 'api-endpoints-group-create',
  template: require('./api-endpoint-group-create.component.html'),
  styles: [require('./api-endpoint-group-create.component.scss')],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiEndpointGroupCreateComponent implements OnInit {
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  @HostBinding(`attr.${GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR}`)
  private gioFormFocusInvalidIgnore = true;

  @ViewChild(ApiEndpointGroupSelectionComponent)
  private apiEndpointGroupsSelectionComponent: ApiEndpointGroupSelectionComponent;

  @ViewChild(ApiEndpointGroupGeneralComponent)
  private apiEndpointGroupGeneralComponent: ApiEndpointGroupGeneralComponent;

  @ViewChild(ApiEndpointGroupConfigurationComponent)
  private apiEndpointGroupConfigurationComponent: ApiEndpointGroupConfigurationComponent;

  @ViewChild('stepper', { static: true })
  private matStepper: MatStepper;
  public createForm: FormGroup;
  public endpointGroupTypeForm: FormGroup;
  public generalForm: FormGroup;
  public configurationForm: FormGroup;

  constructor(
    @Inject(UIRouterStateParams) private readonly ajsStateParams,
    @Inject(UIRouterState) readonly ajsState: StateService,
    private readonly apiService: ApiV2Service,
    private readonly snackBarService: SnackBarService,
  ) {}

  ngOnInit() {
    this.initCreateForm();

    this.apiService
      .get(this.ajsStateParams.apiId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (api) => {
          this.initCreateForm();
          this.generalForm.get('name').addValidators([isUnique((api as ApiV4).endpointGroups.map((group) => group.name))]);
        },
      });
  }

  createEndpointGroup() {
    const formValue = this.createForm.getRawValue();
    const sharedConfiguration = formValue.configuration.groupConfiguration;

    const newEndpointGroup: EndpointGroupV4 = {
      name: formValue.general.name,
      loadBalancer: { type: formValue.general.loadBalancerType },
      type: formValue.type.endpointGroupType,
      endpoints: [ApiEndpointDefaultEntities.byType(formValue.type.endpointGroupType)],
      ...(sharedConfiguration ? { sharedConfiguration } : {}),
    };

    this.apiService
      .get(this.ajsStateParams.apiId)
      .pipe(
        switchMap((api) => {
          const updatedApi: UpdateApiV4 = { ...(api as ApiV4) };
          updatedApi.endpointGroups.push(newEndpointGroup);
          return this.apiService.update(api.id, updatedApi);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (_) => {
          this.snackBarService.success(`Endpoint group ${newEndpointGroup.name} created!`);
          this.goBackToEndpointGroups();
        },
        error: (err) => this.snackBarService.error(err.message ?? 'An error occurred.'),
      });
  }

  goBackToEndpointGroups() {
    this.ajsState.go('management.apis.ng.endpoint-groups');
  }

  private initCreateForm(): void {
    this.endpointGroupTypeForm = new FormGroup({
      endpointGroupType: new FormControl('', Validators.required),
    });

    this.generalForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[^:]*$/)]),
      loadBalancerType: new FormControl('', [Validators.required]),
    });

    this.configurationForm = new FormGroup({
      groupConfiguration: new FormControl({}),
    });

    this.createForm = new FormGroup({
      type: this.endpointGroupTypeForm,
      general: this.generalForm,
      configuration: this.configurationForm,
    });
  }
}
