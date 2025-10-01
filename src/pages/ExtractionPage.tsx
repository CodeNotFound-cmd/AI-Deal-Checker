import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import DocumentPreview from '../components/DocumentPreview';

interface ExtractedField {
  field: string;
  value: string;
  status: 'complete' | 'missing' | 'warning';
  confidence?: number;
}

const mockExtractedData: ExtractedField[] = [
  { field: 'Counterparty', value: 'ABC Bank Ltd.', status: 'complete', confidence: 98 },
  { field: 'Notional Amount', value: '$100,000,000', status: 'complete', confidence: 95 },
  { field: 'Currency', value: 'USD', status: 'complete', confidence: 100 },
  { field: 'Trade Date', value: '2024-01-15', status: 'complete', confidence: 92 },
  { field: 'Maturity Date', value: '2025-01-15', status: 'complete', confidence: 94 },
  { field: 'Interest Rate', value: '', status: 'missing', confidence: 0 },
  { field: 'Collateral', value: 'Government Bonds', status: 'warning', confidence: 67 },
  { field: 'Settlement Date', value: '2024-01-17', status: 'complete', confidence: 89 },
];

const ExtractionPage = () => {
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [isExtracting, setIsExtracting] = useState(true);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate extraction process
    const timer = setTimeout(() => {
      setExtractedFields(mockExtractedData);
      setIsExtracting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'missing':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, confidence?: number) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'complete':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border border-green-400/30`}>
            ✓ {confidence}%
          </span>
        );
      case 'missing':
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-300 border border-red-400/30`}>
            Missing
          </span>
        );
      case 'warning':
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 border border-yellow-400/30`}>
            ⚠ {confidence}%
          </span>
        );
      default:
        return null;
    }
  };

  const handleContinue = () => {
    navigate('/validate');
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Data Extraction Results
          </h1>
          <p className="text-white/70">
            AI has processed your document and extracted key deal parameters
          </p>
        </motion.div>

        {isExtracting ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center"
          >
            <div className="animate-spin w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Extracting Data...
            </h3>
            <p className="text-white/60">
              Our AI is analyzing your document and identifying key fields
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Extracted Fields Table */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden ${
                  hoveredField ? 'ring-2 ring-teal-400/50' : ''
                }`}
              >
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-teal-400" />
                    <h2 className="text-xl font-semibold text-white">
                      Extracted Fields
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {extractedFields.map((field, index) => (
                    <motion.div
                      key={field.field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 hover:bg-white/5 transition-colors ${
                        hoveredField === field.field ? 'bg-white/10 border-l-4 border-teal-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            {getStatusIcon(field.status)}
                            <span className="font-medium text-white">
                              {field.field}
                            </span>
                          </div>
                          <div className="text-white/70 ml-8">
                            {field.value || 'No value detected'}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(field.status, field.confidence)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Document Preview */}
            <div className="lg:col-span-2">
              <DocumentPreview onHighlightHover={setHoveredField} />
            </div>

            {/* Summary Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Extraction Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Fields</span>
                    <span className="text-white font-semibold">8</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Successfully Extracted</span>
                    <span className="text-green-300 font-semibold">6</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Missing Fields</span>
                    <span className="text-red-300 font-semibold">1</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Needs Review</span>
                    <span className="text-yellow-300 font-semibold">1</span>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Overall Confidence</span>
                      <span className="text-white font-bold text-lg">92%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-teal-400 to-green-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-primary-600 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Continue to Validation</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractionPage;