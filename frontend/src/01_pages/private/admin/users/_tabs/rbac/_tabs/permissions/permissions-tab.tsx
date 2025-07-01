import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type RbacPermission } from '@/04_types/rbac-permission';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreatePermission from './_components/create-permission';
import DeletePermission from './_components/delete-permission';
import UpdatePermission from './_components/update-permission';

const PermissionsTab = () => {
  // State for managing the currently selected permission and modal visibility
  const [selectedRbacPermission, setSelectedRbacPermission] =
    useState<RbacPermission | null>(null);
  const [openCreateRbacPermission, setOpenCreateRbacPermission] =
    useState<boolean>(false);
  const [openUpdateRbacPermission, setOpenUpdateRbacPermission] =
    useState<boolean>(false);
  const [openDeleteRbacPermission, setOpenDeleteRbacPermission] =
    useState<boolean>(false);

  // Initialize pagination for the permissions table
  const rbacPermissionsPagination = usePagination(
    '/api/rbac/permissions/paginate',
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
      label: 'Actions',
    },
  ];

  // Action button for creating a new permission
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateRbacPermission(true);
      }}
      aria-label="Create new permission"
    >
      Create
    </Button>
  );

  return (
    <>
      {/* Main DataTable for displaying permissions */}
      <DataTable
        pagination={rbacPermissionsPagination}
        columns={dataTableColumns}
        actions={Actions}
      >
        {/* Map through the list of permissions and render each as a table row */}
        {!rbacPermissionsPagination.error && rbacPermissionsPagination.data
          ? rbacPermissionsPagination.data.records?.map(
              (rbacPermission: RbacPermission) => (
                <TableRow key={rbacPermission.id}>
                  {/* Display permission label */}
                  <TableCell>{rbacPermission.label}</TableCell>

                  {/* Display permission value */}
                  <TableCell>{rbacPermission.value}</TableCell>

                  {/* Action buttons */}
                  <TableCell>
                    <InputGroup size="sm">
                      {/* Edit button */}
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedRbacPermission(rbacPermission);
                            setOpenUpdateRbacPermission(true);
                          }}
                          size="xs"
                          aria-label={`Edit permission ${rbacPermission.label}`}
                        >
                          <FaEdit />
                        </Button>
                      </ToolTip>

                      {/* Delete button */}
                      <ToolTip content="Delete">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedRbacPermission(rbacPermission);
                            setOpenDeleteRbacPermission(true);
                          }}
                          size="xs"
                          aria-label={`Delete permission ${rbacPermission.label}`}
                        >
                          <FaTrash />
                        </Button>
                      </ToolTip>
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ),
            )
          : null}
      </DataTable>

      {/* Modal for creating a new permission */}
      <CreatePermission
        open={openCreateRbacPermission}
        setOpen={setOpenCreateRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />

      {/* Modal for updating an existing permission */}
      <UpdatePermission
        open={openUpdateRbacPermission}
        setOpen={setOpenUpdateRbacPermission}
        selectedItem={selectedRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />

      {/* Modal for deleting a permission */}
      <DeletePermission
        open={openDeleteRbacPermission}
        setOpen={setOpenDeleteRbacPermission}
        selectedItem={selectedRbacPermission}
        refetch={rbacPermissionsPagination.refetch}
      />
    </>
  );
};

export default PermissionsTab;
