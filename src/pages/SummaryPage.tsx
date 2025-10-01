import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  User, 
  FileText,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import ExportOptions from '../components/ExportOptions';
import ComparisonMode from '../components/ComparisonMode';

const SummaryPage = () => {
  const [showComparison, setShowComparison] = React.useState(false);
  
  const handleApprove = () => {
    alert('Deal approved and saved to system!');
  };

  const handleReview = () => {
    alert('Flagged for human review');
  };

  const handleDownload = () => {
    alert('Downloading PDF report...');
  };

  if (showComparison) {
    return <ComparisonMode />;
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Analysis Summary
          </h1>
          <p className="text-white/70">
            Complete risk assessment and AI-generated insights for your deal
          </p>
          
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setShowComparison(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !showComparison 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Summary View
            </button>
            <button
              onClick={() => setShowComparison(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showComparison 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Document Comparison
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: TrendingUp,
              label: 'Risk Score',
              value: '73/100',
              status: 'High Risk',
              color: 'text-red-400'
            },
            {
              icon: DollarSign,
              label: 'Notional',
              value: '$100M',
              status: 'USD',
              color: 'text-green-400'
            },
            {
              icon: Clock,
              label: 'Maturity',
              value: '1 Year',
              status: 'Jan 2025',
              color: 'text-teal-400'
            },
            {
              icon: FileText,
              label: 'Extraction',
              value: '92%',
              status: 'Complete',
              color: 'text-green-400'
            }
          ].map((metric, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <span className="text-white/70 text-sm font-medium">{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-white/60 text-sm">
                {metric.status}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-primary-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span>AI Analysis Summary</span>
              </h2>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 mb-4">
                  Based on the comprehensive analysis of the deal document, our AI has identified several key areas 
                  that require attention before proceeding with this transaction.
                </p>

                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-4">
                  <h3 className="text-red-300 font-semibold mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Critical Issues Identified</span>
                  </h3>
                  <ul className="text-white/70 space-y-1 text-sm">
                    <li>• Missing interest rate specification could lead to disputes</li>
                    <li>• Counterparty verification incomplete - requires manual review</li>
                    <li>• Settlement terms may not align with standard market practices</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4 mb-4">
                  <h3 className="text-yellow-300 font-semibold mb-2">Recommendations</h3>
                  <ul className="text-white/70 space-y-1 text-sm">
                    <li>• Obtain interest rate confirmation from counterparty</li>
                    <li>• Verify counterparty against updated sanctions databases</li>
                    <li>• Consider adding additional collateral requirements</li>
                    <li>• Review settlement date alignment with market holidays</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Positive Indicators</span>
                  </h3>
                  <ul className="text-white/70 space-y-1 text-sm">
                    <li>• Standard notional amount within acceptable range</li>
                    <li>• Proper currency denomination and format</li>
                    <li>• Date consistency across all fields</li>
                    <li>• Government bond collateral adds security</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Decision Required
              </h3>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApprove}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Approve & Save</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReview}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>Request Human Review</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExportOptions />
            </motion.div>

            {/* Risk Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Risk Breakdown
              </h3>
              
              <div className="space-y-3">
                {[
                  { category: 'Credit Risk', score: 65, color: 'text-yellow-400' },
                  { category: 'Market Risk', score: 45, color: 'text-green-400' },
                  { category: 'Operational Risk', score: 80, color: 'text-red-400' },
                  { category: 'Compliance Risk', score: 75, color: 'text-red-400' },
                ].map((risk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">{risk.category}</span>
                      <span className={`font-semibold ${risk.color}`}>{risk.score}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.score}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          risk.score <= 30 
                            ? 'bg-green-400' 
                            : risk.score <= 60 
                            ? 'bg-yellow-400' 
                            : 'bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Document Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Document Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">File Name</span>
                  <span className="text-white">deal-contract-2024.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">File Size</span>
                  <span className="text-white">2.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Processed</span>
                  <span className="text-white">Jan 15, 2024 14:32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Analysis Time</span>
                  <span className="text-white">12.3 seconds</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;