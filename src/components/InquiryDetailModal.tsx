import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InquiryResponse } from '@/components/InquiryResults';
import { Mail, Phone, Calendar, MessageSquare, Tag, User, Hash, Building } from 'lucide-react';

interface InquiryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: InquiryResponse | null;
}

export const InquiryDetailModal = ({ open, onOpenChange, inquiry }: InquiryDetailModalProps) => {
  if (!inquiry) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Inquiry Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                  </div>
                </div>
                
                {inquiry.inquirerName && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">{inquiry.inquirerName}</p>
                    </div>
                  </div>
                )}
                
                {inquiry.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{inquiry.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {inquiry.date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{inquiry.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Inquiry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiry.inquiryId && (
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Inquiry ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{inquiry.inquiryId}</p>
                    </div>
                  </div>
                )}
                
                {inquiry.listingId && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Listing ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{inquiry.listingId}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <Badge 
                    variant="secondary"
                    className={getCategoryColor(inquiry.category)}
                  >
                    {inquiry.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Message */}
          {inquiry.originalMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Original Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {inquiry.originalMessage}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Response */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI-Generated Response
              </CardTitle>
              <CardDescription>
                This response was automatically generated based on the inquiry content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-subtle rounded-lg p-4 border">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {inquiry.response}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};