"use client";
import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentType: string;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType
}) => {
  if (!isOpen) return null;

  const isImage = documentType === 'brand_image' || 
                  documentUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = documentUrl.match(/\.pdf$/i);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(documentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              {isImage ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                {documentName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 capitalize truncate">
                {documentType.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Open in New Tab Button */}
            <button
              onClick={handleOpenInNewTab}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4 flex-1 overflow-auto min-h-0">
          {isImage ? (
            <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px]">
              <img
                src={documentUrl}
                alt={documentName}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
                style={{ maxHeight: 'calc(95vh - 200px)' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'text-center p-4 sm:p-8 text-slate-500 dark:text-slate-400';
                  errorDiv.innerHTML = `
                    <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-base sm:text-lg font-medium">Failed to load image</p>
                    <p class="text-sm">The image could not be displayed</p>
                  `;
                  target.parentNode?.appendChild(errorDiv);
                }}
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-full min-h-[200px] sm:min-h-[300px]">
              <iframe
                src={documentUrl}
                className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700"
                title={documentName}
                style={{ minHeight: '200px' }}
                onError={() => {
                  const iframe = document.querySelector('iframe');
                  if (iframe) {
                    iframe.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'flex items-center justify-center h-full text-center p-4 sm:p-8 text-slate-500 dark:text-slate-400';
                    errorDiv.innerHTML = `
                      <div>
                        <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </div>
                        <p class="text-base sm:text-lg font-medium">PDF Preview Not Available</p>
                        <p class="text-sm">Click "Open in new tab" to view the PDF</p>
                      </div>
                    `;
                    iframe.parentNode?.appendChild(errorDiv);
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px] text-center p-4 sm:p-8 text-slate-500 dark:text-slate-400">
              <div>
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p className="text-base sm:text-lg font-medium">Document Preview Not Available</p>
                <p className="text-sm">Click "Open in new tab" to view the document</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl sm:rounded-b-2xl flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 min-w-0">
              <span className="font-medium">Document URL:</span>
              <span className="ml-2 font-mono text-xs break-all">{documentUrl}</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open in New Tab</span>
                <span className="sm:hidden">Open</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
