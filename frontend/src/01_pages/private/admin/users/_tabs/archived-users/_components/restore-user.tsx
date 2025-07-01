import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import { toast } from 'sonner';
import { type User } from '@/04_types/user';
import { mainInstance } from '@/07_instances/main-instance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatName } from '@/lib/format-name';

// Component props interface for restoring archived users
type RestoreUserProps = {
  open: boolean; // Controls dialog visibility
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // State setter for dialog
  selectedItem: User | null; // The user being restored
  refetch: () => void; // Callback to refresh parent data after restore
};

// Modal dialog component for restoring archived users
const RestoreUser = ({
  open,
  setOpen,
  selectedItem,
  refetch,
}: RestoreUserProps) => {
  // Loading state for restore operation
  const [isLoadingRestoreItem, setIsLoadingRestoreItem] = useState(false);

  // Handle form submission for user restoration
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form behavior
    e.preventDefault();

    // Set loading state during API call
    setIsLoadingRestoreItem(true);

    // Show toast notification during API request
    toast.promise(
      // Send POST request to restore endpoint
      mainInstance.post(`/api/users/${selectedItem?.id}/archived/restore`),
      {
        loading: 'Loading...',
        success: () => {
          // On success: refresh data and close dialog
          refetch();
          setOpen(false);
          return 'Success!';
        },
        error: error => {
          // Display error message from server or generic fallback
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          // Reset loading state
          setIsLoadingRestoreItem(false);
        },
      },
    );
  };

  return (
    // Dialog component for confirmation
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* Form wrapper for submit handling */}
        <form onSubmit={onSubmit}>
          {/* Dialog content */}
          <DialogBody>
            {/* Warning icon */}
            <CircleHelp className="text-warning mx-auto mb-4" size={64} />
            <h3 className="text-center text-xl">Restore User</h3>

            {/* Confirmation message */}
            <p className="text-muted-foreground mb-2 text-center">
              Are you sure you want to restore this record?
            </p>

            {/* Display user being restored */}
            <h2 className="text-center text-2xl font-semibold">
              {formatName(selectedItem, 'semifull')}
            </h2>
          </DialogBody>

          {/* Dialog action buttons */}
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="warning"
              type="submit"
              disabled={isLoadingRestoreItem}
            >
              Restore
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreUser;
