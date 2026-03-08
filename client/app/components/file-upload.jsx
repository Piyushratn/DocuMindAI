'use client';
import * as React from 'react';
import { Upload } from 'lucide-react';

const FileUploadComponent = () => {
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [fileName, setFileName] = React.useState('');

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      setUploaded(false);
      setFileName(file.name);

      await fetch('http://localhost:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      setUploaded(true);
    } catch (error) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');

    el.addEventListener('change', async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) uploadFile(file);
      }
    });

    el.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        onClick={handleFileUploadButtonClick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`w-full text-center space-y-6 p-10 rounded-2xl 
          border-2 border-dashed transition-all duration-300 cursor-pointer
          ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10 scale-[1.02]'
              : 'border-white/20 bg-white/10 hover:bg-white/20'
          }
          backdrop-blur-xl shadow-xl`}
      >
        {/* Upload Icon */}
        <div className="flex justify-center">
          <div className="p-5 rounded-full bg-blue-600/20">
            <Upload className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-xl font-semibold text-white">
            Upload Your Document
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Drag & drop your PDF here or click to browse
          </p>
        </div>

        {/* Upload Button */}
        <button
          className="px-6 py-3 rounded-xl 
                     bg-blue-600 hover:bg-blue-700 
                     text-white font-medium 
                     shadow-lg transition"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Select PDF'}
        </button>

        {/* File Preview */}
        {fileName && (
          <p className="text-sm text-gray-300">
            📄 {fileName}
          </p>
        )}

        {/* Success */}
        {uploaded && (
          <p className="text-green-400 text-sm font-medium">
            ✅ File uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
