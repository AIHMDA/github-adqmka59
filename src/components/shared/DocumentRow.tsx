import React from 'react';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentRowProps {
  title: string;
  description: string;
  required?: boolean;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ 
  title, 
  description, 
  required 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded mb-2">
      <div className="flex items-center">
        <FileText className="w-5 h-5 text-blue-600 mr-3" />
        <div>
          <span className="font-medium">{title}</span>
          <div className="text-sm text-gray-500">
            {description} {required && '(Required)'}
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </div>
  );
};