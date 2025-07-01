import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import type { SystemGlobalDropdown } from '@/04_types/system-global-dropdown';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateGlobalDropdown from './_components/create-global-dropdown';
import DeleteGlobalDropdown from './_components/delete-global-dropdown';
import UpdateGlobalDropdown from './_components/update-global-dropdown';

const GlobalDropdownsTab = () => {
  // Hook to handle pagination for global dropdowns API endpoint
  const systemGlobalDropdownsPagination = usePagination(
    '/api/system/global-dropdowns/paginate',
    'id',
  );

  // Main action button to create new global dropdowns
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateSystemGlobalDropdown(true);
      }}
    >
      Create
    </Button>
  );

  // State management for global dropdown operations
  const [selectedSystemGlobalDropdown, setSelectedSystemGlobalDropdown] =
    useState<SystemGlobalDropdown | null>(null);
  const [openCreateSystemGlobalDropdown, setOpenCreateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openUpdateSystemGlobalDropdown, setOpenUpdateSystemGlobalDropdown] =
    useState<boolean>(false);
  const [openDeleteSystemGlobalDropdown, setOpenDeleteSystemGlobalDropdown] =
    useState<boolean>(false);

  // Column configuration for the data table
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
      label: 'Type',
      column: 'type',
    },
    {
      label: 'Actions',
    },
  ];

  return (
    <>
      <DataTable
        actions={Actions}
        pagination={systemGlobalDropdownsPagination}
        columns={dataTableColumns}
      >
        {!systemGlobalDropdownsPagination.error &&
        systemGlobalDropdownsPagination.data
          ? systemGlobalDropdownsPagination.data.records?.map(
              (systemGlobalDropdown: SystemGlobalDropdown) => (
                <TableRow key={systemGlobalDropdown.id}>
                  <TableCell>{systemGlobalDropdown.label}</TableCell>

                  <TableCell>{systemGlobalDropdown.module}</TableCell>

                  <TableCell>{systemGlobalDropdown.type}</TableCell>

                  <TableCell>
                    <InputGroup size="sm">
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedSystemGlobalDropdown(
                              systemGlobalDropdown,
                            );
                            setOpenUpdateSystemGlobalDropdown(true);
                          }}
                          size="xs"
                        >
                          <FaEdit />
                        </Button>
                      </ToolTip>
                      <ToolTip content="Delete">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedSystemGlobalDropdown(
                              systemGlobalDropdown,
                            );
                            setOpenDeleteSystemGlobalDropdown(true);
                          }}
                          size="xs"
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

      <CreateGlobalDropdown
        open={openCreateSystemGlobalDropdown}
        setOpen={setOpenCreateSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      <UpdateGlobalDropdown
        open={openUpdateSystemGlobalDropdown}
        setOpen={setOpenUpdateSystemGlobalDropdown}
        selectedItem={selectedSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
      <DeleteGlobalDropdown
        open={openDeleteSystemGlobalDropdown}
        setOpen={setOpenDeleteSystemGlobalDropdown}
        selectedItem={selectedSystemGlobalDropdown}
        refetch={systemGlobalDropdownsPagination.refetch}
      />
    </>
  );
};

export default GlobalDropdownsTab;
