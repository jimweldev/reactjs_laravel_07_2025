import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacRole } from '@/04_types/rbac-role';
import { type RbacRolePermission } from '@/04_types/rbac-role-permission';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateRole from './_components/create-role';
import DeleteRole from './_components/delete-role';
import UpdateRole from './_components/update-role';

const RolesTab = () => {
  // State for managing the currently selected role and modal visibility
  const [selectedRbacRole, setSelectedRbacRole] = useState<RbacRole | null>(
    null,
  );
  const [openCreateRbacRole, setOpenCreateRbacRole] = useState<boolean>(false);
  const [openUpdateRbacRole, setOpenUpdateRbacRole] = useState<boolean>(false);
  const [openDeleteRbacRole, setOpenDeleteRbacRole] = useState<boolean>(false);

  // Initialize pagination for the roles table
  const rbacRolesPagination = usePagination(
    '/api/rbac/roles/paginate',
    'label',
  );

  // Define the column configuration for the data table
  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'Label',
      column: 'label',
    },
    {
      label: 'Value',
      column: 'value',
    },
    {
      label: 'Permissions',
    },
    {
      label: 'Actions',
    },
  ];

  // Action button for creating a new role
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateRbacRole(true);
      }}
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Main DataTable for displaying roles */}
      <DataTable
        pagination={rbacRolesPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {/* Map through the list of roles and render each as a table row */}
        {!rbacRolesPagination.error && rbacRolesPagination.data
          ? rbacRolesPagination.data.records?.map((rbacRole: RbacRole) => (
              <TableRow key={rbacRole.id}>
                {/* Display role label */}
                <TableCell>{rbacRole.label}</TableCell>

                {/* Display role value */}
                <TableCell>{rbacRole.value}</TableCell>

                {/* Display permissions as badges */}
                <TableCell className="flex flex-wrap gap-1">
                  {rbacRole.rbac_role_permissions?.map(
                    (rolePermission: RbacRolePermission) => (
                      <Badge key={rolePermission.id}>
                        {rolePermission.rbac_permission?.label}
                      </Badge>
                    ),
                  )}
                </TableCell>

                {/* Action buttons */}
                <TableCell>
                  <InputGroup size="sm">
                    {/* Edit button */}
                    <ToolTip content="Edit">
                      <Button
                        variant="info"
                        onClick={() => {
                          setSelectedRbacRole(rbacRole);
                          setOpenUpdateRbacRole(true);
                        }}
                        size="xs"
                        aria-label={`Edit role ${rbacRole.label}`}
                      >
                        <FaEdit />
                      </Button>
                    </ToolTip>

                    {/* Delete button */}
                    <ToolTip content="Delete">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedRbacRole(rbacRole);
                          setOpenDeleteRbacRole(true);
                        }}
                        size="xs"
                        aria-label={`Delete role ${rbacRole.label}`}
                      >
                        <FaTrash />
                      </Button>
                    </ToolTip>
                  </InputGroup>
                </TableCell>
              </TableRow>
            ))
          : null}
      </DataTable>

      {/* Modal for creating a new role */}
      <CreateRole
        open={openCreateRbacRole}
        setOpen={setOpenCreateRbacRole}
        refetch={rbacRolesPagination.refetch}
      />

      {/* Modal for updating an existing role */}
      <UpdateRole
        open={openUpdateRbacRole}
        setOpen={setOpenUpdateRbacRole}
        selectedItem={selectedRbacRole}
        refetch={rbacRolesPagination.refetch}
      />

      {/* Modal for deleting a role */}
      <DeleteRole
        open={openDeleteRbacRole}
        setOpen={setOpenDeleteRbacRole}
        selectedItem={selectedRbacRole}
        refetch={rbacRolesPagination.refetch}
      />
    </>
  );
};

export default RolesTab;
