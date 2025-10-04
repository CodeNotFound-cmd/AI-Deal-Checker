import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Files, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText,
  Zap,
  BarChart3,
  Crown,
  Sparkles
} from 'lucide-react';
import PremiumModal from '../components/PremiumModal';

interface DocumentField {
  field: string;
  doc1: string;
  doc2: string;
  doc3: string;
  status: 'consistent' | 'missing' | 'mismatch';
  confidence: number;
  riskImpact: 'low' | 'medium' | 'high';
}

interface CompanyFrequency {
  name: string;
  frequency: number;
  totalDocs: number;
  riskScore: number;
  lastSeen: string;
}

interface ValidationSummary {
  totalFields: number;
  consistentFields: number;
  missingFields: number;
  mismatchFields: number;
  overallRiskScore: number;
  criticalIssues: string[];
}

const mockDocumentData: DocumentField[] = [
  {
    field: 'Company Name',
    doc1: 'ABC Bank Ltd.',
    doc2: 'ABC Bank Ltd.',
    doc3: 'ABC Bank Ltd.',
    status: 'consistent',
    confidence: 98,
    riskImpact: 'low'
  },
  {
    field: 'Notional Amount',
    doc1: '$100,000,000',
    doc2: '$150,000,000',
    doc3: '$100,000,000',
    status: 'mismatch',
    confidence: 85,
    riskImpact: 'high'
  },
  {
    field: 'Interest Rate',
    doc1: '5.25%',
    doc2: '',
    doc3: '5.50%',
    status: 'missing',
    confidence: 60,
    riskImpact: 'high'
  },
  {
    field: 'Trade Date',
    doc1: '2024-01-15',
    doc2: '2024-01-15',
    doc3: '2024-01-15',
    status: 'consistent',
    confidence: 100,
    riskImpact: 'low'
  },
  {
    field: 'Maturity Date',
    doc1: '2025-01-15',
    doc2: '2025-06-15',
    doc3: '2025-01-15',
    status: 'mismatch',
    confidence: 75,
    riskImpact: 'medium'
  },
  {
    field: 'Currency',
    doc1: 'USD',
    doc2: 'USD',
    doc3: 'EUR',
    status: 'mismatch',
    confidence: 90,
    riskImpact: 'medium'
  },
  {
    field: 'Settlement Date',
    doc1: '2024-01-17',
    doc2: '2024-01-17',
    doc3: '',
    status: 'missing',
    confidence: 70,
    riskImpact: 'medium'
  },
  {
    field: 'Collateral Type',
    doc1: 'Government Bonds',
    doc2: 'Corporate Bonds',
    doc3: 'Government Bonds',
    status: 'mismatch',
    confidence: 88,
    riskImpact: 'medium'
  }
];

const mockCompanyData: CompanyFrequency[] = [
  { name: 'ABC Bank Ltd.', frequency: 5, totalDocs: 5, riskScore: 25, lastSeen: '2024-01-15' },
  { name: 'Global Finance Corp', frequency: 4, totalDocs: 5, riskScore: 45, lastSeen: '2024-01-14' },
  { name: 'International Bank', frequency: 3, totalDocs: 5, riskScore: 35, lastSeen: '2024-01-13' },
  { name: 'XYZ Corporation', frequency: 4, totalDocs: 5, riskScore: 55, lastSeen: '2024-01-12' },
  { name: 'Deutsche Finance', frequency: 2, totalDocs: 5, riskScore: 30, lastSeen: '2024-01-11' },
  { name: 'JP Morgan Chase', frequency: 3, totalDocs: 5, riskScore: 20, lastSeen: '2024-01-10' },
  { name: 'Goldman Sachs', frequency: 2, totalDocs: 5, riskScore: 15, lastSeen: '2024-01-09' },
  { name: 'Morgan Stanley', frequency: 1, totalDocs: 5, riskScore: 40, lastSeen: '2024-01-08' }
];

const MultiDocAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState<'extract' | 'heatmap'>('extract');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [premiumModal, setPremiumModal] = useState<'scenario' | 'benchmark' | null>(null);

  // Calculate validation summary
  const validationSummary: ValidationSummary = {
    totalFields: mockDocumentData.length,
    consistentFields: mockDocumentData.filter(d => d.status === 'consistent').length,
    missingFields: mockDocumentData.filter(d => d.status === 'missing').length,
    mismatchFields: mockDocumentData.filter(d => d.status === 'mismatch').length,
    overallRiskScore: Math.round(
      mockDocumentData.reduce((sum, field) => {
        const riskWeight = field.riskImpact === 'high' ? 3 : field.riskImpact === 'medium' ? 2 : 1;
        const statusWeight = field.status === 'mismatch' ? 3 : field.status === 'missing' ? 2 : 0;
        return sum + (riskWeight * statusWeight);
      }, 0) / mockDocumentData.length * 10
    ),
    criticalIssues: mockDocumentData
      .filter(d => d.status !== 'consistent' && d.riskImpact === 'high')
      .map(d => d.field)
  };

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

  const getStatusChip = (status: string, confidence: number) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1";
    switch (status) {
      case 'consistent':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border-green-400/30`}>
            <CheckCircle className="h-3 w-3" />
            <span>Consistent ({confidence}%)</span>
          </span>
        );
      case 'missing':
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300 border-yellow-400/30`}>
            <AlertTriangle className="h-3 w-3" />
            <span>Missing Data</span>
          </span>
        );
      case 'mismatch':
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-300 border-red-400/30`}>
            <XCircle className="h-3 w-3" />
            <span>Mismatch ({confidence}%)</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCompanyBoxSize = (frequency: number, maxFreq: number) => {
    const ratio = frequency / maxFreq;
    if (ratio >= 0.8) return 'w-36 h-36';
    if (ratio >= 0.6) return 'w-32 h-32';
    if (ratio >= 0.4) return 'w-28 h-28';
    return 'w-24 h-24';
  };

  const getCompanyGradient = (frequency: number, riskScore: number, maxFreq: number) => {
    const ratio = frequency / maxFreq;
    const riskLevel = riskScore <= 30 ? 'low' : riskScore <= 60 ? 'medium' : 'high';
    
    if (ratio >= 0.8) {
      return riskLevel === 'high' 
        ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700' 
        : riskLevel === 'medium'
        ? 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600'
        : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700';
    }
    if (ratio >= 0.6) {
      return riskLevel === 'high'
        ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-600'
        : riskLevel === 'medium'
        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500'
        : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }
    if (ratio >= 0.4) {
      return riskLevel === 'high'
        ? 'bg-gradient-to-br from-red-300 via-red-400 to-red-500'
        : riskLevel === 'medium'
        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400'
        : 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500';
    }
    return riskLevel === 'high'
      ? 'bg-gradient-to-br from-red-200 via-red-300 to-red-400'
      : riskLevel === 'medium'
      ? 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300'
      : 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
  };

  const getRiskImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const maxFrequency = Math.max(...mockCompanyData.map(c => c.frequency));
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Multi-Document Analysis
                </h1>
                <p className="text-white/70">
                  Cross-validate and analyze multiple documents for consistency and patterns
                </p>
              </div>
              
              {/* Premium Features */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPremiumModal('scenario')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>What-If Scenarios</span>
                  <Crown className="h-4 w-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPremiumModal('benchmark')}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Benchmark Analysis</span>
                  <Sparkles className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Validation Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cross-Document Validation Results</h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-300">{validationSummary.consistentFields} Consistent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-300">{validationSummary.missingFields} Missing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-300">{validationSummary.mismatchFields} Mismatches</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  validationSummary.overallRiskScore <= 30 ? 'text-green-400' :
                  validationSummary.overallRiskScore <= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {validationSummary.overallRiskScore}
                </div>
                <div className="text-white/70 text-sm">Risk Score</div>
              </div>
            </div>
            
            {validationSummary.criticalIssues.length > 0 && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 font-medium">Critical Issues Detected</span>
                </div>
                <div className="text-red-200 text-sm">
                  High-risk mismatches found in: {validationSummary.criticalIssues.join(', ')}
                </div>
              </div>
            )}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                    <span>Cross-Document Field Validation</span>
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    Comparing extracted fields across all uploaded documents
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-medium">Field</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 1</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 2</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Document 3</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Validation Status</th>
                        <th className="px-6 py-4 text-left text-white font-medium">Risk Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {mockDocumentData.map((row, index) => (
                        <motion.tr
                          key={row.field}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`hover:bg-white/5 transition-colors group cursor-pointer ${
                            selectedField === row.field ? 'bg-white/10 ring-2 ring-teal-400/50' : ''
                          }`}
                          onClick={() => setSelectedField(selectedField === row.field ? null : row.field)}
                        >
                          <td className="px-6 py-4 text-white font-medium">{row.field}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc1 || '-'}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc2 || '-'}</td>
                          <td className="px-6 py-4 text-white/80">{row.doc3 || '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(row.status)}
                              {getStatusChip(row.status, row.confidence)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskImpactColor(row.riskImpact)}`}>
                              {row.riskImpact.toUpperCase()}
                            </span>
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
                {/* Enhanced Legend */}
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-teal-400" />
                    <span>Company Risk & Frequency Analysis</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white/90 font-medium mb-3">Frequency Scale</h4>
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded"></div>
                          <span>High frequency (4-5 docs)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded"></div>
                          <span>Medium frequency (2-3 docs)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-200 to-blue-400 rounded"></div>
                          <span>Low frequency (1 doc)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white/90 font-medium mb-3">Risk Intensity</h4>
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded"></div>
                          <span>High risk (60+ score)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded"></div>
                          <span>Medium risk (30-60 score)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
                          <span>Low risk (0-30 score)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Heatmap Grid */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {mockCompanyData.map((company, index) => (
                      <motion.div
                        key={company.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: index * 0.1, 
                          type: "spring", 
                          stiffness: 100,
                          damping: 15
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 2,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                        }}
                        className={`
                          ${getCompanyBoxSize(company.frequency, maxFrequency)}
                          ${getCompanyGradient(company.frequency, company.riskScore, maxFrequency)}
                          rounded-2xl flex flex-col items-center justify-center text-white font-semibold
                          cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl
                          relative group border border-white/20
                        `}
                      >
                        <div className="text-center p-3 z-10">
                          <div className="text-sm font-bold mb-1 drop-shadow-lg">{company.name}</div>
                          <div className="text-xs opacity-90 mb-1">{company.frequency}/{company.totalDocs} docs</div>
                          <div className="text-xs opacity-80">Risk: {company.riskScore}</div>
                        </div>
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Enhanced Tooltip */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border border-white/20 shadow-xl">
                          <div className="font-semibold">{company.name}</div>
                          <div className="text-gray-300">Found in {company.frequency} of {company.totalDocs} documents</div>
                          <div className="text-gray-300">Risk Score: {company.riskScore}/100</div>
                          <div className="text-gray-400">Last seen: {company.lastSeen}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
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

      {/* Right Sidebar - Enhanced Quick Insights */}
      <div className="w-80 p-6 space-y-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-teal-400" />
            <span>Quick Insights</span>
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="flex items-center space-x-3">
                <Files className="h-5 w-5 text-teal-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{totalDocs}</div>
                  <div className="text-white/70 text-sm">Total Documents</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{uniqueCompanies}</div>
                  <div className="text-white/70 text-sm">Unique Companies</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-lg font-bold text-white">{mostFrequentCompany.name}</div>
                  <div className="text-white/70 text-sm">Most Frequent Company</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{validationSummary.overallRiskScore}</div>
                  <div className="text-white/70 text-sm">Average Risk Score</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Field Analysis Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-teal-500/20 via-primary-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Validation Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Fields</span>
              <span className="text-white font-semibold">{validationSummary.totalFields}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-300">Consistent Fields</span>
              <span className="text-green-400 font-semibold">{validationSummary.consistentFields}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-yellow-300">Missing Fields</span>
              <span className="text-yellow-400 font-semibold">{validationSummary.missingFields}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-red-300">Mismatched Fields</span>
              <span className="text-red-400 font-semibold">{validationSummary.mismatchFields}</span>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Consistency Rate</span>
                <span className="text-white font-bold">
                  {Math.round((validationSummary.consistentFields / validationSummary.totalFields) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(validationSummary.consistentFields / validationSummary.totalFields) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-green-400 to-teal-400 h-3 rounded-full" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Critical Issues Alert */}
        {validationSummary.criticalIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-500/20 via-red-600/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Critical Issues</span>
            </h3>
            <div className="space-y-2">
              {validationSummary.criticalIssues.map((issue, index) => (
                <div key={index} className="text-red-200 text-sm bg-red-500/10 rounded-lg p-2">
                  {issue} requires immediate attention
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Premium Modals */}
      <PremiumModal
        isOpen={premiumModal === 'scenario'}
        onClose={() => setPremiumModal(null)}
        type="scenario"
        title="What-If Scenario Analysis"
        description="Simulate changes across multiple documents and see real-time risk impact"
      />
      
      <PremiumModal
        isOpen={premiumModal === 'benchmark'}
        onClose={() => setPremiumModal(null)}
        type="benchmark"
        title="Industry Benchmark Analysis"
        description="Compare your documents against industry standards and best practices"
      />
    </div>
  );
};

export default MultiDocAnalysisPage;