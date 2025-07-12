import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { InquiryResults, InquiryResponse } from '@/components/InquiryResults';
import { inquiryApi } from '@/services/inquiryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, MessageSquare, AlertCircle, History, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inquiryResults, setInquiryResults] = useState<InquiryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setInquiryResults([]);

    try {
      const results = await inquiryApi.processBatch(file);
      setInquiryResults(results);
      
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${results.length} inquiries`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <Progress value={undefined} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Analyzing and categorizing inquiries with AI
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        <InquiryResults 
          results={inquiryResults} 
          onDownload={handleDownloadResults}
        />
      </div>
    </div>
  );
};

export default Index;