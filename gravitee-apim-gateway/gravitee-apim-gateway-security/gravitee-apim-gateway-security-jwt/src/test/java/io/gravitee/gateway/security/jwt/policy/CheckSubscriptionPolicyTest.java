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
package io.gravitee.gateway.security.jwt.policy;

import static io.gravitee.reporter.api.http.Metrics.on;
import static java.lang.System.currentTimeMillis;
import static org.mockito.Mockito.*;

import io.gravitee.common.http.HttpStatusCode;
import io.gravitee.gateway.api.ExecutionContext;
import io.gravitee.gateway.api.Request;
import io.gravitee.gateway.api.Response;
import io.gravitee.gateway.policy.PolicyException;
import io.gravitee.policy.api.PolicyChain;
import io.gravitee.policy.api.PolicyResult;
import io.gravitee.repository.exceptions.TechnicalException;
import io.gravitee.repository.management.api.SubscriptionRepository;
import io.gravitee.repository.management.api.search.SubscriptionCriteria;
import io.gravitee.repository.management.model.Subscription;
import java.util.Collections;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatcher;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

/**
 * @author David BRASSELY (david.brassely at graviteesource.com)
 * @author GraviteeSource Team
 */
@RunWith(MockitoJUnitRunner.class)
public class CheckSubscriptionPolicyTest {

    @Mock
    private Request request;

    @Before
    public void init() {
        when(request.metrics()).thenReturn(on(currentTimeMillis()).build());
    }

    @Test
    public void shouldReturnUnauthorized_onException() throws PolicyException, TechnicalException {
        CheckSubscriptionPolicy policy = new CheckSubscriptionPolicy();

        PolicyChain policyChain = mock(PolicyChain.class);

        ExecutionContext executionContext = mock(ExecutionContext.class);
        SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
        when(executionContext.getComponent(SubscriptionRepository.class)).thenReturn(subscriptionRepository);
        when(executionContext.request()).thenReturn(request);

        when(subscriptionRepository.search(any(SubscriptionCriteria.class))).thenThrow(TechnicalException.class);

        policy.execute(policyChain, executionContext);

        verify(policyChain, times(1))
            .failWith(
                argThat(
                    result ->
                        result.statusCode() == HttpStatusCode.UNAUTHORIZED_401 &&
                        CheckSubscriptionPolicy.GATEWAY_OAUTH2_SERVER_ERROR_KEY.equals(result.key())
                )
            );
    }

    @Test
    public void shouldReturnUnauthorized_noSubscription() throws PolicyException, TechnicalException {
        CheckSubscriptionPolicy policy = new CheckSubscriptionPolicy();

        PolicyChain policyChain = mock(PolicyChain.class);

        ExecutionContext executionContext = mock(ExecutionContext.class);
        when(executionContext.getAttribute(CheckSubscriptionPolicy.CONTEXT_ATTRIBUTE_CLIENT_ID)).thenReturn("my-client-id");
        when(executionContext.getAttribute(ExecutionContext.ATTR_PLAN)).thenReturn("plan-id");
        when(executionContext.request()).thenReturn(request);

        SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
        when(executionContext.getComponent(SubscriptionRepository.class)).thenReturn(subscriptionRepository);

        // Search subscription now includes all criteria so the result is empty in case of bad clientId or planId.
        when(subscriptionRepository.search(any(SubscriptionCriteria.class))).thenReturn(Collections.emptyList());

        policy.execute(policyChain, executionContext);

        verify(policyChain, times(1))
            .failWith(
                argThat(
                    result ->
                        result.statusCode() == HttpStatusCode.UNAUTHORIZED_401 &&
                        CheckSubscriptionPolicy.GATEWAY_OAUTH2_ACCESS_DENIED_KEY.equals(result.key())
                )
            );
    }

    @Test
    public void shouldContinue() throws PolicyException, TechnicalException {
        CheckSubscriptionPolicy policy = new CheckSubscriptionPolicy();

        Response response = mock(Response.class);
        PolicyChain policyChain = mock(PolicyChain.class);

        ExecutionContext executionContext = mock(ExecutionContext.class);
        when(executionContext.getAttribute(CheckSubscriptionPolicy.CONTEXT_ATTRIBUTE_CLIENT_ID)).thenReturn("my-client-id");
        when(executionContext.getAttribute(ExecutionContext.ATTR_PLAN)).thenReturn("plan-id");
        when(executionContext.request()).thenReturn(request);
        when(executionContext.response()).thenReturn(response);

        SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
        when(executionContext.getComponent(SubscriptionRepository.class)).thenReturn(subscriptionRepository);

        Subscription subscription = mock(Subscription.class);

        when(subscriptionRepository.search(any(SubscriptionCriteria.class))).thenReturn(Collections.singletonList(subscription));

        policy.execute(policyChain, executionContext);

        verify(policyChain, times(1)).doNext(request, response);
    }

    @Test
    public void shouldFilterRightPlanWhenSelectionRuleBasedPlan() throws PolicyException, TechnicalException {
        CheckSubscriptionPolicy policy = new CheckSubscriptionPolicy();

        Response response = mock(Response.class);
        PolicyChain policyChain = mock(PolicyChain.class);

        ExecutionContext executionContext = mock(ExecutionContext.class);
        when(executionContext.getAttribute(CheckSubscriptionPolicy.CONTEXT_ATTRIBUTE_PLAN_SELECTION_RULE_BASED)).thenReturn(true);
        when(executionContext.getAttribute(CheckSubscriptionPolicy.CONTEXT_ATTRIBUTE_CLIENT_ID)).thenReturn("my-client-id");
        when(executionContext.getAttribute(ExecutionContext.ATTR_PLAN)).thenReturn("plan-id");
        when(executionContext.request()).thenReturn(request);
        when(executionContext.response()).thenReturn(response);

        SubscriptionRepository subscriptionRepository = mock(SubscriptionRepository.class);
        when(executionContext.getComponent(SubscriptionRepository.class)).thenReturn(subscriptionRepository);

        final Subscription subscription = new Subscription();
        subscription.setId("subscription-id");
        subscription.setPlan("plan-id");
        subscription.setApplication("application-id");

        when(subscriptionRepository.search(any(SubscriptionCriteria.class))).thenReturn(Collections.singletonList(subscription));

        policy.execute(policyChain, executionContext);

        verify(executionContext).setAttribute(ExecutionContext.ATTR_APPLICATION, subscription.getApplication());
        verify(executionContext).setAttribute(ExecutionContext.ATTR_SUBSCRIPTION_ID, subscription.getId());
        verify(executionContext).setAttribute(ExecutionContext.ATTR_PLAN, subscription.getPlan());
        verify(policyChain, times(1)).doNext(request, response);
    }

    ArgumentMatcher<PolicyResult> statusCode(int statusCode) {
        return argument -> argument.statusCode() == statusCode;
    }
}