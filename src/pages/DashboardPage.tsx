import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Eye,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Deal {
  id: string;
  dealId: string;
  counterparty: string;
  notionalAmount: string;
  currency: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'flagged' | 'reviewing';
  lastUpdated: string;
  documentType: string;
}

interface ExtractedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  status: 'success' | 'review' | 'missing';
}

const mockDeals: Deal[] = [
  {
    id: '1',
    dealId: 'DTC-2024-001',
    counterparty: 'ABC Bank Ltd.',
    notionalAmount: '$100,000,000',
    currency: 'USD',
    riskScore: 73,
    status: 'flagged',
    lastUpdated: '2024-01-15T14:32:15Z',
    documentType: 'Derivative Contract'
  },
  {
    id: '2',
    dealId: 'DTC-2024-002',
    counterparty: 'Global Finance Corp',
    notionalAmount: '$50,000,000',
    currency: 'EUR',
    riskScore: 28,
    status: 'approved',
    lastUpdated: '2024-01-14T09:15:30Z',
    documentType: 'Term Sheet'
  },
  {
    id: '3',
    dealId: 'DTC-2024-003',
    counterparty: 'International Bank',
    notionalAmount: '$75,000,000',
    currency: 'GBP',
    riskScore: 45,
    status: 'reviewing',
    lastUpdated: '2024-01-13T16:45:22Z',
    documentType: 'Confirmation'
  }
];

