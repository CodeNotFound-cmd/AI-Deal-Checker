import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Brain, FileText, AlertTriangle } from 'lucide-react';

interface ExplanationData {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  regulation: string;
  documentSnippet: string;
  recommendation: string;
}

interface AIExplanationProps {
  explanationData: ExplanationData;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const AIExplanation: React.FC<AIExplanationProps> = ({ 
  explanationData, 
  isExpanded = false, 
  onToggle 
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      case 'low':
        return 'text-blue-400 bg-blue-500/10 border-blue-400/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-2">
      <motion.button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Brain className="h-4 w-4 text-teal-400" />
        <span className="text-white">AI Explanation</span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-white/70" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white/70" />
        )}
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl border ${getSeverityColor(explanationData.severity)} space-y-4`}>
              {/* Main Explanation */}
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Why This Was Flagged</span>
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {explanationData.explanation}
                </p>
              </div>

              {/* Regulatory Reference */}
              <div className="bg-white/5 rounded-lg p-3">
                <h5 className="text-white/90 font-medium mb-1 text-sm">Regulatory Reference</h5>
                <p className="text-white/70 text-sm">
                  {explanationData.regulation}
                </p>
              </div>

              {/* Document Snippet */}
              <div className="bg-white/5 rounded-lg p-3">
                <h5 className="text-white/90 font-medium mb-2 text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Relevant Document Text</span>
                </h5>
                <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                  <p className="text-white/80">
                    {explanationData.documentSnippet}
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-teal-500/10 border border-teal-400/30 rounded-lg p-3">
                <h5 className="text-teal-300 font-medium mb-1 text-sm">Recommended Action</h5>
                <p className="text-white/80 text-sm">
                  {explanationData.recommendation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIExplanation;