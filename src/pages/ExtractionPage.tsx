import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  ChevronDown,
  ChevronRight,
  Upload,
  Shield,
  LayoutDashboard,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
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

interface WorkflowStep {
  id: number;
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'current' | 'pending';
}

const workflowSteps: WorkflowStep[] = [
  { id: 1, name: 'Upload', path: '/upload', icon: Upload, status: 'completed' },
  { id: 2, name: 'Extract', path: '/extract', icon: FileText, status: 'current' },
  { id: 3, name: 'Validate', path: '/validate', icon: Shield, status: 'pending' },
  { id: 4, name: 'Summary', path: '/summary', icon: CheckCircle, status: 'pending' },
];

const ExtractionPage = () => {
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [isExtracting, setIsExtracting] = useState(true);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    fields: true,
    summary: true
  });
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
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-400/30 bg-green-500/10';
      case 'missing':
        return 'border-red-400/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-500/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const toggleSection = (section: 'fields' | 'summary') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleContinue = () => {
    navigate('/validate');
  };

  const completeFields = extractedFields.filter(f => f.status === 'complete').length;
  const missingFields = extractedFields.filter(f => f.status === 'missing').length;
  const warningFields = extractedFields.filter(f => f.status === 'warning').length;
  const overallConfidence = Math.round(
    extractedFields.reduce((sum, field) => sum + (field.confidence || 0), 0) / extractedFields.length
  );

  if (isExtracting) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center max-w-md mx-auto"
        >
          <div className="animate-spin w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Extracting Data...
          </h3>
          <p className="text-white/60">
            Our AI is analyzing your document and identifying key fields
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 border-b border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Data Extraction Results
        </h1>
        <p className="text-white/70">
          AI has processed your document and extracted key deal parameters
        </p>
      </motion.div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Workflow Progress (20%) */}
        <div className="w-1/5 bg-slate-900 border-r border-white/10 flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Workflow Steps */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <LayoutDashboard className="h-5 w-5 text-teal-400" />
                <span>Workflow Progress</span>
              </h3>
              
              <div className="space-y-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-center space-x-3"
                    >
                      {/* Connection Line */}
                      {index < workflowSteps.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-8 bg-white/20"></div>
                      )}
                      
                      {/* Step Icon */}
                      <div className={`
                        relative z-10 p-2.5 rounded-lg border-2 transition-all duration-300
                        ${step.status === 'completed' 
                          ? 'bg-green-500 border-green-400 text-white' 
                          : step.status === 'current'
                          ? 'bg-blue-500 border-blue-400 text-white animate-pulse'
                          : 'bg-white/10 border-white/30 text-white/60'
                        }
                      `}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      
                      {/* Step Info */}
                      <div>
                        <div className="text-sm font-medium text-white/90">
                          Step {step.id}
                        </div>
                        <div className={`font-semibold ${
                          step.status === 'current' ? 'text-blue-300' : 'text-white/70'
                        }`}>
                          {step.name}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-teal-500/20 to-primary-500/20 rounded-xl border border-white/10 p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-teal-300" />
                <span className="text-sm font-medium text-white">Quick Stats</span>
              </div>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Docs Processed</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy Rate</span>
                  <span className="text-green-300 font-medium">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Processing</span>
                  <span className="text-white font-medium">12.3s</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Center Panel - Document Viewer (50-60%) */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <DocumentPreview 
            onHighlightHover={setHoveredField}
            hoveredField={hoveredField}
          />
        </div>

        {/* Right Panel - Extracted Fields & Summary (25-30%) */}
        <div className="w-80 bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 border-l border-white/10 flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Extracted Fields Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('fields')}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-teal-400" />
                  <h3 className="text-lg font-semibold text-white">Extracted Fields</h3>
                </div>
                {expandedSections.fields ? (
                  <ChevronDown className="h-5 w-5 text-white/70" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white/70" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.fields && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">
                      {extractedFields.map((field, index) => (
                        <motion.div
                          key={field.field}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onMouseEnter={() => setHoveredField(field.field)}
                          onMouseLeave={() => setHoveredField(null)}
                          className={`
                            p-3 rounded-xl border transition-all duration-200 cursor-pointer
                            ${getStatusColor(field.status)}
                            ${hoveredField === field.field ? 'ring-2 ring-teal-400/50 scale-[1.02]' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(field.status)}
                              <span className="font-medium text-white text-sm">
                                {field.field}
                              </span>
                            </div>
                            
                            {/* Circular Progress for Confidence */}
                            {field.confidence !== undefined && (
                              <div className="relative w-8 h-8">
                                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="12"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    className="text-white/20"
                                  />
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="12"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    className={getConfidenceColor(field.confidence)}
                                    strokeDasharray={`${(field.confidence / 100) * 75.4} 75.4`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className={`text-xs font-bold ${getConfidenceColor(field.confidence)}`}>
                                    {field.confidence}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-white/80 text-sm">
                            {field.value || <span className="text-red-300 italic">Missing</span>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Extraction Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('summary')}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-teal-400" />
                  <h3 className="text-lg font-semibold text-white">Extraction Summary</h3>
                </div>
                {expandedSections.summary ? (
                  <ChevronDown className="h-5 w-5 text-white/70" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white/70" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.summary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-4">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-white">{extractedFields.length}</div>
                          <div className="text-white/70 text-xs">Total Fields</div>
                        </div>
                        <div className="bg-green-500/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-300">{completeFields}</div>
                          <div className="text-white/70 text-xs">Extracted</div>
                        </div>
                        <div className="bg-red-500/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-red-300">{missingFields}</div>
                          <div className="text-white/70 text-xs">Missing</div>
                        </div>
                        <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-yellow-300">{warningFields}</div>
                          <div className="text-white/70 text-xs">Review</div>
                        </div>
                      </div>

                      {/* Overall Confidence Circle */}
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-3">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-white/20"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeLinecap="round"
                              className={getConfidenceColor(overallConfidence)}
                              initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                              animate={{ strokeDashoffset: 251.2 - (overallConfidence / 100) * 251.2 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              style={{ strokeDasharray: "251.2 251.2" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className={`text-xl font-bold ${getConfidenceColor(overallConfidence)}`}>
                                {overallConfidence}%
                              </div>
                              <div className="text-white/60 text-xs">Confidence</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Continue Button */}
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
      </div>
    </div>
  );
};

export default ExtractionPage;