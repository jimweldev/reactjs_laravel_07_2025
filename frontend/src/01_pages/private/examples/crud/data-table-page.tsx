import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { type Task } from '@/04_types/task';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import PageHeader from '@/components/typography/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { getDateTimezone } from '@/lib/get-date-timezone';
import CreateTask from './_components/create-task';
import DeleteTask from './_components/delete-task';
import UpdateTask from './_components/update-task';

const DataTablePage = () => {
  // Initialize pagination hook for tasks
  const tasksPagination = usePagination('/api/tasks/paginate', 'id');

  // State for selected item and handling modal visibility
  const [selectedItem, setSelectedItem] = useState<Task | null>(null);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  // Define the columns to be displayed in the data table
  const dataTableColumns: DataTableColumns[] = [
    { label: 'ID', column: 'id', className: 'w-[100px]' },
    { label: 'Name', column: 'name' },
    { label: 'Date Created', column: 'created_at', className: 'w-[200px]' },
    { label: 'Actions', className: 'w-[150px]' },
  ];

  // Define the "Data Table Actions" shown above the data table
  const dataTableActions = (
    <div className="flex justify-end">
      <Button size="sm" onClick={() => setOpenCreate(true)}>
        Create
      </Button>
    </div>
  );

  return (
    <>
      {/* Page title */}
      <PageHeader className="mb-3">Data Table</PageHeader>

      {/* Card */}
      <Card>
        <CardBody>
          {/* Data Table */}
          <DataTable
            actions={dataTableActions}
            pagination={tasksPagination}
            columns={dataTableColumns}
          >
            {/* Render table rows only if data is available and no error */}
            {!tasksPagination.error && tasksPagination.data
              ? tasksPagination.data.records?.map((task: Task) => (
                  // Data table row
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {getDateTimezone(task.created_at!, 'date_time')}
                    </TableCell>
                    <TableCell>
                      <InputGroup size="sm">
                        {/* Edit button with tooltip */}
                        <ToolTip content="Edit">
                          <Button
                            variant="info"
                            size="xs"
                            onClick={() => {
                              setSelectedItem(task);
                              setOpenUpdate(true);
                            }}
                          >
                            <FaEdit />
                          </Button>
                        </ToolTip>

                        {/* Delete button with tooltip */}
                        <ToolTip content="Delete">
                          <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => {
                              setSelectedItem(task);
                              setOpenDelete(true);
                            }}
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
        </CardBody>
      </Card>

      {/* Modals */}
      <CreateTask
        open={openCreate}
        setOpen={setOpenCreate}
        refetch={tasksPagination.refetch}
      />
      <UpdateTask
        open={openUpdate}
        setOpen={setOpenUpdate}
        selectedItem={selectedItem}
        refetch={tasksPagination.refetch}
      />
      <DeleteTask
        open={openDelete}
        setOpen={setOpenDelete}
        selectedItem={selectedItem}
        refetch={tasksPagination.refetch}
      />
    </>
  );
};

export default DataTablePage;
