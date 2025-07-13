export interface InquiryResponse {
  email: string;
  category: string;
  response: string;
}

export interface InquiryHistory {
  id: string;
  filename: string;
  totalInquiries: number;
  processedAt: string;
}

export interface ProgressResponse {
  progress: number;
  total: number;
  status: 'processing' | 'completed' | 'error';
  results: InquiryResponse[];
  error?: string;
}

export class InquiryApiService {
  private baseUrl = '/api'; // Update with your actual API base URL

  async processBatch(file: File): Promise<{ jobId: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/inquiries/process/batch`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid file format or missing headers');
      }
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.jobId) {
      throw new Error('No job ID returned from the server');
    }

    return data;
  }

  async getProgress(jobId: string): Promise<ProgressResponse> {
    const response = await fetch(`/progress/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }

    return response.json();
  }

  async getHistory(): Promise<InquiryHistory[]> {
    const response = await fetch(`${this.baseUrl}/inquiries/history`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch inquiry history');
    }

    return response.json();
  }
}

export const inquiryApi = new InquiryApiService();