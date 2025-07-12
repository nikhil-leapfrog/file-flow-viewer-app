import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Tag, MessageSquare, Download } from 'lucide-react';

export interface InquiryResponse {
  email: string;
  category: string;
  response: string;
}

interface InquiryResultsProps {
  results: InquiryResponse[];
  onDownload?: () => void;
}

export const InquiryResults = ({ results, onDownload }: InquiryResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Property Info': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Pricing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Availability': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'General': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'Support': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[category as keyof typeof colors] || colors['General'];
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Processed Inquiries
            </CardTitle>
            <CardDescription>
              {results.length} inquiries processed successfully
            </CardDescription>
          </div>
          {onDownload && (
            <Button variant="outline" onClick={onDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Response
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((inquiry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {inquiry.email}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getCategoryColor(inquiry.category)}
                    >
                      {inquiry.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm leading-relaxed">
                      {inquiry.response}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};