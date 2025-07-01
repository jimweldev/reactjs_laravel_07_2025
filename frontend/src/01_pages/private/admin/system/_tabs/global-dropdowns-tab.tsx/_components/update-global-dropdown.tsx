import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { SystemGlobalDropdown } from '@/04_types/system-global-dropdown';
import { mainInstance } from '@/07_instances/main-instance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define validation schema using Zod
const FormSchema = z.object({
  label: z.string().min(1, {
    message: 'Required',
  }),
  module: z.string().min(1, {
    message: 'Required',
  }),
  type: z.string().min(1, {
    message: 'Required',
  }),
});

// Define props for the this component
type UpdateGlobalDropdownProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SystemGlobalDropdown | null;
  refetch: () => void;
};

const UpdateGlobalDropdown = ({
  open,
  setOpen,
  selectedItem,
  refetch,
}: UpdateGlobalDropdownProps) => {
  // Initialize form with default values and schema resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: '',
      module: '',
      type: '',
    },
  });

  // Reset form values whenever the selected item changes
  useEffect(() => {
    if (selectedItem) {
      form.reset({
        label: selectedItem.label || '',
        module: selectedItem.module || '',
        type: selectedItem.type || '',
      });
    }
  }, [selectedItem, form]);

  // Loading state while updating the item
  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  // Form submission handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Set loading state
    setIsLoadingUpdateItem(true);

    // Send PATCH request and show toast notifications
    toast.promise(
      mainInstance.patch(
        `/api/system/global-dropdowns/${selectedItem?.id}`,
        data,
      ),
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
          setIsLoadingUpdateItem(false);
        },
      },
    );
  };

  return (
    // Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            {/* Dialog header */}
            <DialogHeader>
              <DialogTitle>Update Global Dropdown</DialogTitle>
            </DialogHeader>

            {/* Dialog body */}
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Regular" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="module"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="users" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="status" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogBody>

            {/* Dialog footer */}
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={isLoadingUpdateItem}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGlobalDropdown;
