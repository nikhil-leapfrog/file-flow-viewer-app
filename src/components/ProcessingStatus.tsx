import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

interface ProcessingStatusProps {
  state: ProcessingState;
  progress: number;
  fileName?: string;
  error?: string;
}

export const ProcessingStatus = ({ state, progress, fileName, error }: ProcessingStatusProps) => {
  const getStatusIcon = () => {
    switch (state) {
      case 'processing':
        return <Loader2 className="h-5 w-5 text-processing animate-spin" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'processing':
        return `Processing ${fileName}...`;
      case 'success':
        return `Successfully processed ${fileName}`;
      case 'error':
        return `Error processing ${fileName}`;
      default:
        return 'Ready to process files';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'processing':
        return 'text-processing';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  if (state === 'idle') return null;

  return (
    <div className="space-y-4 p-6 bg-gradient-card rounded-lg shadow-card border">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <p className={cn("font-medium", getStatusColor())}>
            {getStatusText()}
          </p>
          {error && (
            <p className="text-sm text-error mt-1">{error}</p>
          )}
        </div>
      </div>
      
      {state === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-processing font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};