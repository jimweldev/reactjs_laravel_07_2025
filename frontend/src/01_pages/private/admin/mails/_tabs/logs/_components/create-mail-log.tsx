import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { mainInstance } from '@/07_instances/main-instance';
import MailAttachmentDropzone from '@/components/file-dropzones/mail-attachment-dropzone';
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
import { Textarea } from '@/components/ui/textarea';
import { handleFileRejections } from '@/lib/handle-file-rejections';

// Define validation schema using Zod
const FormSchema = z.object({
  mail_template_id: z.string().min(1, { message: 'Required' }),
  user_id: z.string(),
  subject: z.string().min(1, { message: 'Required' }),
  recipient_email: z.string().email({ message: 'Invalid email address' }),
  cc: z.string().refine(
    data => {
      try {
        return data === '' || !!JSON.parse(data);
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON' },
  ),
  bcc: z.string().refine(
    data => {
      try {
        return data === '' || !!JSON.parse(data);
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON' },
  ),
  content_data: z.string().refine(
    data => {
      try {
        JSON.parse(data);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON' },
  ),
  attachments: z.array(z.any()),
});

// Define props for the this component
type CreateMailLogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const CreateMailLog = ({ open, setOpen, refetch }: CreateMailLogProps) => {
  // Initialize form with default values and schema resolver
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mail_template_id: '',
      user_id: '',
      subject: '',
      recipient_email: '',
      cc: '',
      bcc: '',
      content_data: '',
      attachments: [],
    },
  });

  // Loading state while creating the item
  const [isLoadingCreateItem, setIsLoadingCreateItem] = useState(false);

  // Form submission handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Create a new FormData object to handle file uploads
    const formData = new FormData();

    formData.append('mail_template_id', data.mail_template_id);
    formData.append('user_id', data.user_id);
    formData.append('subject', data.subject);
    formData.append('recipient_email', data.recipient_email);
    formData.append('cc', data.cc);
    formData.append('bcc', data.bcc);
    formData.append('content_data', data.content_data);

    // Add files as attachments
    data.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    // Set loading state
    setIsLoadingCreateItem(true);

    // Send POST request and show toast notifications
    toast.promise(mainInstance.post(`/api/mails/logs`, formData), {
      loading: 'Loading...',
      success: () => {
        refetch();
        form.reset();
        setOpen(false);
        return 'Success!';
      },
      error: error => {
        // Display server error or fallback message
        return (
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        // Reset loading state regardless of outcome
        setIsLoadingCreateItem(false);
      },
    });
  };

  return (
    // Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="lg" autoFocus>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            {/* Dialog header */}
            <DialogHeader>
              <DialogTitle>Create Mail Log</DialogTitle>
            </DialogHeader>
            {/* Dialog body */}
            <DialogBody>
              <div className="grid grid-cols-12 items-start gap-3">
                <div className="col-span-6 grid grid-cols-12 gap-3">
                  <FormField
                    control={form.control}
                    name="mail_template_id"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Template ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient_email"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="me@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cc"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>CC</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='["he@example.com", "she@example.com]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bcc"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>BCC</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='["he@example.com", "she@example.com]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6 grid grid-cols-12 gap-3">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Onboarding" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_data"
                    render={({ field }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Content Data</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={`{\n  "name": "John Doe",\n  "avatar": "https://example.com/avatar.jpg"\n}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-12">
                        <FormLabel>Attachments</FormLabel>
                        <FormControl>
                          <MailAttachmentDropzone
                            files={field.value}
                            setFiles={field.onChange}
                            isMultiple={true}
                            isInvalid={fieldState.invalid}
                            onDrop={(
                              acceptedFiles: File[],
                              rejectedFiles: FileRejection[],
                            ) => {
                              field.onChange(acceptedFiles);
                              handleFileRejections(rejectedFiles);
                            }}
                            onRemove={(fileToRemove: File) => {
                              field.onChange(
                                field.value.filter(
                                  file => file !== fileToRemove,
                                ),
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </DialogBody>
            {/* Dialog footer */}
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={isLoadingCreateItem}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMailLog;
