import { useState } from 'react';
import { FaHistory } from 'react-icons/fa';
import { type User } from '@/04_types/user';
import DataTable, {
  type DataTableColumns,
} from '@/components/data-tables/data-table';
import FancyboxViewer from '@/components/fancybox/fancybox-viewer';
import InputGroup from '@/components/forms/input-group';
import ReactImage from '@/components/images/react-image';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import useFancybox from '@/hooks/use-fancybox';
import usePagination from '@/hooks/use-pagination';
import { formatName } from '@/lib/format-name';
import { getImageUrl } from '@/lib/get-image-url';
import RestoreUser from './_components/restore-user';
import fallbackImage from '/images/default-avatar.png';

// Component for managing and displaying archived users in a tabulated interface
const ArchivedUsersTab = () => {
  // Fancybox hook for image preview functionality
  const [fancyboxRef] = useFancybox();

  // Pagination hook for fetching archived users data
  const usersPagination = usePagination(
    '/api/users/archived/paginate',
    'first_name',
  );

  // State variables for restore operation
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openRestoreUser, setOpenRestoreUser] = useState<boolean>(false);

  // Table column definitions
  const dataTableColumns: DataTableColumns[] = [
    {
      label: 'Name',
      column: 'first_name',
    },
    {
      label: 'Email',
      column: 'email',
    },
    {
      label: 'Role',
      column: 'is_admin',
    },
    {
      label: 'Actions',
    },
  ];

  return (
    <>
      {/* Container for fancybox image previews */}
      <div ref={fancyboxRef}>
        {/* Main data table displaying archived users */}
        <DataTable
          pagination={usersPagination}
          columns={dataTableColumns}
          size="md"
        >
          {!usersPagination.error && usersPagination.data
            ? usersPagination.data.records?.map((user: User) => (
                <TableRow key={user.id}>
                  {/* User name with avatar */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FancyboxViewer
                        baseUrl={import.meta.env.VITE_STORAGE_BASE_URL}
                        filePath={user.avatar_path}
                        data-fancybox={`${user.id}`}
                        data-caption={formatName(user, 'semifull')}
                        fallback={fallbackImage}
                      >
                        <div className="outline-primary border-card flex aspect-square h-8 cursor-pointer items-center overflow-hidden rounded-full border-1 outline-2 select-none">
                          <ReactImage
                            className="pointer-events-none h-full w-full object-cover"
                            src={getImageUrl(
                              `${import.meta.env.VITE_STORAGE_BASE_URL}/`,
                              user.avatar_path,
                            )}
                            unloaderSrc={fallbackImage}
                          />
                        </div>
                      </FancyboxViewer>

                      <div>
                        <h6 className="font-medium">
                          {formatName(user, 'semifull')}
                        </h6>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  {/* User role badge */}
                  <TableCell>
                    <Badge variant={user.is_admin ? 'success' : 'default'}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </Badge>
                  </TableCell>

                  {/* Restore action button */}
                  <TableCell>
                    <InputGroup size="sm">
                      <ToolTip content="Restore">
                        <Button
                          variant="warning"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenRestoreUser(true);
                          }}
                          size="xs"
                        >
                          <FaHistory />
                        </Button>
                      </ToolTip>
                    </InputGroup>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </DataTable>
      </div>

      {/* Restore user modal */}
      <RestoreUser
        open={openRestoreUser}
        setOpen={setOpenRestoreUser}
        selectedItem={selectedUser}
        refetch={usersPagination.refetch}
      />
    </>
  );
};

export default ArchivedUsersTab;
