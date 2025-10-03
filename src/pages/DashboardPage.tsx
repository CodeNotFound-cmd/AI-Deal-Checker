import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  DollarSign,
  Users,
  Clock,
  Plus
} from 'lucide-react';

interface DealSummary {
  id: string;
  dealId: string;
  counterparty: string;
  notionalAmount: string;
  currency: string;
  riskScore: number;
  riskLevel: string;
  status: 'pending' | 'approved' | 'flagged' | 'reviewing';
  lastUpdated: string;
}

const mockDeals: DealSummary[] = [
  {
    id: '1',
    dealId: 'DTC-2024-001',
    counterparty: 'ABC Bank Ltd.',
    notionalAmount: '100000000',
    currency: 'USD',
    riskScore: 73,
    riskLevel: 'High Risk',
    status: 'flagged',
    lastUpdated: '2024-01-15T14:32:15Z'
  },
  {
    id: '2',
    dealId: 'DTC-2024-002',
    counterparty: 'Global Finance Corp',
    notionalAmount: '50000000',
    currency: 'EUR',
    riskScore: 28,
    riskLevel: 'Low Risk',
    status: 'approved',
    lastUpdated: '2024-01-14T09:15:30Z'
  },
  {
    id: '3',
    dealId: 'DTC-2024-003',
    counterparty: 'International Bank',
    notionalAmount: '75000000',
    currency: 'GBP',
    riskScore: 45,
    riskLevel: 'Medium Risk',
    status: 'reviewing',
    lastUpdated: '2024-01-13T16:45:22Z'
  }
];

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleNewAnalysis = () => {
    navigate('/upload');
  };

  const handleViewDeal = (dealId: string) => {
    // In a real app, this would navigate to deal details
    console.log('Viewing deal:', dealId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'flagged':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'reviewing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatCurrency = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
    return formatted;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate summary statistics
  const totalDeals = mockDeals.length;
  const highRiskDeals = mockDeals.filter(deal => deal.riskScore >= 70).length;
  const totalNotional = mockDeals.reduce((sum, deal) => sum + parseFloat(deal.notionalAmount), 0);
  const avgRiskScore = Math.round(mockDeals.reduce((sum, deal) => sum + deal.riskScore, 0) / totalDeals);

  return (
    <div className="h-full p-6 overflow-y-auto">
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
                Risk Assessment Dashboard
              </h1>
              <p className="text-white/70">
                Monitor and analyze financial deal risks in real-time
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-primary-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Analysis</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Total Deals</p>
                <p className="text-2xl font-bold text-white">{totalDeals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">High Risk</p>
                <p className="text-2xl font-bold text-white">{highRiskDeals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Total Notional</p>
                <p className="text-2xl font-bold text-white">
                  ${(totalNotional / 1000000).toFixed(0)}M
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Avg Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskScoreColor(avgRiskScore)}`}>
                  {avgRiskScore}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Deals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-white/70" />
                <span className="text-white/70 text-sm">Last 7 days</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Deal ID</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Counterparty</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Notional</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Risk Score</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Last Updated</th>
                  <th className="px-6 py-4 text-left text-white/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockDeals.map((deal, index) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{deal.dealId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">{deal.counterparty}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/80">
                        {formatCurrency(deal.notionalAmount, deal.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${getRiskScoreColor(deal.riskScore)}`}>
                          {deal.riskScore}
                        </span>
                        <span className="text-white/60 text-sm">({deal.riskLevel})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-white/70">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{formatDate(deal.lastUpdated)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDeal(deal.id)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/upload')}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-primary-600 transition-all duration-200"
              >
                Upload New Document
              </button>
              <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors">
                View All Deals
              </button>
              <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">AI Engine</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Risk Calculator</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Document Parser</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/70">Document uploaded - DTC-2024-001</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70">Risk assessment completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white/70">Manual review requested</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;