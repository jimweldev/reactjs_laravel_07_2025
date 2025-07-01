import { useState } from 'react';
import { type FileRejection } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { mainInstance } from '@/07_instances/main-instance';
import FileDropzone from '@/components/file-dropzones/file-dropzone';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { generateExcel } from '@/lib/generate-excel';
import { handleFileRejections } from '@/lib/handle-file-rejections';
import { verifyExcelHeaders } from '@/lib/verify-excel-headers';

const templateHeaders = [
  'Email',
  'First Name',
  'Middle Name',
  'Last Name',
  'Suffix',
];

// Define props for the this component
type ImportUsersProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const ImportUsers = ({ open, setOpen, refetch }: ImportUsersProps) => {
  // Initialize form with default values and schema resolver
  const form = useForm();

  // File state
  const [file, setFile] = useState<File | null>(null);

  // Loading state while importing the items
  const [isLoadingImportItems, setIsLoadingImportItems] = useState(false);

  // Form submission handler
  const onSubmit = () => {
    // Check if a file is selected
    if (!file) {
      toast.error('Please select a file to import.');
      return;
    }

    // Read the selected file
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const worksheetData = XLSX.utils.sheet_to_json(worksheet);

      // Verify the file headers
      if (!verifyExcelHeaders(worksheetData, templateHeaders)) {
        toast.error('The file headers do not match the required template.');
        return;
      }

      // Prepare the payload
      const payload = {
        data: worksheetData,
      };

      // Set loading state
      setIsLoadingImportItems(true);

      // Send POST request and show toast notifications
      toast.promise(mainInstance.post(`/api/users/import`, payload), {
        loading: 'Loading...',
        success: () => {
          setFile(null);
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
          setIsLoadingImportItems(false);
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    // Dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Dialog header */}
            <DialogHeader>
              <DialogTitle>Import Users</DialogTitle>
            </DialogHeader>

            {/* Dialog body */}
            <DialogBody>
              <FormItem>
                <FormLabel>File</FormLabel>
                <FileDropzone
                  files={file}
                  accept={{
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      [],
                  }}
                  onDrop={(
                    acceptedFiles: File[],
                    rejectedFiles: FileRejection[],
                  ) => {
                    setFile(acceptedFiles[0]);
                    handleFileRejections(rejectedFiles);
                  }}
                  onRemove={() => setFile(null)}
                />

                <div className="flex justify-end">
                  <Button
                    className="px-0"
                    variant="link"
                    size="sm"
                    type="button"
                    onClick={() => {
                      generateExcel(templateHeaders, 'Import Users Template');
                    }}
                  >
                    Download Template
                  </Button>
                </div>
              </FormItem>
            </DialogBody>

            {/* Dialog footer */}
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={isLoadingImportItems}>
                Import
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsers;
