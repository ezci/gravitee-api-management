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
package io.gravitee.rest.api.service.impl.upgrade;

import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

import io.gravitee.repository.exceptions.TechnicalException;
import io.gravitee.repository.management.api.ParameterRepository;
import io.gravitee.repository.management.model.Parameter;
import io.gravitee.rest.api.model.parameters.Key;
import java.util.Optional;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.mock.env.MockEnvironment;

/**
 * @author GraviteeSource Team
 */
@RunWith(MockitoJUnitRunner.class)
public class DefaultParameterUpgraderTest {

    private static final String PORTAL_URL = "apis.example.com";

    @Mock
    private ParameterRepository parameterRepository;

    private DefaultParameterUpgrader upgrader;

    @Before
    public void setUp() throws Exception {
        openMocks(this.getClass());
        upgrader = new DefaultParameterUpgrader(parameterRepository, new MockEnvironment().withProperty("portalURL", PORTAL_URL));
    }

    @Test
    public void shouldSetPortalURLWithNoExistingParameter() throws TechnicalException {
        when(parameterRepository.findById(any(), any(), any())).thenReturn(Optional.empty());

        upgrader.upgrade();

        verify(parameterRepository, times(1)).create(argThat(param -> param.getValue().equals(PORTAL_URL)));
    }

    @Test
    public void shouldSetPortalURLWithExistingParameter() throws TechnicalException {
        when(parameterRepository.findById(any(), any(), any())).thenReturn(Optional.of(new Parameter()));

        upgrader.upgrade();

        verify(parameterRepository, times(1)).update(argThat(param -> param.getValue().equals(PORTAL_URL)));
    }
}