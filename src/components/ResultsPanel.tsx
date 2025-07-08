import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export interface ProcessingResult {
  fileName: string;
  fileSize: number;
  processingTime: number;
  linesProcessed: number;
  status: 'success' | 'warning' | 'error';
  metadata?: {
    encoding?: string;
    type?: string;
    checksum?: string;
  };
  summary?: string;
}

interface ResultsPanelProps {
  result: ProcessingResult | null;
}

export const ResultsPanel = ({ result }: ResultsPanelProps) => {
  if (!result) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Results</h3>
        <Card className="p-8 text-center bg-gradient-card shadow-card border">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Processing results will appear here after file processing is complete.
          </p>
        </Card>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (result.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-error" />;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Results</h3>
      
      <Card className="p-6 bg-gradient-card shadow-card border">
        <div className="space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <h4 className={`font-semibold ${getStatusColor()}`}>
                Processing {result.status === 'success' ? 'Completed' : result.status}
              </h4>
            </div>
            <Badge variant={result.status === 'success' ? 'default' : 'secondary'}>
              {result.status.toUpperCase()}
            </Badge>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">File Name</p>
              <p className="text-sm">{result.fileName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">File Size</p>
              <p className="text-sm">{formatFileSize(result.fileSize)}</p>
            </div>
          </div>

          {/* Processing Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Processing Time
              </p>
              <p className="text-sm">{result.processingTime.toFixed(2)}s</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Lines Processed</p>
              <p className="text-sm">{result.linesProcessed.toLocaleString()}</p>
            </div>
          </div>

          {/* Metadata */}
          {result.metadata && (
            <div className="space-y-3">
              <h5 className="font-medium">File Metadata</h5>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {result.metadata.type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{result.metadata.type}</span>
                  </div>
                )}
                {result.metadata.encoding && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Encoding:</span>
                    <span>{result.metadata.encoding}</span>
                  </div>
                )}
                {result.metadata.checksum && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Checksum:</span>
                    <span className="font-mono text-xs">{result.metadata.checksum}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {result.summary && (
            <div className="space-y-2">
              <h5 className="font-medium">Summary</h5>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};