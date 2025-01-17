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
package io.gravitee.rest.api.management.rest.resource;

import static io.gravitee.rest.api.model.InvitationReferenceType.GROUP;
import static io.gravitee.rest.api.model.permissions.RolePermission.GROUP_INVITATION;
import static io.gravitee.rest.api.model.permissions.RolePermissionAction.*;
import static io.gravitee.rest.api.service.exceptions.GroupInvitationForbiddenException.Type.EMAIL;

import io.gravitee.common.http.MediaType;
import io.gravitee.rest.api.management.rest.security.Permission;
import io.gravitee.rest.api.management.rest.security.Permissions;
import io.gravitee.rest.api.model.GroupEntity;
import io.gravitee.rest.api.model.InvitationEntity;
import io.gravitee.rest.api.model.NewInvitationEntity;
import io.gravitee.rest.api.model.UpdateInvitationEntity;
import io.gravitee.rest.api.model.permissions.RolePermission;
import io.gravitee.rest.api.model.permissions.RolePermissionAction;
import io.gravitee.rest.api.service.GroupService;
import io.gravitee.rest.api.service.InvitationService;
import io.gravitee.rest.api.service.common.ExecutionContext;
import io.gravitee.rest.api.service.common.GraviteeContext;
import io.gravitee.rest.api.service.exceptions.GroupInvitationForbiddenException;
import io.gravitee.rest.api.service.exceptions.GroupMembersLimitationExceededException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.DELETE;
import java.util.List;

/**
 * @author Azize ELAMRANI (azize.elamrani at graviteesource.com)
 * @author GraviteeSource Team
 */
@Tag(name = "Group Invitations")
public class GroupInvitationsResource extends AbstractResource {

    @Inject
    private InvitationService invitationService;

    @Inject
    private GroupService groupService;

    @SuppressWarnings("UnresolvedRestParam")
    @PathParam("group")
    @Parameter(name = "group", hidden = true)
    private String group;

    @GET
    @Operation(
        summary = "List existing invitations of a group",
        description = "User must have the GROUP_INVITATION[READ] permission to use this service"
    )
    @Produces(MediaType.APPLICATION_JSON)
    @Permissions(
        {
            @Permission(value = RolePermission.ENVIRONMENT_GROUP, acls = { READ, CREATE, UPDATE, DELETE }),
            @Permission(value = GROUP_INVITATION, acls = READ),
        }
    )
    public List<InvitationEntity> getGroupInvitations() {
        return invitationService.findByReference(GROUP, group);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Create an invitation to join a group",
        description = "User must have the GROUP_INVITATION[CREATE] permission to use this service"
    )
    @Permissions(
        {
            @Permission(value = RolePermission.ENVIRONMENT_GROUP, acls = { UPDATE, CREATE }),
            @Permission(value = RolePermission.GROUP_INVITATION, acls = RolePermissionAction.CREATE),
        }
    )
    public InvitationEntity createGroupInvitation(@Valid @NotNull final NewInvitationEntity invitationEntity) {
        // Check that group exists
        final ExecutionContext executionContext = GraviteeContext.getExecutionContext();
        final GroupEntity groupEntity = groupService.findById(executionContext, group);
        // check if user is a 'simple group admin' or a platform admin
        final boolean hasPermission = permissionService.hasPermission(
            executionContext,
            RolePermission.ENVIRONMENT_GROUP,
            GraviteeContext.getCurrentEnvironment(),
            CREATE,
            UPDATE,
            DELETE
        );
        if (!hasPermission) {
            if (
                groupEntity.getMaxInvitation() != null &&
                groupService.getNumberOfMembers(executionContext, group) >= groupEntity.getMaxInvitation()
            ) {
                throw new GroupMembersLimitationExceededException(groupEntity.getMaxInvitation());
            }
            if (!groupEntity.isEmailInvitation()) {
                throw new GroupInvitationForbiddenException(EMAIL, group);
            }
        }

        invitationEntity.setReferenceType(GROUP);
        invitationEntity.setReferenceId(group);
        return invitationService.create(executionContext, invitationEntity);
    }

    @Path("{invitation}")
    @PUT
    @Operation(
        summary = "Update an invitation to join a group",
        description = "User must have the GROUP_INVITATION[UPDATE] permission to use this service"
    )
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Permissions(
        {
            @Permission(value = RolePermission.ENVIRONMENT_GROUP, acls = { UPDATE, CREATE }),
            @Permission(value = RolePermission.GROUP_INVITATION, acls = RolePermissionAction.UPDATE),
        }
    )
    public InvitationEntity updateGroupInvitation(
        @PathParam("invitation") String invitation,
        @Valid @NotNull final UpdateInvitationEntity invitationEntity
    ) {
        invitationEntity.setId(invitation);
        invitationEntity.setReferenceType(GROUP);
        invitationEntity.setReferenceId(group);
        return invitationService.update(invitationEntity);
    }

    @Path("{invitation}")
    @DELETE
    @Operation(
        summary = "Delete an invitation to join a group",
        description = "User must have the GROUP_INVITATION[DELETE] permission to use this service"
    )
    @Consumes(MediaType.APPLICATION_JSON)
    @Permissions(
        {
            @Permission(value = RolePermission.ENVIRONMENT_GROUP, acls = { UPDATE, CREATE }),
            @Permission(value = RolePermission.GROUP_INVITATION, acls = RolePermissionAction.DELETE),
        }
    )
    public void deleteGroupInvitation(@PathParam("invitation") String invitation) {
        invitationService.delete(invitation, group);
    }
}
