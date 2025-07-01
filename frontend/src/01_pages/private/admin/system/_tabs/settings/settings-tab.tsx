import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type SystemSetting } from '@/04_types/system-setting';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import CreateSetting from './_components/create-setting';
import DeleteSetting from './_components/delete-setting';
import UpdateSetting from './_components/update-setting';

// Component for managing system settings in a tabulated interface
const SettingsTab = () => {
  // Pagination hook for fetching system settings data
  const systemSettingsPagination = usePagination(
    '/api/system/settings/paginate',
    'label',
  );

  // Button for creating new system settings
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateSystemSetting(true);
      }}
    >
      Create
    </Button>
  );

  // State variables for CRUD operations
  const [selectedSystemSetting, setSelectedSystemSetting] =
    useState<SystemSetting | null>(null);
  const [openCreateSystemSetting, setOpenCreateSystemSetting] =
    useState<boolean>(false);
  const [openUpdateSystemSetting, setOpenUpdateSystemSetting] =
    useState<boolean>(false);
  const [openDeleteSystemSetting, setOpenDeleteSystemSetting] =
    useState<boolean>(false);

  // Table column definitions
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
      label: 'Notes',
      column: 'notes',
    },
    {
      label: 'Actions',
    },
  ];

  return (
    <>
      {/* Main data table for displaying system settings */}
      <DataTable
        actions={Actions}
        pagination={systemSettingsPagination}
        columns={dataTableColumns}
      >
        {!systemSettingsPagination.error && systemSettingsPagination.data
          ? systemSettingsPagination.data.records?.map(
              (systemSetting: SystemSetting) => (
                <TableRow key={systemSetting.id}>
                  <TableCell>{systemSetting.label}</TableCell>
                  <TableCell>{systemSetting.value}</TableCell>
                  <TableCell>{systemSetting.notes}</TableCell>

                  {/* Action buttons for each setting */}
                  <TableCell>
                    <InputGroup size="sm">
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedSystemSetting(systemSetting);
                            setOpenUpdateSystemSetting(true);
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
                            setSelectedSystemSetting(systemSetting);
                            setOpenDeleteSystemSetting(true);
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

      {/* Modals for CRUD operations */}
      <CreateSetting
        open={openCreateSystemSetting}
        setOpen={setOpenCreateSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />
      <UpdateSetting
        selectedItem={selectedSystemSetting}
        open={openUpdateSystemSetting}
        setOpen={setOpenUpdateSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />
      <DeleteSetting
        selectedItem={selectedSystemSetting}
        open={openDeleteSystemSetting}
        setOpen={setOpenDeleteSystemSetting}
        refetch={systemSettingsPagination.refetch}
      />
    </>
  );
};

export default SettingsTab;
