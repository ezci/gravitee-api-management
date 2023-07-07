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

import { Component, OnInit } from '@angular/core';

import { ApiCreationStepService } from '../../services/api-creation-step.service';
import { ApiCreationPayload } from '../../models/ApiCreationPayload';
import { GioLicenseService } from '../../../../../shared/components/gio-license/gio-license.service';
import { GioLicenseDialog } from '../../../../../shared/components/gio-license/gio-license.dialog';

@Component({
  selector: 'step-5-summary',
  template: require('./step-5-summary.component.html'),
  styles: [require('./step-5-summary.component.scss'), require('../api-creation-steps-common.component.scss')],
})
export class Step5SummaryComponent implements OnInit {
  public currentStepPayload: ApiCreationPayload;
  paths: string[];
  listenerTypes: string[];
  entrypointsDeployable: boolean;
  endpointsDeployable: boolean;
  deployable: boolean;
  private hasLicense: boolean;

  constructor(
    private readonly stepService: ApiCreationStepService,
    private readonly licenseService: GioLicenseService,
    private readonly licenseDialog: GioLicenseDialog,
  ) {}

  ngOnInit(): void {
    this.currentStepPayload = this.stepService.payload;

    this.paths = this.currentStepPayload.paths.map((path) => path.path);
    this.listenerTypes = [
      ...new Set(this.currentStepPayload.selectedEntrypoints.map(({ supportedListenerType }) => supportedListenerType)),
    ];

    this.entrypointsDeployable = this.currentStepPayload.selectedEntrypoints.every(({ deployed }) => deployed);
    this.endpointsDeployable = this.currentStepPayload.selectedEndpoints.every(({ deployed }) => deployed);

    this.deployable =
      this.currentStepPayload.selectedEndpoints.every(({ deployed }) => deployed) &&
      this.currentStepPayload.selectedEntrypoints.every(({ deployed }) => deployed);

    this.licenseService.hasLicense().then((hasLicense) => (this.hasLicense = hasLicense));
  }

  createApi(deploy: boolean) {
    this.stepService.validStep((payload) => ({ ...payload, deploy }));
    this.stepService.finishStepper();
  }

  onChangeStepInfo(stepLabel: string) {
    this.stepService.goToStepLabel(stepLabel);
  }
}