const mockExtractedFields: ExtractedField[] = [
  { id: '1', name: 'Counterparty', value: 'ABC Bank Ltd.', confidence: 98, status: 'success' },
  { id: '2', name: 'Notional Amount', value: '$100,000,000', confidence: 95, status: 'success' },
  { id: '3', name: 'Currency', value: 'USD', confidence: 100, status: 'success' },
  { id: '4', name: 'Trade Date', value: '2024-01-15', confidence: 92, status: 'success' },
  { id: '5', name: 'Interest Rate', value: '', confidence: 0, status: 'missing' },
  { id: '6', name: 'Collateral', value: 'Government Bonds', confidence: 67, status: 'review' },
  { id: '7', name: 'Settlement Date', value: '2024-01-17', confidence: 89, status: 'success' },
  { id: '8', name: 'Maturity Date', value: '2025-01-15', confidence: 94, status: 'success' }
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'review':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getFieldStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-400/30 text-green-300';
      case 'review':
        return 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300';
      case 'missing':
        return 'bg-red-500/10 border-red-400/30 text-red-300';
      default:
        return '';
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleNewDeal = () => {
    navigate('/upload');
  };

  // Calculate summary stats
  const totalFields = mockExtractedFields.length;
  const extractedFields = mockExtractedFields.filter(f => f.status === 'success').length;
  const missingFields = mockExtractedFields.filter(f => f.status === 'missing').length;
  const reviewFields = mockExtractedFields.filter(f => f.status === 'review').length;
  const overallConfidence = Math.round(
    mockExtractedFields.reduce((sum, field) => sum + field.confidence, 0) / totalFields
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Risk Assessment Platform</h1>
            <p className="text-gray-600">Document Analysis Dashboard</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewDeal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Analysis</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - 20% width */}
        <div className="w-1/5 bg-slate-900 text-white p-6 overflow-y-auto">
          {/* Workflow Stepper */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6">Workflow Progress</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Upload', status: 'completed' },
                { step: 2, title: 'Extract', status: 'current' },
                { step: 3, title: 'Validate', status: 'pending' },
                { step: 4, title: 'Summary', status: 'pending' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${item.status === 'completed' ? 'bg-green-500' : 
                      item.status === 'current' ? 'bg-blue-500' : 'bg-gray-600'}
                  `}>
                    {item.step}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className={`text-xs ${
                      item.status === 'completed' ? 'text-green-300' :
                      item.status === 'current' ? 'text-blue-300' : 'text-gray-400'
                    }`}>
                      {item.status === 'completed' ? 'Completed' :
                       item.status === 'current' ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Documents Processed</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Risk Score Accuracy</span>
                <span className="font-semibold text-green-400">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Avg Processing Time</span>
                <span className="font-semibold">12.3s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - 50% width */}
        <div className="w-1/2 bg-white p-6">
          <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Document Viewer Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">deal-contract-2024.pdf</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  <ZoomOut className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-gray-600 text-sm min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  <ZoomIn className="h-4 w-4 text-gray-600" />
                </button>
                <div className="flex items-center space-x-1 ml-4">
                  <button className="p-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors">
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-600 px-2">1 / 3</span>
                  <button className="p-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <button className="p-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors">
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6 h-full overflow-auto bg-gray-100">
              <div 
                className="bg-white rounded-lg shadow-sm mx-auto relative"
                style={{ 
                  width: `${(8.5 * zoom) / 100 * 80}px`,
                  minHeight: `${(11 * zoom) / 100 * 80}px`,
                }}
              >
                <div className="p-8 text-gray-800 text-sm leading-relaxed">
                  <div className="text-center mb-8">
                    <h1 className="text-xl font-bold mb-2">DERIVATIVE TRANSACTION CONFIRMATION</h1>
                    <p className="text-gray-600">Trade Reference: DTC-2024-001</p>
                  </div>

                  <div className="space-y-4">
                    <p>
                      This confirms the terms of the derivative transaction entered into between{' '}
                      <span className="bg-green-200 px-1 rounded font-semibold">ABC Bank Ltd.</span> and XYZ Corporation on{' '}
                      <span className="bg-blue-200 px-1 rounded font-semibold">January 15, 2024</span>.
                    </p>

                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div>
                        <h3 className="font-semibold mb-2">Transaction Details:</h3>
                        <p>Notional Amount: <span className="bg-green-200 px-1 rounded font-semibold">$100,000,000</span></p>
                        <p>Currency: <span className="bg-green-200 px-1 rounded">USD</span></p>
                        <p>Trade Date: <span className="bg-blue-200 px-1 rounded font-semibold">2024-01-15</span></p>
                        <p>Maturity Date: <span className="bg-blue-200 px-1 rounded">2025-01-15</span></p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Settlement:</h3>
                        <p>Settlement Date: <span className="bg-blue-200 px-1 rounded">2024-01-17</span></p>
                        <p>Collateral: <span className="bg-yellow-200 px-1 rounded">Government Bonds</span></p>
                        <p className="text-red-600">Interest Rate: <span className="bg-red-200 px-1 rounded">[TO BE CONFIRMED]</span></p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-8">
                      This confirmation is subject to the terms and conditions of the ISDA Master Agreement 
                      dated as of [DATE] between the parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Insights Panel - 30% width */}
        <div className="w-3/10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 overflow-y-auto">
          {/* Extracted Fields Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Extracted Fields</h2>
            <div className="space-y-3">
              {mockExtractedFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(field.status)}
                      <span className="font-medium">{field.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFieldStatusColor(field.status)}`}>
                      {field.confidence}%
                    </span>
                  </div>
                  <div className="text-white/80 text-sm">
                    {field.value || 'No value detected'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Extraction Summary Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-4">Extraction Summary</h3>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{totalFields}</div>
                <div className="text-white/70 text-sm">Total Fields</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{extractedFields}</div>
                <div className="text-white/70 text-sm">Extracted</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{missingFields}</div>
                <div className="text-white/70 text-sm">Missing</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{reviewFields}</div>
                <div className="text-white/70 text-sm">Needs Review</div>
              </div>
            </div>

            {/* Circular Progress for Overall Confidence */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                    className="text-green-400"
                    initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (overallConfidence / 100) * 251.2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      strokeDasharray: "251.2 251.2",
                    }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">{overallConfidence}%</div>
                  </div>
                </div>
              </div>
              
              <div className="text-lg font-semibold">Overall Confidence</div>
              <div className="text-white/70 text-sm">Extraction accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;