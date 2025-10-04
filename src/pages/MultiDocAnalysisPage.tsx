import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Files, TrendingUp, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';

interface DocumentField {
  field: string;
  doc1: string;
  doc2: string;
  doc3: string;
  status: 'consistent' | 'missing' | 'mismatch';
}

interface CompanyFrequency {
  name: string;
  frequency: number;
  totalDocs: number;
}

const mockDocumentData: DocumentField[] = [
  {
    field: 'Company Name',
    doc1: 'ABC Bank Ltd.',
    doc2: 'ABC Bank Ltd.',
    doc3: 'ABC Bank Ltd.',
    status: 'consistent'
  },
  {
    field: 'Notional Amount',
    doc1: '$100,000,000',
    doc2: '$150,000,000',
    doc3: '$100,000,000',
    status: 'mismatch'
  },
  {
    field: 'Interest Rate',
    doc1: '5.25%',
    doc2: '',
    doc3: '5.50%',
    status: 'missing'
  },
  {
    field: 'Trade Date',
    doc1: '2024-01-15',
    doc2: '2024-01-15',
    doc3: '2024-01-15',
    status: 'consistent'
  },
  {
    field: 'Maturity Date',
    doc1: '2025-01-15',
    doc2: '2025-06-15',
    doc3: '2025-01-15',
    status: 'mismatch'
  },
  {
    field: 'Currency',
    doc1: 'USD',
    doc2: 'USD',
    doc3: 'EUR',
    status: 'mismatch'
  },
  {
    field: 'Settlement Date',
    doc1: '2024-01-17',
    doc2: '2024-01-17',
    doc3: '',
    status: 'missing'
  }
];

const mockCompanyData: CompanyFrequency[] = [
  { name: 'ABC Bank Ltd.', frequency: 5, totalDocs: 5 },
  { name: 'Global Finance Corp', frequency: 3, totalDocs: 5 },
  { name: 'International Bank', frequency: 2, totalDocs: 5 },
  { name: 'XYZ Corporation', frequency: 4, totalDocs: 5 },
  { name: 'Deutsche Finance', frequency: 1, totalDocs: 5 },
  { name: 'JP Morgan Chase', frequency: 3, totalDocs: 5 },
  { name: 'Goldman Sachs', frequency: 2, totalDocs: 5 },
  { name: 'Morgan Stanley', frequency: 1, totalDocs: 5 }
];

const MultiDocAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState<'extract' | 'heatmap'>('extract');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'consistent':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'mismatch':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusChip = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium border";
    switch (status) {
      case 'consistent':
        return <span className={`${baseClasses} bg-green-500/20 text-green-300 border-green-400/30`}>✅ Consistent</span>;
      case 'missing':
        return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`}>⚠️ Missing</span>;
      case 'mismatch':
        return <span className={`${baseClasses} bg-red-500/20 text-red-300 border-red-400/30`}>🚨 Mismatch</span>;
      default:
        return null;
    }
  };

  const getCompanyBoxSize = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq;
    if (ratio >= 0.8) return 'w-32 h-32';
    if (ratio >= 0.6) return 'w-28 h-28';
    if (ratio >= 0.4) return 'w-24 h-24';
    return 'w-20 h-20';
  };

  const getCompanyColor = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq;
    if (ratio >= 0.8) return 'bg-blue-600';
    if (ratio >= 0.6) return 'bg-blue-500';
    if (ratio >= 0.4) return 'bg-blue-400';
    return 'bg-blue-300';
  };

  const maxFrequency = Math.max(...mockCompanyData.map(c => c.frequency));
  const consistentCount = mockDocumentData.filter(d => d.status === 'consistent').length;
  const missingCount = mockDocumentData.filter(d => d.status === 'missing').length;
  const mismatchCount = mockDocumentData.filter(d => d.status === 'mismatch').length;
  const totalDocs = 3;
  const uniqueCompanies = mockCompanyData.length;
  const mostFrequentCompany = mockCompanyData.reduce((prev, current) => 
    prev.frequency > current.frequency ? prev : current
  );

  return (
    <div className="h-full flex">
      {/* Center Panel - Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Multi-Document Analysis
            </h1>
            <p className="text-white/70">
              Compare and analyze multiple documents for consistency and patterns
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 w-fit"
          >
            <button
              onClick={() => setActiveTab('extract')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'extract'
                  ? 'bg-gradient-to-r from-teal-500 to-primary-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Files className="h-5 w-5" />
              <span>Multi Extract</span>
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'heatmap'
                  ? 'bg-gradient-to-r from-teal-500 to-primary-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Company Heatmap</span>
            </button>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'extract' && (
              <motion.div
                key="extract"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-teal-400" />
                    <span>Field Comparison Across Documents</span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-medium">Field</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 1</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 2</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 3</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockDocumentData.map((row, index) => (
                        <motion.tr
                          key={row.field}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4 text-white font-medium">{row.field}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc1 || '-'}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc2 || '-'}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc3 || '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(row.status)}
                              {getStatusChip(row.status)}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'heatmap' && (
              <motion.div
                key="heatmap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Legend */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Company Frequency Across Documents</h3>
                  <div className="flex items-center space-x-6 text-sm text-white/70">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>High frequency (4-5 docs)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span>Medium frequency (2-3 docs)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-200 rounded"></div>
                      <span>Low frequency (1 doc)</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {mockCompanyData.map((company, index) => (
                      <motion.div
                        key={company.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                        className={`
                          ${getCompanyBoxSize(company.frequency, maxFrequency)}
                          ${getCompanyColor(company.frequency, maxFrequency)}
                          rounded-2xl flex flex-col items-center justify-center text-white font-semibold
                          cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg
                          relative group
                        `}
                      >
                        <div className="text-center p-2">
                          <div className="text-sm font-bold mb-1">{company.name}</div>
                          <div className="text-xs opacity-90">{company.frequency}/{company.totalDocs}</div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {company.name} — Found in {company.frequency} of {company.totalDocs} documents
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar - Quick Insights */}
      <div className="w-80 p-6 space-y-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Insights</h3>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Files className="h-5 w-5 text-teal-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalDocs}</div>
                  <div className="text-white/70 text-sm">Total Documents</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{uniqueCompanies}</div>
                  <div className="text-white/70 text-sm">Unique Companies</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-lg font-bold text-white">{mostFrequentCompany.name}</div>
                  <div className="text-white/70 text-sm">Most Frequent Company</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">67</div>
                  <div className="text-white/70 text-sm">Average Risk Score</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-teal-500/20 via-primary-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Field Analysis Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Consistent Fields</span>
              <span className="text-green-400 font-semibold">{consistentCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">Missing Fields</span>
              <span className="text-yellow-400 font-semibold">{missingCount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">Mismatched Fields</span>
              <span className="text-red-400 font-semibold">{mismatchCount}</span>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Consistency Rate</span>
                <span className="text-white font-bold">
                  {Math.round((consistentCount / mockDocumentData.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full" 
                  style={{ width: `${(consistentCount / mockDocumentData.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MultiDocAnalysisPage;