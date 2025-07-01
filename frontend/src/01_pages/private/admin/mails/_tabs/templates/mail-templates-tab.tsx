import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import type { MailTemplate } from '@/04_types/mail-template';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { getDateTimezone } from '@/lib/get-date-timezone';
import CreateMailTemplate from './_components/create-mail-template';
import DeleteMailTemplate from './_components/delete-mail-template';
import UpdateMailTemplate from './_components/update-mail-template';

const MailTemplatesTab = () => {
  // Fetch paginated mail templates using custom hook
  const mailTemplatesPagination = usePagination(
    '/api/mails/templates/paginate',
    'id',
  );

  // "Create" button used in the DataTable header
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateMailTemplate(true);
      }}
    >
      Create
    </Button>
  );

  // State to track selected template for update/delete
  const [selectedMailTemplate, setSelectedMailTemplate] =
    useState<MailTemplate | null>(null);

  // State to control visibility of modal dialogs
  const [openCreateMailTemplate, setOpenCreateMailTemplate] =
    useState<boolean>(false);
  const [openUpdateMailTemplate, setOpenUpdateMailTemplate] =
    useState<boolean>(false);
  const [openDeleteMailTemplate, setOpenDeleteMailTemplate] =
    useState<boolean>(false);

  // Column configuration for the DataTable
  const dataTableColumns: DataTableColumns[] = [
    { label: 'ID', column: 'id' },
    { label: 'Label', column: 'label' },
    { label: 'Date Created', column: 'created_at' },
    { label: 'Actions' }, // Action buttons column
  ];

  return (
    <>
      {/* DataTable displays paginated templates with action buttons */}
      <DataTable
        actions={Actions}
        pagination={mailTemplatesPagination}
        columns={dataTableColumns}
      >
        {/* Render rows only if data is present and no error */}
        {!mailTemplatesPagination.error && mailTemplatesPagination.data
          ? mailTemplatesPagination.data.records?.map(
              (mailTemplate: MailTemplate) => (
                <TableRow key={mailTemplate.id}>
                  <TableCell>{mailTemplate.id}</TableCell>

                  <TableCell>{mailTemplate.label}</TableCell>

                  <TableCell className="font-mono text-xs">
                    {/* Display formatted creation date */}
                    {getDateTimezone(
                      mailTemplate.created_at || '',
                      'date_time',
                    )}
                  </TableCell>

                  <TableCell>
                    {/* Action buttons: Edit and Delete */}
                    <InputGroup size="sm">
                      <ToolTip content="Edit">
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedMailTemplate(mailTemplate);
                            setOpenUpdateMailTemplate(true);
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
                            setSelectedMailTemplate(mailTemplate);
                            setOpenDeleteMailTemplate(true);
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

      {/* Modal for creating a new template */}
      <CreateMailTemplate
        open={openCreateMailTemplate}
        setOpen={setOpenCreateMailTemplate}
        refetch={mailTemplatesPagination.refetch} // Refetch after creation
      />

      {/* Modal for updating the selected template */}
      <UpdateMailTemplate
        selectedItem={selectedMailTemplate}
        setSelectedItem={setSelectedMailTemplate}
        open={openUpdateMailTemplate}
        setOpen={setOpenUpdateMailTemplate}
        refetch={mailTemplatesPagination.refetch} // Refetch after update
      />

      {/* Modal for deleting the selected template */}
      <DeleteMailTemplate
        selectedItem={selectedMailTemplate}
        setSelectedItem={setSelectedMailTemplate}
        open={openDeleteMailTemplate}
        setOpen={setOpenDeleteMailTemplate}
        refetch={mailTemplatesPagination.refetch} // Refetch after deletion
      />
    </>
  );
};

export default MailTemplatesTab;
