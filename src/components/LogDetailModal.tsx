import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/components/LogViewer';
import { ProcessingResult } from '@/components/ResultsPanel';
import { cn } from '@/lib/utils';

interface LogDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogEntry | null;
  result: ProcessingResult | null;
}

export const LogDetailModal = ({ open, onOpenChange, log, result }: LogDetailModalProps) => {
  if (!log) return null;

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      default:
        return 'text-processing';
    }
  };

  const getLevelBadgeVariant = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Log Entry Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Badge variant={getLevelBadgeVariant(log.level)}>
                {log.level.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">{log.timestamp}</span>
            </div>
            
            <div className={cn("text-lg font-medium", getLevelColor(log.level))}>
              {log.message}
            </div>
          </div>

          {/* Processing Result (if available) */}
          {result && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Processing Result</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File Name:</span>
                  <p className="font-medium">{result.fileName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="font-medium">{(result.fileSize / 1024).toFixed(2)} KB</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Time:</span>
                  <p className="font-medium">{result.processingTime.toFixed(2)}s</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lines Processed:</span>
                  <p className="font-medium">{result.linesProcessed.toLocaleString()}</p>
                </div>
              </div>
              
              {result.summary && (
                <div className="mt-4">
                  <span className="text-muted-foreground">Summary:</span>
                  <p className="mt-1">{result.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};