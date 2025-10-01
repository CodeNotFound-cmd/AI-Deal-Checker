import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Upload } from 'lucide-react';

interface ComparisonField {
  field: string;
  doc1Value: string;
  doc2Value: string;
  status: 'match' | 'mismatch' | 'missing';
}

const mockComparison: ComparisonField[] = [
  {
    field: 'Counterparty',
    doc1Value: 'ABC Bank Ltd.',
    doc2Value: 'ABC Bank Ltd.',
    status: 'match'
  },
  {
    field: 'Notional Amount',
    doc1Value: '$100,000,000',
    doc2Value: '$100,000,000',
    status: 'match'
  },
  {
    field: 'Trade Date',
    doc1Value: '2024-01-15',
    doc2Value: '2024-01-15',
    status: 'match'
  },
  {
    field: 'Interest Rate',
    doc1Value: '5.25%',
    doc2Value: '5.50%',
    status: 'mismatch'
  },
  {
    field: 'Settlement Date',
    doc1Value: '2024-01-17',
    doc2Value: '',
    status: 'missing'
  },
  {
    field: 'Maturity Date',
    doc1Value: '2025-01-15',
    doc2Value: '2025-01-20',
    status: 'mismatch'
  }
];

const ComparisonMode = () => {
  const [doc1Uploaded, setDoc1Uploaded] = useState(true);
  const [doc2Uploaded, setDoc2Uploaded] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'mismatch':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'match':
        return 'bg-green-500/10 border-green-400/30';
      case 'mismatch':
        return 'bg-red-500/10 border-red-400/30';
      case 'missing':
        return 'bg-yellow-500/10 border-yellow-400/30';
      default:
        return '';
    }
  };

  const matchCount = mockComparison.filter(item => item.status === 'match').length;
  const mismatchCount = mockComparison.filter(item => item.status === 'mismatch').length;
  const missingCount = mockComparison.filter(item => item.status === 'missing').length;

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Document Comparison
          </h1>
          <p className="text-white/70">
            Compare two documents side-by-side to identify discrepancies
          </p>
        </motion.div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-teal-400" />
              <span>Term Sheet</span>
            </h3>
            
            {doc1Uploaded ? (
              <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">term-sheet-2024.pdf</span>
                <span className="text-green-400 text-sm">• 1.8 MB</span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                <p className="text-white/70">Drop term sheet here</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary-400" />
              <span>Confirmation</span>
            </h3>
            
            {doc2Uploaded ? (
              <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white">confirmation-2024.pdf</span>
                <span className="text-green-400 text-sm">• 2.1 MB</span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                <p className="text-white/70">Drop confirmation here</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Comparison Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Comparison Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Fields</span>
                <span className="text-white font-semibold">{mockComparison.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-green-300">Matches</span>
                <span className="text-green-300 font-semibold">{matchCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-red-300">Mismatches</span>
                <span className="text-red-300 font-semibold">{mismatchCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-yellow-300">Missing</span>
                <span className="text-yellow-300 font-semibold">{missingCount}</span>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Match Rate</span>
                  <span className="text-white font-bold text-lg">
                    {Math.round((matchCount / mockComparison.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full" 
                    style={{ width: `${(matchCount / mockComparison.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">
                  Field-by-Field Comparison
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-white font-medium">Field</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Term Sheet</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Confirmation</th>
                      <th className="px-6 py-3 text-left text-white font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {mockComparison.map((item, index) => (
                      <motion.tr
                        key={item.field}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className={`hover:bg-white/5 transition-colors ${getStatusColor(item.status)}`}
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {item.field}
                        </td>
                        <td className="px-6 py-4 text-white/80">
                          {item.doc1Value || '-'}
                        </td>
                        <td className="px-6 py-4 text-white/80">
                          {item.doc2Value || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <span className={`text-sm font-medium ${
                              item.status === 'match' 
                                ? 'text-green-300' 
                                : item.status === 'mismatch'
                                ? 'text-red-300'
                                : 'text-yellow-300'
                            }`}>
                              {item.status === 'match' ? 'Match' : 
                               item.status === 'mismatch' ? 'Mismatch' : 'Missing'}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMode;