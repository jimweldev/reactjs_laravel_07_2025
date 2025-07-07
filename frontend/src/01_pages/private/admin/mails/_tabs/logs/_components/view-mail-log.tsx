import { toast } from 'sonner';
import { type MailLog } from '@/04_types/mail-log';
import { type MailLogAttachment } from '@/04_types/mail-log-attachment';
import FancyboxAttachmentViewer from '@/components/fancybox/fancybox-attachment-viewer';
import FancyboxViewer from '@/components/fancybox/fancybox-viewer';
import InputGroup from '@/components/forms/input-group';
import InputGroupText from '@/components/forms/input-group-text';
import IframePreview from '@/components/iframe/iframe-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useFancybox from '@/hooks/use-fancybox';
import { getDateTimezone } from '@/lib/get-date-timezone';
import { getImageUrl } from '@/lib/get-image-url';

// Define props for the mail log viewer component
type ViewMailLogProps = {
  selectedItem: MailLog | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

// Main component for viewing mail logs
const ViewMailLog = ({ selectedItem, open, setOpen }: ViewMailLogProps) => {
  const [fancyboxRef] = useFancybox();

  // Helper function to convert JSON CC/BCC arrays to comma-separated strings
  const getCommaSeparated = (cc: string) => {
    try {
      const ccArray = JSON.parse(cc || '[]');
      if (!Array.isArray(ccArray)) {
        throw new Error('Parsed value is not an array.');
      }
      return ccArray.join(', ');
    } catch (_error) {
      return '';
    }
  };

  // Function to populate email template with content data
  const populateTemplate = (data: MailLog | null | undefined): string => {
    if (!data || !data.mail_template || !data.content_data) {
      return '';
    }

    let content: Record<string, string>;
    try {
      content = JSON.parse(data.content_data);
    } catch (_error) {
      toast.error('Failed to parse content data');
      return '';
    }

    const template = data.mail_template.content || '';

    return template.replace(
      /{{\s*(\w+)\s*}}/g,
      (_match: string, key: string) => {
        return content[key] ?? '';
      },
    );
  };

  return (
    // Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="lg">
        {/* Dialog header */}
        <DialogHeader>
          <DialogTitle>View Mail Log</DialogTitle>
        </DialogHeader>

        {/* Dialog body */}
        <DialogBody>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2">
              <InputGroup className="col-span-12">
                <InputGroupText>Subject</InputGroupText>
                <Input
                  type="text"
                  inputSize="sm"
                  value={selectedItem?.subject || ''}
                  readOnly
                />
              </InputGroup>

              <InputGroup className="col-span-6">
                <InputGroupText>To</InputGroupText>
                <Input
                  type="text"
                  inputSize="sm"
                  value={selectedItem?.recipient_email || ''}
                  readOnly
                />
              </InputGroup>
              <InputGroup className="col-span-6">
                <InputGroupText>Date</InputGroupText>
                <Input
                  type="text"
                  inputSize="sm"
                  value={getDateTimezone(
                    selectedItem?.created_at || '',
                    'date_time',
                  )}
                  readOnly
                />
              </InputGroup>
              <InputGroup className="col-span-6">
                <InputGroupText>Cc</InputGroupText>
                <Input
                  type="text"
                  inputSize="sm"
                  value={getCommaSeparated(selectedItem?.cc || '') || '-'}
                  readOnly
                />
              </InputGroup>
              <InputGroup className="col-span-6">
                <InputGroupText>Bcc</InputGroupText>
                <Input
                  type="text"
                  inputSize="sm"
                  value={getCommaSeparated(selectedItem?.bcc || '') || '-'}
                  readOnly
                />
              </InputGroup>
            </div>

            {/* Preview of the email content */}
            <IframePreview htmlContent={populateTemplate(selectedItem)} />

            {/* Display attachments using Fancybox */}
            <div className="flex flex-wrap gap-2" ref={fancyboxRef}>
              {selectedItem?.mail_log_attachments?.map(
                (attachment: MailLogAttachment) => (
                  <FancyboxViewer
                    baseUrl={import.meta.env.VITE_STORAGE_BASE_URL}
                    filePath={attachment.file_path}
                    key={attachment.id}
                    data-fancybox={`${selectedItem.id}`}
                    data-caption={attachment.file_name}
                  >
                    <div className="w-25">
                      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded">
                        <FancyboxAttachmentViewer
                          className="min-h-full min-w-full object-cover"
                          src={getImageUrl(
                            `${import.meta.env.VITE_STORAGE_BASE_URL}/`,
                            attachment.file_path,
                          )}
                        />
                      </div>
                      <p className="truncate text-center text-sm">
                        {attachment.file_name}
                      </p>
                    </div>
                  </FancyboxViewer>
                ),
              )}
            </div>
          </div>
        </DialogBody>

        {/* Dialog footer */}
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMailLog;
