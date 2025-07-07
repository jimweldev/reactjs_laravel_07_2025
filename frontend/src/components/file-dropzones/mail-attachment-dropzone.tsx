import { CloudUploadIcon, Paperclip, Trash2 } from 'lucide-react';
import Dropzone from 'react-dropzone';
import { cn } from '@/lib/utils';
import InputGroup from '../forms/input-group';
import InputGroupText from '../forms/input-group-text';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface MailAttachmentDropzoneProps
  extends React.ComponentPropsWithoutRef<typeof Dropzone> {
  files?: File[] | null;
  isMultiple?: boolean;
  isInvalid?: boolean;
  onRemove?: (file: File) => void;
  setFiles: (files: File[]) => void;
}

const MailAttachmentDropzone = ({
  files = [],
  isMultiple = false,
  isInvalid = false,
  onRemove,
  setFiles,
  ...props
}: MailAttachmentDropzoneProps) => {
  const handleRename = (index: number, newName: string) => {
    if (!files || !files[index]) return;

    const oldFile = files[index];
    const newFile = new File([oldFile], newName, {
      type: oldFile.type,
      lastModified: oldFile.lastModified,
    });

    const updatedFiles = [...files];
    updatedFiles[index] = newFile;
    setFiles(updatedFiles);
  };

  return (
    <Dropzone
      multiple={isMultiple}
      onDrop={acceptedFiles =>
        setFiles(
          isMultiple ? [...(files || []), ...acceptedFiles] : acceptedFiles,
        )
      }
      {...props}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div>
          <div
            className={cn(
              'hover:bg-muted flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center',
              isDragActive
                ? 'border-primary text-primary'
                : 'text-muted-foreground border-muted-foreground',
              isInvalid ? 'border-destructive text-destructive' : '',
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon size={40} />
            <p>
              {isDragActive ? (
                <span>Drop the file{isMultiple ? 's' : ''} here...</span>
              ) : (
                <span>
                  Drag and drop file{isMultiple ? 's' : ''} here, or click to
                  select file{isMultiple ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {files && files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, index) => {
                const fullName = file.name;
                const lastDotIndex = fullName.lastIndexOf('.');
                const nameWithoutExt =
                  lastDotIndex !== -1
                    ? fullName.slice(0, lastDotIndex)
                    : fullName;
                const extension =
                  lastDotIndex !== -1 ? fullName.slice(lastDotIndex + 1) : '';

                return (
                  <InputGroup key={index}>
                    <InputGroupText className="bg-muted">
                      <Paperclip className="size-3" />
                    </InputGroupText>
                    <Input
                      inputSize="sm"
                      value={nameWithoutExt}
                      onChange={e =>
                        handleRename(
                          index,
                          extension
                            ? `${e.target.value}.${extension}`
                            : e.target.value,
                        )
                      }
                    />
                    <Input
                      inputSize="sm"
                      className="max-w-15"
                      value={extension}
                      readOnly
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove?.(file)}
                    >
                      <Trash2 />
                    </Button>
                  </InputGroup>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default MailAttachmentDropzone;
