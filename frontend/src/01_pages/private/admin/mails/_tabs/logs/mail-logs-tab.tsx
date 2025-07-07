import { useState } from 'react';
import { FaEye, FaSquareCheck, FaSquareXmark } from 'react-icons/fa6';
import type { MailLog } from '@/04_types/mail-log';
import type { DataTableColumns } from '@/components/data-tables/data-table';
import DataTable from '@/components/data-tables/data-table';
import FancyboxViewer from '@/components/fancybox/fancybox-viewer';
import InputGroup from '@/components/forms/input-group';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import useFancybox from '@/hooks/use-fancybox';
import usePagination from '@/hooks/use-pagination';
import { getDateTimezone } from '@/lib/get-date-timezone';
import CreateMailLog from './_components/create-mail-log';
import ViewMailLog from './_components/view-mail-log';

const MailLogsTab = () => {
  const [fancyboxRef] = useFancybox();

  // Custom hook to manage paginated mail logs
  const mailLogsPagination = usePagination('/api/mails/logs/paginate', 'id');

  // "Create" button for opening the create mail log modal
  const Actions = (
    <Button
      size="sm"
      onClick={() => {
        setOpenCreateMailLog(true);
      }}
    >
      Create
    </Button>
  );

  // Local state to track selected mail log and modal visibility
  const [selectedMailLog, setSelectedMailLog] = useState<MailLog | null>(null);
  const [openCreateMailLog, setOpenCreateMailLog] = useState<boolean>(false);
  const [openViewMailLog, setOpenViewMailLog] = useState<boolean>(false);

  // Column configuration for the DataTable
  const dataTableColumns: DataTableColumns[] = [
    { label: 'ID', column: 'id' },
    { label: 'Recipient', column: 'recipient_email' },
    { label: 'Subject', column: 'subject' },
    { label: 'Attachments' },
    { label: 'Sent', column: 'is_sent' },
    { label: 'Date Created', column: 'created_at' },
    { label: 'Actions' },
  ];

  return (
    <>
      {/* Fancybox wrapper enables lightbox previews for attachments */}
      <div ref={fancyboxRef}>
        <DataTable
          actions={Actions}
          pagination={mailLogsPagination}
          columns={dataTableColumns}
        >
          {/* Render table rows if data is available and no error */}
          {!mailLogsPagination.error && mailLogsPagination.data
            ? mailLogsPagination.data.records?.map((mailLog: MailLog) => (
                <TableRow key={mailLog.id}>
                  <TableCell>{mailLog.id}</TableCell>
                  <TableCell>{mailLog.recipient_email}</TableCell>
                  <TableCell>{mailLog.subject}</TableCell>
                  <TableCell>
                    {/* Render each attachment as a clickable badge */}
                    <div className="flex flex-wrap items-center gap-1">
                      {mailLog.mail_log_attachments?.map(attachment => {
                        return (
                          <FancyboxViewer
                            baseUrl={import.meta.env.VITE_STORAGE_BASE_URL}
                            filePath={attachment.file_path}
                            key={attachment.id}
                            data-fancybox={`${mailLog.id}`}
                            data-caption={attachment.file_name}
                          >
                            <Badge className="cursor-pointer">
                              {attachment.file_name}
                            </Badge>
                          </FancyboxViewer>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {mailLog.is_sent ? (
                      <FaSquareCheck className="text-success" />
                    ) : (
                      <FaSquareXmark className="text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {/* Format the date with timezone info */}
                    {getDateTimezone(mailLog.created_at || '', 'date_time')}
                  </TableCell>
                  <TableCell>
                    {/* View button with tooltip */}
                    <InputGroup size="sm">
                      <ToolTip content="View Mail">
                        <Button
                          variant="info"
                          size="xs"
                          onClick={() => {
                            setSelectedMailLog(mailLog); // Set selected log
                            setOpenViewMailLog(true); // Open view modal
                          }}
                        >
                          <FaEye />
                        </Button>
                      </ToolTip>
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </DataTable>
      </div>

      {/* Modal for creating a new mail log */}
      <CreateMailLog
        open={openCreateMailLog}
        setOpen={setOpenCreateMailLog}
        refetch={mailLogsPagination.refetch}
      />

      {/* Modal for viewing mail log details */}
      <ViewMailLog
        open={openViewMailLog}
        setOpen={setOpenViewMailLog}
        selectedItem={selectedMailLog}
      />
    </>
  );
};

export default MailLogsTab;
