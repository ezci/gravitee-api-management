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
package io.gravitee.gateway.core.policy;

import io.gravitee.gateway.api.policy.PolicyConfiguration;
import io.gravitee.gateway.core.builder.ApiBuilder;
import io.gravitee.gateway.core.policy.impl.PolicyResolverImpl;
import io.gravitee.model.Api;
import org.junit.Before;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Method;

import static org.mockito.Mockito.when;

/**
 * @author David BRASSELY (brasseld at gmail.com)
 */
public class PolicyResolverTest {

    @Mock
    private PolicyRegistry policyRegistry;

    private PolicyResolverImpl policyResolver = new PolicyResolverImpl();

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        when(policyRegistry.getPolicy("dummy-policy")).thenReturn(new PolicyDefinition() {
            @Override
            public String name() {
                return "my-policy";
            }

            @Override
            public String description() {
                return null;
            }

            @Override
            public Class<? extends io.gravitee.gateway.api.policy.Policy> policy() {
                return DummyPolicy.class;
            }

            @Override
            public Class<PolicyConfiguration> configuration() {
                return null;
            }

            @Override
            public Method onRequestMethod() {
                return null;
            }

            @Override
            public Method onResponseMethod() {
                return null;
            }
        });

        Api api = new ApiBuilder()
                .name("my-team-api")
                .origin("http://localhost/team")
                .target("http://localhost:8083/myapi")
                .build();

        policyResolver.setApi(api);
    }
}
