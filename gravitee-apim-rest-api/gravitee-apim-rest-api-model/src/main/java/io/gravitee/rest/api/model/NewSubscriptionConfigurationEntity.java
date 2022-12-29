/**
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
package io.gravitee.rest.api.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author David BRASSELY (david.brassely at graviteesource.com)
 * @author GraviteeSource Team
 */
@NoArgsConstructor
@Getter
public class NewSubscriptionConfigurationEntity {

    private String filter;

    @JsonRawValue
    private String configuration;

    private Map<String, String> metadata;

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public void setConfiguration(String configuration) {
        this.configuration = configuration;
    }

    @JsonSetter
    public void setConfiguration(final JsonNode configuration) {
        if (configuration != null && !configuration.isNull()) {
            this.configuration = configuration.toString();
        }
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }
}