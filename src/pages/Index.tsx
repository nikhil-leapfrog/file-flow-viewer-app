import { useState, useCallback, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { InquiryResults, InquiryResponse } from '@/components/InquiryResults';
import { InquiryDetailModal } from '@/components/InquiryDetailModal';
import { inquiryApi, InquiryHistory } from '@/services/inquiryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, MessageSquare, AlertCircle, History, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inquiryResults, setInquiryResults] = useState<InquiryResponse[]>([]);
  const [historyResults, setHistoryResults] = useState<InquiryHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await inquiryApi.getHistory();
        setHistoryResults(history);
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };
    loadHistory();
  }, []);

  // Poll for progress updates
  useEffect(() => {
    if (!jobId || !isProcessing) return;

    const interval = setInterval(async () => {
      try {
        const progressData = await inquiryApi.getProgress(jobId);
        
        setProgress((progressData.progress / progressData.total) * 100);
        setInquiryResults(progressData.results);
        
        if (progressData.status === 'completed') {
          setIsProcessing(false);
          setJobId(null);
          
          // Refresh history when processing completes
          try {
            const history = await inquiryApi.getHistory();
            setHistoryResults(history);
          } catch (error) {
            console.error('Failed to refresh history:', error);
          }
          
          toast({
            title: "Processing Complete",
            description: `Successfully processed ${progressData.results.length} inquiries`,
          });
        } else if (progressData.status === 'error') {
          setIsProcessing(false);
          setJobId(null);
          setError(progressData.error || 'Processing failed');
          
          toast({
            title: "Processing Failed",
            description: progressData.error || 'Processing failed',
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error polling progress:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, isProcessing, toast]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setInquiryResults([]);
    setProgress(0);

    try {
      const response = await inquiryApi.processBatch(file);
      setJobId(response.jobId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsProcessing(false);
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDownloadResults = useCallback(() => {
    if (inquiryResults.length === 0) return;

    const csvContent = [
      ['Email', 'Category', 'Response'].join(','),
      ...inquiryResults.map(row => [
        `"${row.email}"`,
        `"${row.category}"`,
        `"${row.response.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiry-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [inquiryResults]);

  const handleInquiryClick = useCallback((inquiry: InquiryResponse) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Inquiry Processor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload CSV or JSON files with inquiries to get AI-powered classifications and responses
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiryResults.length}</div>
              <p className="text-xs text-muted-foreground">inquiries this session</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <Upload className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isProcessing ? 'Processing...' : 'Ready'}
              </div>
              <p className="text-xs text-muted-foreground">
                {isProcessing ? 'analyzing inquiries' : 'upload a file to start'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(inquiryResults.map(r => r.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">unique categories identified</p>
            </CardContent>
          </Card>
        </div>

        {/* File Upload Section */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Inquiry File
            </CardTitle>
            <CardDescription>
              Upload a CSV or JSON file containing inquiry data. Required fields: Inquiry ID, Listing ID, Inquirer Name, Inquirer Email, Message, Date, Phone Number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Progress Indicator */}
        {isProcessing && (
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing inquiries...</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Analyzing and categorizing inquiries with AI
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Results and History */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Current Processing
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6">
            <InquiryResults 
              results={inquiryResults} 
              onDownload={handleDownloadResults}
              onInquiryClick={handleInquiryClick}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Processing History
                </CardTitle>
                <CardDescription>
                  View previously processed inquiry files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No processing history available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyResults.map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-lg p-4 space-y-2 cursor-pointer hover:bg-muted/50" 
                           onClick={() => handleInquiryClick(inquiry)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {inquiry.category}
                            </span>
                            <span className="text-sm font-medium truncate max-w-xs">
                              {inquiry.email}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Inquiry Detail Modal */}
        <InquiryDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          inquiry={selectedInquiry}
        />
      </div>
    </div>
  );
};

export default Index;