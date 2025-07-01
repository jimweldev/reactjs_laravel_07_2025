import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { type RbacUserRole } from '@/04_types/rbac-user-role';
import { type User } from '@/04_types/user';
import { mainInstance } from '@/07_instances/main-instance';
import RolesSelect from '@/components/react-select/roles-select';
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
import { Label } from '@/components/ui/label';
import { formatName } from '@/lib/format-name';

// Define validation schema using Zod
const FormSchema = z.object({
  roles: z.array(
    z.object({
      label: z.string().min(1, {
        message: 'Required',
      }),
      value: z.number().min(1, {
        message: 'Required',
      }),
    }),
  ),
});

// Define validation schema using Zod
type UpdateUserRolesProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: User | null;
  refetch: () => void;
};

const UpdateUserRoles = ({
  open,
  setOpen,
  selectedItem,
  refetch,
}: UpdateUserRolesProps) => {
  // Initialize form with default values and schema resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roles: [],
    },
  });

  // Reset form values whenever the selected item changes
  useEffect(() => {
    if (selectedItem) {
      const selectedRoles = selectedItem?.rbac_user_roles?.map(
        (role: RbacUserRole) => ({
          label: role.rbac_role?.label,
          value: role.rbac_role?.id,
        }),
      );

      form.reset({
        roles: selectedRoles || [],
      });
    }
  }, [selectedItem, form]);

  // Loading state while updating the item
  const [isLoadingUpdateItem, setIsLoadingUpdateItem] = useState(false);

  // Form submission handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Remove permissions from data
    const newData = {
      role_ids: data.roles.map(role => role.value),
    };

    // Set loading state
    setIsLoadingUpdateItem(true);

    // Send PATCH request and show toast notifications
    toast.promise(
      mainInstance.patch(`/api/users/${selectedItem?.id}/user-roles`, newData),
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
              <DialogTitle>Update User Roles</DialogTitle>
            </DialogHeader>

            {/* Dialog body */}
            <DialogBody>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12">
                  <Label className="mb-1">User</Label>
                  <Input value={formatName(selectedItem)} readOnly />
                </div>

                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Roles</FormLabel>
                      <FormControl>
                        <RolesSelect
                          placeholder="Select roles"
                          isMulti
                          closeMenuOnSelect={false}
                          value={field.value || []}
                          onChange={field.onChange}
                        />
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

export default UpdateUserRoles;
