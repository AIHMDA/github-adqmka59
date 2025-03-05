import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Shield, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

// Type definitions
interface Document {
  id: string;
  type: string;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  file?: File;
  lastUpdated?: Date;
}

interface UploadDialogProps {
  documentType: string;
  onUpload: (file: File) => void;
  existingFile?: File;
}

// Upload Dialog Component
const UploadDialog: React.FC<UploadDialogProps> = ({ documentType, onUpload, existingFile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload {documentType}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 p-4">
        {existingFile && (
          <div className="mb-4 p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Current file: {existingFile.name}</p>
          </div>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
              {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
            </span>
          </label>
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

        <Button 
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {existingFile ? 'Replace Document' : 'Upload Document'}
        </Button>
      </div>
    </DialogContent>
  );
};

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'Government ID',
      status: 'not_submitted'
    },
    {
      id: '2',
      type: 'Security License',
      status: 'not_submitted'
    },
    {
      id: '3',
      type: 'Training Certificate',
      status: 'not_submitted'
    },
    {
      id: '4',
      type: 'Additional Certifications',
      status: 'not_submitted'
    }
  ]);

  const handleDocumentUpload = (documentType: string, file: File) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.type === documentType) {
        return {
          ...doc,
          status: 'pending',
          file: file,
          lastUpdated: new Date()
        };
      }
      return doc;
    }));
  };

  return (
    <div className="p-6 max-w-7xl bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Document Management</h2>
      
      {/* Required Documents */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Required Documents</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="font-medium">Government ID</span>
                <div className="text-sm text-gray-500">
                  National ID or passport required (Verification Required)
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </DialogTrigger>
              <UploadDialog 
                documentType="Government ID"
                onUpload={(file) => handleDocumentUpload("Government ID", file)}
                existingFile={documents.find(d => d.type === "Government ID")?.file}
              />
            </Dialog>
          </div>
        </div>
      </div>

      {/* Optional Documents */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Optional Documents & Certifications</h3>
        <div className="grid gap-4">
          {[
            { type: 'Security License', icon: Shield },
            { type: 'Training Certificate', icon: FileText },
            { type: 'Additional Certifications', icon: FileText }
          ].map(({ type, icon: Icon }) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Icon className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <span className="font-medium">{type}</span>
                  <div className="text-sm text-gray-500">
                    Optional verification
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <UploadDialog 
                  documentType={type}
                  onUpload={(file) => handleDocumentUpload(type, file)}
                  existingFile={documents.find(d => d.type === type)?.file}
                />
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Document Verification Status</h3>
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <span>{doc.type}</span>
                {doc.lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    Updated: {doc.lastUpdated.toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {doc.status === 'verified' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                )}
                {doc.status === 'pending' && (
                  <div className="flex items-center text-yellow-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending {doc.type === 'Government ID' ? '' : '(Optional)'}
                  </div>
                )}
                {doc.status === 'rejected' && (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Rejected
                  </div>
                )}
                {doc.status === 'not_submitted' && (
                  <div className="flex items-center text-gray-500">
                    <Plus className="w-4 h-4 mr-1" />
                    Not Submitted {doc.type === 'Government ID' ? '' : '(Optional)'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}