import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { SystemSetting } from '@/04_types/system-setting';
import { mainInstance } from '@/07_instances/main-instance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';

// Define props for the this component
type DeleteSettingProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SystemSetting | null;
  refetch: () => void;
};

const DeleteSetting = ({
  open,
  setOpen,
  selectedItem,
  refetch,
}: DeleteSettingProps) => {
  // Loading state while deleting the item
  const [isLoadingDeleteItem, setIsLoadingDeleteItem] = useState(false);

  // Form submission handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    // Set loading state
    setIsLoadingDeleteItem(true);

    // Send DELETE request and show toast notifications
    toast.promise(
      mainInstance.delete(`/api/system/settings/${selectedItem?.id}`),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          setOpen(false);
          return 'Success!';
        },
        error: error => {
          // Display server error or fallback message
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          // Reset loading state regardless of outcome
          setIsLoadingDeleteItem(false);
        },
      },
    );
  };

  return (
    // Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          {/* Dialog body */}
          <DialogBody>
            <CircleAlert className="text-destructive mx-auto mb-4" size={64} />

            <h3 className="text-center text-xl">Delete Setting</h3>

            <p className="text-muted-foreground mb-2 text-center">
              Are you sure you want to delete this record?
            </p>

            <h2 className="text-center text-2xl font-semibold">
              {selectedItem?.label}
            </h2>
          </DialogBody>

          {/* Dialog footer */}
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              type="submit"
              disabled={isLoadingDeleteItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSetting;
