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
import { ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subject } from 'rxjs';
import { GIO_FORM_FOCUS_INVALID_IGNORE_SELECTOR } from '@gravitee/ui-particles-angular';
import { MatStepper } from '@angular/material/stepper';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiEndpointGroupSelectionComponent } from './endpoint-group-selection/api-endpoint-group-selection.component';

import { ApiEndpointGroupConfigurationComponent } from '../configuration/api-endpoint-group-configuration.component';
import { ApiEndpointGroupGeneralComponent } from '../general/api-endpoint-group-general.component';
import { ApiV2Service } from '../../../../../services-ngx/api-v2.service';

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
  private configurationDisabled: boolean;

  constructor(private readonly apiService: ApiV2Service) {}

  // TODO: Add rule to general for when name matches api endpoint groups
  // TODO: Add "go back" to Exit button
  // TODO: Save endpoint group
  // TODO: Add default endpoint to endpoint group when saving
  // TODO: Rename routing

  ngOnInit() {
    this.endpointGroupTypeForm = new FormGroup({
      endpointGroupType: new FormControl('', Validators.required),
    });

    this.generalForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^:]*$/),
        // isUniqueAndDoesNotMatchDefaultValue(
        //   this.api.endpointGroups.reduce((acc, group) => [...acc, group.name], []),
        //   group?.name,
        // ),
      ]),
      loadBalancerType: new FormControl('', [Validators.required]),
    });

    this.configurationForm = new FormGroup({
      groupConfiguration: new FormControl({ value: {}, disabled: this.configurationDisabled }, []),
    });
    this.createForm = new FormGroup({
      type: this.endpointGroupTypeForm,
      general: this.generalForm,
      configuration: this.configurationForm,
    });
  }

  createEndpointGroup() {
    // console.log(this.createForm)
  }

  goBackToEndpointGroups() {
    // console.log("Go back to endpoint groups")
  }
}
