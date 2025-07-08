import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  isActive: boolean;
}

export const LogViewer = ({ logs, isActive }: LogViewerProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Processing Logs</h3>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-processing animate-pulse" : "bg-muted"
          )} />
          <span className="text-sm text-muted-foreground">
            {isActive ? 'Live' : 'Idle'}
          </span>
        </div>
      </div>

      <div className="bg-gradient-card rounded-lg border shadow-card">
        <ScrollArea ref={scrollAreaRef} className="h-80 p-4">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No logs yet. Drop a file to start processing.</p>
            </div>
          ) : (
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 py-1">
                  <span className="text-muted-foreground text-xs mt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <Badge variant={getLevelBadgeVariant(log.level)} className="text-xs">
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className={cn("flex-1", getLevelColor(log.level))}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};