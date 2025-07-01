import fallbackImage from '/images/no-image-available.jpg';

export const getFancyboxUrl = (
  baseUrl: string,
  filePath?: string,
  fallback: string = fallbackImage,
): string => {
  if (!filePath) return fallback;

  const fileExtension = filePath.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'doc':
    case 'docx':
    case 'ppt':
    case 'pptx':
    case 'xls':
    case 'xlsx':
    case 'pdf':
      // Return Google Docs Viewer URL for document types
      return `https://docs.google.com/gview?url=https://storage.connextglobal.com/megatool/uploaded_files/5f5885fa31fa6.pdf&embedded=true`;
    default:
      // Return image URL
      return `${baseUrl}/${filePath}`;
  }
};
