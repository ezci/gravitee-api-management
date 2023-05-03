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
package io.gravitee.rest.api.management.v2.rest.resource.api;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import io.gravitee.common.http.HttpStatusCode;
import io.gravitee.rest.api.management.v2.rest.model.CreateApiMembership;
import io.gravitee.rest.api.management.v2.rest.model.Error;
import io.gravitee.rest.api.management.v2.rest.model.Member;
import io.gravitee.rest.api.management.v2.rest.resource.AbstractResourceTest;
import io.gravitee.rest.api.model.EnvironmentEntity;
import io.gravitee.rest.api.model.MemberEntity;
import io.gravitee.rest.api.model.RoleEntity;
import io.gravitee.rest.api.model.permissions.RolePermission;
import io.gravitee.rest.api.model.permissions.RolePermissionAction;
import io.gravitee.rest.api.service.common.GraviteeContext;
import java.util.List;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;
import org.junit.Before;
import org.junit.Test;

public class ApiMembersResource_CreateTest extends AbstractResourceTest {

    private static final String apiId = "my-api";
    private static final String ENVIRONMENT = "my-env";

    @Override
    protected String contextPath() {
        return "/environments/" + ENVIRONMENT + "/apis/" + apiId + "/members";
    }

    @Before
    public void init() {
        reset(membershipService);
        GraviteeContext.cleanContext();
        GraviteeContext.setCurrentEnvironment(ENVIRONMENT);
        GraviteeContext.setCurrentOrganization(ORGANIZATION);

        EnvironmentEntity environmentEntity = new EnvironmentEntity();
        environmentEntity.setId(ENVIRONMENT);
        environmentEntity.setOrganizationId(ORGANIZATION);
        doReturn(environmentEntity).when(environmentService).findByOrgAndIdOrHrid(ORGANIZATION, ENVIRONMENT);
    }

    @Test
    public void should_return_403_when_user_not_permitted_to_create_members() {
        when(
            permissionService.hasPermission(
                eq(GraviteeContext.getExecutionContext()),
                eq(RolePermission.API_MEMBER),
                eq(apiId),
                eq(RolePermissionAction.CREATE)
            )
        )
            .thenReturn(false);

        final Response response = rootTarget().request().post(Entity.json(new CreateApiMembership()));
        assertEquals(HttpStatusCode.FORBIDDEN_403, response.getStatus());
    }

    @Test
    public void should_return_400_when_role_is_primary_owner() {
        var newMembership = new CreateApiMembership();
        newMembership.setRoleName("PRIMARY_OWNER");
        final Response response = rootTarget().request().post(Entity.json(newMembership));
        assertEquals(HttpStatusCode.BAD_REQUEST_400, response.getStatus());
        assertEquals("An API must always have only one PRIMARY_OWNER !", response.readEntity(Error.class).getMessage());
    }

    @Test
    public void should_create_an_api_member() {
        var memberEntity = new MemberEntity();
        memberEntity.setDisplayName("John Doe");
        var ownerRole = new RoleEntity();
        ownerRole.setName("OWNER");
        memberEntity.setRoles(List.of(ownerRole));

        when(
            membershipService.createNewMembershipForApi(
                eq(GraviteeContext.getExecutionContext()),
                eq(apiId),
                eq("userId"),
                eq(null),
                eq("OWNER")
            )
        )
            .thenReturn(memberEntity);

        var newMembership = new CreateApiMembership();
        newMembership.setRoleName("OWNER");
        newMembership.setUserId("userId");
        final Response response = rootTarget().request().post(Entity.json(newMembership));
        assertEquals(HttpStatusCode.CREATED_201, response.getStatus());

        var createdMember = response.readEntity(Member.class);
        assertEquals("John Doe", createdMember.getDisplayName());
    }
}