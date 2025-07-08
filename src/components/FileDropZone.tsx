import { useCallback, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileDropZone = ({ onFileSelect, isProcessing }: FileDropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

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
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer",
        "bg-gradient-card shadow-card transition-smooth",
        "hover:shadow-glow hover:border-primary",
        isDragOver && "border-primary shadow-glow bg-primary/5",
        isProcessing && "pointer-events-none opacity-50"
      )}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        disabled={isProcessing}
      />
      
      <div className="space-y-4">
        {isDragOver ? (
          <File className="mx-auto h-12 w-12 text-primary animate-pulse" />
        ) : (
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {isDragOver ? 'Drop your file here' : 'Drop files to process'}
          </h3>
          <p className="text-muted-foreground">
            {isProcessing 
              ? 'Processing file...' 
              : 'Drag and drop your file here, or click to browse'
            }
          </p>
        </div>
      </div>
    </div>
  );
};