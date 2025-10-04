import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, File, CheckCircle } from 'lucide-react';

const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleUpload(files);
  };

  const handleUpload = (files: File[] = []) => {
    setUploadedFiles(files);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleAnalyze = () => {
    // Check if multiple documents were uploaded
    if (uploadedFiles.length > 1) {
      navigate('/multi-doc-analysis');
    } else {
      navigate('/extract');
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Upload Deal Document
          </h1>
          <p className="text-xl text-white/70">
            Drag and drop your contract or legal document to begin risk analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
        >
          {!isUploaded ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                ${isDragging 
                  ? 'border-teal-400 bg-teal-400/10' 
                  : 'border-white/30 hover:border-white/50'
                }
              `}
            >
              <motion.div
                animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                className="space-y-6"
              >
                <div className={`
                  mx-auto w-16 h-16 rounded-full flex items-center justify-center
                  ${isDragging ? 'bg-teal-400' : 'bg-white/10'}
                `}>
                  <Upload className={`h-8 w-8 ${isDragging ? 'text-white' : 'text-white/70'}`} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your document'}
                  </h3>
                  <p className="text-white/60 mb-4">
                    Supports PDF, DOC, DOCX files up to 50MB. Upload multiple files for comparison analysis.
                  </p>
                  
                  <label
                    htmlFor="file-upload"
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-primary-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Choose File
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-32 h-2 bg-white/20 rounded-full mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-teal-400 to-primary-400 rounded-full"
                      />
                    </div>
                    <p className="text-white font-medium">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {uploadedFiles.length > 1 ? 'Documents' : 'Document'} Uploaded Successfully
                </h3>
                <div className="space-y-2">
                  {uploadedFiles.length > 0 ? (
                    uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-center space-x-3 text-white/70">
                        <File className="h-5 w-5" />
                        <span>{file.name}</span>
                        <span className="text-green-400">• {(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center space-x-3 text-white/70">
                      <File className="h-5 w-5" />
                      <span>deal-contract-2024.pdf</span>
                      <span className="text-green-400">• 2.4 MB</span>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-bold text-lg rounded-xl hover:from-teal-600 hover:to-primary-600 transition-all duration-200 shadow-lg"
              >
                {uploadedFiles.length > 1 ? 'Analyze Documents' : 'Analyze Document'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          {[
            { title: 'AI-Powered', desc: 'Advanced NLP extraction' },
            { title: 'Real-time', desc: 'Instant risk analysis' },
            { title: 'Multi-Doc', desc: 'Compare multiple documents' },
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
              <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
              <p className="text-sm text-white/60">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;