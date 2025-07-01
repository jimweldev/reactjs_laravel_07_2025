import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FaArrowRotateRight, FaSpinner, FaThumbtack } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import { toast } from 'sonner';
import type { PaginatedRecords } from '@/04_types/common/paginated-records';
import type { UserImage } from '@/04_types/user-image';
import { mainInstance } from '@/07_instances/main-instance';
import ReactImage from '@/components/images/react-image';
import UserImagesSkeleton from '@/components/skeletons/user-images-skeleton';
import ToolTip from '@/components/tool-tips/tool-tip';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DeleteImage from './_components/delete-image';
import RenameImage from './_components/rename-image';
import UploadImage from './_components/upload-image';

type ReactQuillEditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectImage: (url: string) => void;
};

const ReactQuillMyUserImage = ({
  open,
  setOpen,
  onSelectImage: onSelectImageHandler,
}: ReactQuillEditorProps) => {
  const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);

  const [limit, setLimit] = useState<string>('18');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState('-created_at');
  const [searchTerm, setSearchTerm] = useDebouncedState('', 200);

  const {
    data: galleries,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedRecords<UserImage>>({
    queryKey: ['user-images/paginate', searchTerm, limit, currentPage, sort],
    queryFn: async ({ signal }): Promise<PaginatedRecords<UserImage>> => {
      const res = await mainInstance.get(
        `/api/user-images/paginate?search=${searchTerm}&limit=${limit}&page=${currentPage}&sort=${sort}`,
        {
          signal,
        },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    enabled: open,
  });

  const [selectedImage, setSelectedImage] = useState<UserImage | null>(null);
  const [openRenameUserImage, setOpenRenameUserImage] =
    useState<boolean>(false);
  const [openDeleteUserImage, setOpenDeleteUserImage] =
    useState<boolean>(false);

  const onSelectImage = (userImage: UserImage) => {
    if (!selectedImage) {
      setSelectedImage(userImage);
    } else {
      if (selectedImage.id === userImage.id) {
        setSelectedImage(null);
      } else {
        setSelectedImage(userImage);
      }
    }
  };

  const onSubmit = (image?: UserImage) => {
    const finalImage = image || selectedImage;
    if (!finalImage) {
      toast.error('Please select an image');
      return;
    }

    onSelectImageHandler(
      `${import.meta.env.VITE_STORAGE_BASE_URL}/${finalImage.file_path}`,
    );
    setSelectedImage(null);
    setOpen(false);
  };

  const onTogglePin = (image: UserImage) => {
    toast.promise(
      mainInstance.patch(`/api/user-images/${image?.id}`, {
        is_pinned: !image.is_pinned,
      }),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
      },
    );
  };

  const handlePageChange = ({ selected }: { selected: number }) =>
    setCurrentPage(selected + 1);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="@container/dialog" size="lg">
          <DialogHeader>
            <DialogTitle>My Images</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-between gap-2 @xl/dialog:flex-row">
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setOpenUploadImage(true)}>
                    Upload
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-between gap-2 @lg/dialog:flex-row">
                  <Input
                    inputSize="sm"
                    placeholder="Search"
                    onChange={e => {
                      setCurrentPage(1);
                      setSearchTerm(e.target.value);
                      setSelectedImage(null);
                    }}
                  />

                  <Select
                    value={sort}
                    onValueChange={value => {
                      setSort(value);
                      setCurrentPage(1);
                      setSelectedImage(null);
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-[100px] min-w-[100px]"
                    >
                      <SelectValue placeholder="Select entry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="created_at">↑ Date</SelectItem>
                        <SelectItem value="-created_at">↓ Date</SelectItem>
                        <SelectItem value="file_name">↑ Name</SelectItem>
                        <SelectItem value="-file_name">↓ Name</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Select
                      value={limit}
                      onValueChange={value => {
                        setLimit(value);
                        setCurrentPage(1);
                        setSelectedImage(null);
                      }}
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-[75px] min-w-[75px]"
                      >
                        <SelectValue placeholder="Select entry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="18">18</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refetch();
                      }}
                    >
                      {isFetching ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaArrowRotateRight />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <hr className={`${isFetching ? 'border-primary' : ''}`} />

              {isLoading ? (
                <UserImagesSkeleton inputCount={+limit} />
              ) : error ? (
                <h1>Error</h1>
              ) : galleries?.records?.length === 0 ? (
                <div className="w-full rounded-md border-2 p-8">
                  <h1 className="text-muted-foreground text-center">
                    No images found
                  </h1>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-3">
                  {galleries?.records?.map(userImage => (
                    <div className="col-span-2" key={userImage.id}>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <div className="relative transition-transform duration-200 ease-in-out hover:scale-105">
                            <div
                              className={`aspect-square w-full cursor-pointer overflow-hidden rounded-md border-2 ${
                                selectedImage?.id === userImage.id
                                  ? 'border-primary'
                                  : 'border-muted'
                              }`}
                              onClick={() => onSelectImage(userImage)}
                              onDoubleClick={() => onSubmit(userImage)}
                            >
                              <ReactImage
                                src={`${import.meta.env.VITE_STORAGE_BASE_URL}/${userImage.file_path}`}
                                alt={userImage.file_name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {userImage.is_pinned ? (
                              <FaThumbtack className="absolute -top-1 -right-1 rotate-45 text-green-600 drop-shadow-md/50" />
                            ) : null}
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => onTogglePin(userImage)}
                          >
                            {userImage.is_pinned ? 'Unpin' : 'Pin'}
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              setSelectedImage(userImage);
                              setOpenRenameUserImage(true);
                            }}
                          >
                            Rename
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="bg-destructive hover:!bg-destructive/90 !text-white"
                            onClick={() => {
                              setSelectedImage(userImage);
                              setOpenDeleteUserImage(true);
                            }}
                          >
                            Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>

                      <ToolTip content={userImage.file_name || ''}>
                        <p className="line-clamp-2 text-center text-xs text-wrap break-all">
                          {userImage.file_name}
                        </p>
                      </ToolTip>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col items-center justify-between gap-2 @xl/dialog:flex-row">
                <span className="text-muted-foreground text-sm">
                  {`Showing ${
                    (galleries?.records?.length || 0) > 0
                      ? (currentPage - 1) * Number(limit) + 1
                      : 0
                  } to ${(currentPage - 1) * Number(limit) + (galleries?.records?.length || 0)} of ${
                    galleries?.info?.total || 0
                  } entries`}
                </span>
                <ReactPaginate
                  containerClassName="pagination pagination-sm"
                  pageCount={galleries?.info?.pages || 1}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  forcePage={currentPage - 1}
                  previousLabel={<>&laquo;</>}
                  nextLabel={<>&raquo;</>}
                  breakLabel="..."
                  activeClassName="active"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(selectedImage!)}>Select</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UploadImage
        open={openUploadImage}
        setOpen={setOpenUploadImage}
        refetch={refetch}
      />
      <RenameImage
        open={openRenameUserImage}
        setOpen={setOpenRenameUserImage}
        selectedItem={selectedImage!}
        refetch={refetch}
      />
      <DeleteImage
        open={openDeleteUserImage}
        setOpen={setOpenDeleteUserImage}
        selectedItem={selectedImage!}
        refetch={refetch}
      />
    </>
  );
};

export default ReactQuillMyUserImage;
