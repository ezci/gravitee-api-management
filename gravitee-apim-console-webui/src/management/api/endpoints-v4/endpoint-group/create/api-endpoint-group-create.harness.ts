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
import { ComponentHarness } from '@angular/cdk/testing';
import { MatStepHarness } from '@angular/material/stepper/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { DivHarness } from '@gravitee/ui-particles-angular/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import { ApiEndpointGroupGeneralHarness } from '../general/api-endpoint-group-general.harness';
import { GioConnectorRadioListHarness } from '../../../../../shared/components/gio-connector-list-option/gio-connector-radio-list.harness';

export class ApiEndpointGroupHarness extends ComponentHarness {
  static hostSelector = 'api-endpoint-group-create';

  protected getEndpointGroupRadio = this.locatorFor(GioConnectorRadioListHarness);
  protected getButtonByText = (text: string) => this.locatorFor(MatButtonHarness.with({ text }))();
  protected getEndpointGroupGeneralHarness = this.locatorFor(ApiEndpointGroupGeneralHarness);
  protected getBannerBody = this.locatorFor(DivHarness.with({ selector: '.banner__wrapper__body' }));
  protected getConfigurationInput = this.locatorFor(MatInputHarness.with({ selector: '[id*="groupAttribute"]' }));
  protected getStepByLabel = (label: string) => this.locatorFor(MatStepHarness.with({ label }))();

  // Step 1: Endpoint Group Type
  async getEndpointGroupTypeStep(): Promise<MatStepHarness> {
    return this.getStepByLabel('Endpoint Group Type');
  }

  async isEndpointGroupTypeStepValid(): Promise<boolean> {
    return this.getEndpointGroupTypeStep().then((step) => !step.hasErrors());
  }

  async selectEndpointGroup(type: string): Promise<void> {
    return this.getEndpointGroupRadio().then((radioGroup) => radioGroup.selectOptionById(type));
  }

  async getSelectedEndpointGroupId(): Promise<string> {
    return this.getEndpointGroupRadio().then((radioGroup) => radioGroup.getValue());
  }

  async getValidateEndpointGroupSelectionButton(): Promise<MatButtonHarness> {
    return this.getButtonByText('Select endpoint group type');
  }

  async validateEndpointGroupSelection(): Promise<void> {
    return this.getValidateEndpointGroupSelectionButton().then((btn) => btn.click());
  }

  // Step 2: General
  async getGeneralStep(): Promise<MatStepHarness> {
    return this.getStepByLabel('General');
  }

  async isGeneralStepValid(): Promise<boolean> {
    return this.getEndpointGroupTypeStep().then((step) => !step.hasErrors());
  }

  async getNameValue(): Promise<string> {
    return this.getEndpointGroupGeneralHarness().then((harness) => harness.getNameValue());
  }

  async setNameValue(text: string): Promise<void> {
    return this.getEndpointGroupGeneralHarness().then((harness) => harness.setNameValue(text));
  }

  public async getLoadBalancerValue() {
    return this.getEndpointGroupGeneralHarness().then((harness) => harness.getLoadBalancerValue());
  }

  public async setLoadBalancerValue(value: string) {
    return this.getEndpointGroupGeneralHarness().then((harness) => harness.setLoadBalancerValue(value));
  }

  async getValidateGeneralInformationButton(): Promise<MatButtonHarness> {
    return this.getButtonByText('Validate general information');
  }

  async validateGeneralInformation(): Promise<void> {
    return this.getValidateGeneralInformationButton().then((btn) => btn.click());
  }

  // Step 3: Configuration
  async getConfigurationStep(): Promise<MatStepHarness> {
    return this.getStepByLabel('Configuration');
  }

  async isConfigurationValid(): Promise<boolean> {
    return this.getEndpointGroupTypeStep().then((step) => !step.hasErrors());
  }

  async isEndpointGroupMockBannerShown(): Promise<boolean> {
    return this.bannerBodyContainsText('Mock');
  }

  async isInheritedConfigurationBannerShown(): Promise<boolean> {
    return this.bannerBodyContainsText('inherit');
  }

  async isConfigurationFormShown(): Promise<boolean> {
    return this.getConfigurationInput()
      .then((_) => true)
      .catch((_) => false);
  }

  async setConfigurationInput(text: string): Promise<void> {
    return this.getConfigurationInput().then((input) => input.setValue(text));
  }

  async getCreateEndpointGroupButton(): Promise<MatButtonHarness> {
    return this.getButtonByText('Create endpoint group');
  }

  async createEndpointGroup(): Promise<void> {
    return this.getCreateEndpointGroupButton().then((btn) => btn.click());
  }

  private async bannerBodyContainsText(text: string): Promise<boolean> {
    return this.getBannerBody()
      .then((div) => div.getText())
      .then((txt) => txt.includes(text));
  }
}
