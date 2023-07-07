/*
 * Copyright © 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.gravitee.rest.api.service.exceptions;

import static java.util.Collections.singletonMap;

import java.util.Map;

/**
 * @author Azize ELAMRANI (azize.elamrani at graviteesource.com)
 * @author GraviteeSource Team
 */
public class EntrypointNotFoundException extends AbstractNotFoundException {

    private final String entrypointId;

    public EntrypointNotFoundException(String entrypointId) {
        this.entrypointId = entrypointId;
    }

    @Override
    public String getMessage() {
        return "Entrypoint[" + entrypointId + "] cannot be found.";
    }

    @Override
    public String getTechnicalCode() {
        return "entrypoint.notFound";
    }

    @Override
    public Map<String, String> getParameters() {
        return singletonMap("entrypoint", entrypointId);
    }
}
