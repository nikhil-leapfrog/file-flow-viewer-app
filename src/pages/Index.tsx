import { useState, useCallback } from 'react';
import { FileDropZone } from '@/components/FileDropZone';
import { ProcessingStatus, ProcessingState } from '@/components/ProcessingStatus';
import { LogViewer, LogEntry } from '@/components/LogViewer';
import { ResultsPanel, ProcessingResult } from '@/components/ResultsPanel';
import { LogDetailModal } from '@/components/LogDetailModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const { toast } = useToast();

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const simulateProcessing = useCallback(async (file: File) => {
    const startTime = Date.now();
    setProcessingState('processing');
    setProgress(0);
    setResult(null);

    try {
      addLog('info', `Starting to process file: ${file.name}`);
      addLog('info', `File size: ${(file.size / 1024).toFixed(2)} KB`);
      
      // Simulate reading file
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(20);
      addLog('info', 'Reading file contents...');

      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 700));
      setProgress(40);
      addLog('success', 'File validation completed');

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60);
      addLog('info', 'Processing file data...');

      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(80);
      addLog('info', 'Analyzing content structure...');

      // Generate random processing metrics
      const linesProcessed = Math.floor(Math.random() * 10000) + 1000;
      const hasWarnings = Math.random() > 0.7;
      
      if (hasWarnings) {
        addLog('warning', 'Found some non-critical issues in the data');
      }

      // Complete processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);
      addLog('success', `Processing completed successfully`);
      addLog('info', `Processed ${linesProcessed.toLocaleString()} lines`);

      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;

      // Generate result
      const processingResult: ProcessingResult = {
        fileName: file.name,
        fileSize: file.size,
        processingTime,
        linesProcessed,
        status: hasWarnings ? 'warning' : 'success',
        metadata: {
          type: file.type || 'unknown',
          encoding: 'UTF-8',
          checksum: Math.random().toString(36).substr(2, 16).toUpperCase()
        },
        summary: hasWarnings 
          ? `File processed successfully with ${Math.floor(Math.random() * 5) + 1} warnings. All critical data has been validated.`
          : 'File processed successfully without any issues. All data validated and ready for use.'
      };

      setResult(processingResult);
      setProcessingState('success');
      
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${file.name}`,
      });

    } catch (error) {
      addLog('error', `Processing failed: ${error}`);
      setProcessingState('error');
      
      toast({
        title: "Processing Failed",
        description: "An error occurred while processing the file",
        variant: "destructive",
      });
    }
  }, [addLog, toast]);

  const handleFileSelect = useCallback((file: File) => {
    setCurrentFile(file);
    setLogs([]);
    setIsDropModalOpen(false);
    simulateProcessing(file);
  }, [simulateProcessing]);

  const handleLogClick = useCallback((log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            File Processor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drop your files here to process them and view detailed logs and results in real-time
          </p>
        </div>

        {/* Upload Button */}
        <div className="text-center">
          <Dialog open={isDropModalOpen} onOpenChange={setIsDropModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-14 px-8">
                <Upload className="mr-2 h-5 w-5" />
                Upload File to Process
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload File for Processing</DialogTitle>
              </DialogHeader>
              <FileDropZone 
                onFileSelect={handleFileSelect}
                isProcessing={processingState === 'processing'}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Processing Status */}
        {processingState !== 'idle' && (
          <ProcessingStatus
            state={processingState}
            progress={progress}
            fileName={currentFile?.name}
          />
        )}

        {/* Logs Table */}
        {logs.length > 0 && (
          <LogViewer 
            logs={logs}
            isActive={processingState === 'processing'}
            onLogClick={handleLogClick}
          />
        )}

        {/* Results Section */}
        <ResultsPanel result={result} />

        {/* Log Detail Modal */}
        <LogDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          log={selectedLog}
          result={result}
        />
      </div>
    </div>
  );
};

export default Index;
