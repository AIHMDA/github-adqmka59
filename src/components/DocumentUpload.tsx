import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentUploadProps {
  title: string;
  description: string;
  required?: boolean;
  onUpload: (file: File) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  description,
  required,
  onUpload
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      alert(`${title} uploaded successfully!`);
      setIsOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

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
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload {title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center justify-center"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Choose a file or drag it here
                    </span>
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 rounded border"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};