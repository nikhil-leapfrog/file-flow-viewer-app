import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileUpload, isProcessing }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['.csv', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return 'Please upload only CSV or JSON files.';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileUpload(file);
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
          "bg-gradient-card shadow-card transition-smooth",
          "hover:shadow-glow hover:border-primary",
          isDragOver && "border-primary shadow-glow bg-primary/5",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept=".csv,.json"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {isDragOver ? (
            <FileText className="mx-auto h-12 w-12 text-primary animate-pulse" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isDragOver ? 'Drop your file here' : 'Upload CSV or JSON file'}
            </h3>
            <p className="text-muted-foreground">
              {isProcessing 
                ? 'Processing inquiries...' 
                : 'Drag and drop your inquiries file here, or click to browse'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Supports .csv and .json files up to 5MB
            </p>
          </div>

          {!isProcessing && (
            <Button variant="outline" className="mt-4">
              Choose File
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};