import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { MailTemplate } from '@/04_types/mail-template';
import { mainInstance } from '@/07_instances/main-instance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

// Props interface for the DeleteMailTemplate component
type DeleteMailTemplateProps = {
  selectedItem: MailTemplate | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<MailTemplate | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const DeleteMailTemplate = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: DeleteMailTemplateProps) => {
  // Loading state for delete operation
  const [isLoadingDeleteItem, setIsLoadingDeleteItem] = useState(false);

  // Handle form submission for deleting an item
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingDeleteItem(true);

    // Show toast notifications during delete operation
    toast.promise(
      mainInstance.delete(`/api/mails/templates/${selectedItem?.id}`),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          setSelectedItem(null);
          setOpen(false);
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          setIsLoadingDeleteItem(false);
        },
      },
    );
  };

  return (
    // Dialog component for delete confirmation
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);

        // Reset selected item after a short delay
        setTimeout(() => {
          setSelectedItem(null);
        }, 200);
      }}
    >
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogTitle />
          <DialogDescription />
          <DialogBody>
            {/* Warning icon */}
            <CircleAlert className="text-destructive mx-auto mb-4" size={64} />

            {/* Confirmation message */}
            <h3 className="text-center text-xl">Delete Mail Template</h3>
            <p className="text-muted-foreground mb-2 text-center">
              Are you sure you want to delete this record?
            </p>
            <h2 className="text-center text-2xl font-semibold">
              {selectedItem?.label}
            </h2>
          </DialogBody>
          {/* Dialog footer with action buttons */}
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

export default DeleteMailTemplate;
