import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Mail, Tag, MessageSquare, Download } from 'lucide-react';
import { useState } from 'react';

export interface InquiryResponse {
  email: string;
  category: string;
  response: string;
  inquiryId?: string;
  listingId?: string;
  inquirerName?: string;
  phoneNumber?: string;
  date?: string;
  originalMessage?: string;
}

interface InquiryResultsProps {
  results: InquiryResponse[];
  onDownload?: () => void;
  onInquiryClick?: (inquiry: InquiryResponse) => void;
}

export const InquiryResults = ({ results, onDownload, onInquiryClick }: InquiryResultsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  if (results.length === 0) {
    return null;
  }
  
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

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
              {currentResults.map((inquiry, index) => (
                <TableRow 
                  key={index}
                  className={onInquiryClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                  onClick={() => onInquiryClick?.(inquiry)}
                >
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
                    <p className="text-sm leading-relaxed truncate">
                      {inquiry.response}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};