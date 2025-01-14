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
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from '../entities/Constants';
import { AnalyticsRequestParam } from '../entities/analytics/analyticsRequestParam';
import { AnalyticsCountResponse, AnalyticsGroupByResponse, AnalyticsStatsResponse } from '../entities/analytics/analyticsResponse';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private readonly http: HttpClient, @Inject('Constants') private readonly constants: Constants) {}

  getStats(params: AnalyticsRequestParam): Observable<AnalyticsStatsResponse> {
    const url =
      `${this.constants.env.baseURL}/analytics?type=stats` +
      `&field=${params.field}` +
      `&interval=${params.interval}` +
      `&from=${params.from}` +
      `&to=${params.to}`;
    return this.http.get<AnalyticsStatsResponse>(url, {
      headers: new HttpHeaders({ timeout: `${this.constants.env.settings.analytics.clientTimeout}` }),
    });
  }

  getGroupBy(params: AnalyticsRequestParam): Observable<AnalyticsGroupByResponse> {
    const url =
      `${this.constants.env.baseURL}/analytics?type=group_by` +
      `&field=${params.field}` +
      `&interval=${params.interval}` +
      `&from=${params.from}` +
      `&to=${params.to}`;
    return this.http.get<AnalyticsGroupByResponse>(url, {
      headers: new HttpHeaders({ timeout: `${this.constants.env.settings.analytics.clientTimeout}` }),
    });
  }

  getCount(params: AnalyticsRequestParam): Observable<AnalyticsCountResponse> {
    const url =
      `${this.constants.env.baseURL}/analytics?type=count` +
      `&field=${params.field}` +
      `&interval=${params.interval}` +
      `&from=${params.from}` +
      `&to=${params.to}`;
    return this.http.get<AnalyticsCountResponse>(url, {
      headers: new HttpHeaders({ timeout: `${this.constants.env.settings.analytics.clientTimeout}` }),
    });
  }
}
