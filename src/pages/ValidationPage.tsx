import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import AuditTrail from '../components/AuditTrail';
import CustomizableRules from '../components/CustomizableRules';
import AIExplanation from '../components/AIExplanation';
import BenchmarkComparison from '../components/BenchmarkComparison';
import ScenarioSimulation from '../components/ScenarioSimulation';

interface ValidationItem {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  severity: 'low' | 'medium' | 'high';
}

interface ExplanationData {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  regulation: string;
  documentSnippet: string;
  recommendation: string;
}

interface ExplanationData {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  regulation: string;
  documentSnippet: string;
  recommendation: string;
}

const mockValidations: ValidationItem[] = [
  {
    id: '1',
    title: 'Date Consistency Check',
    description: 'Trade date is before maturity date',
    status: 'pass',
    severity: 'low'
  },
  {
    id: '2',
    title: 'Currency Validation',
    description: 'Currency code is valid ISO standard',
    status: 'pass',
    severity: 'low'
  },
  {
    id: '3',
    title: 'Counterparty Verification',
    description: 'Entity not found in sanctions database',
    status: 'warning',
    severity: 'medium'
  },
  {
    id: '4',
    title: 'Interest Rate Missing',
    description: 'No interest rate specified in document',
    status: 'fail',
    severity: 'high'
  },
  {
    id: '5',
    title: 'Notional Amount Format',
    description: 'Amount format is standard and valid',
    status: 'pass',
    severity: 'low'
  },
  {
    id: '6',
    title: 'Settlement Period',
    description: 'T+2 settlement within market standards',
    status: 'pass',
    severity: 'low'
  }
];

const mockExplanations: { [key: string]: ExplanationData } = {
  '4': {
    id: '4',
    title: 'Interest Rate Missing',
    severity: 'high',
    explanation: 'The document lacks a specified interest rate, which is a critical component for derivative contracts. This creates uncertainty about the financial terms and potential returns, significantly increasing counterparty risk and making the deal difficult to value accurately.',
    regulation: 'ISDA Master Agreement Section 4.3 requires explicit interest rate specification for all derivative transactions. This aligns with Basel III regulatory requirements for transparent pricing mechanisms.',
    documentSnippet: '"Interest Rate: [TO BE CONFIRMED]" - This placeholder text indicates the rate was not finalized at the time of documentation.',
    recommendation: 'Contact the counterparty immediately to confirm the interest rate terms. Consider adding a fallback rate mechanism (e.g., SOFR + spread) to prevent future ambiguity.'
  },
  '3': {
    id: '3',
    title: 'Counterparty Verification',
    severity: 'medium',
    explanation: 'ABC Bank Ltd. was not found in our primary sanctions database, which could indicate incomplete entity verification. While this may be a false positive, it requires manual review to ensure compliance with anti-money laundering regulations.',
    regulation: 'OFAC sanctions screening requirements mandate verification against all relevant watchlists. EU sanctions regulations also require enhanced due diligence for financial institutions.',
    documentSnippet: '"Counterparty: ABC Bank Ltd." - Entity requires additional verification against secondary databases and regulatory filings.',
    recommendation: 'Perform enhanced due diligence including: (1) Check secondary sanctions databases, (2) Verify current regulatory status, (3) Confirm entity registration and good standing.'
  }
};


const ValidationPage = () => {
  const [riskScore, setRiskScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [validations, setValidations] = useState<ValidationItem[]>([]);
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate risk calculation
    const timer = setTimeout(() => {
      setValidations(mockValidations);
      setIsCalculating(false);
      
      // Animate risk score
      const scoreTimer = setInterval(() => {
        setRiskScore(prev => {
          if (prev >= 73) {
            clearInterval(scoreTimer);
            return 73;
          }
          return prev + 2;
        });
      }, 50);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getRiskZoneColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskZoneLabel = (score: number) => {
    if (score <= 30) return 'Low Risk';
    if (score <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const toggleExplanation = (validationId: string) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(validationId)) {
        newSet.delete(validationId);
      } else {
        newSet.add(validationId);
      }
      return newSet;
    });
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-500/20 border-green-400/30 text-green-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
      case 'fail':
        return 'bg-red-500/20 border-red-400/30 text-red-300';
      default:
        return '';
    }
  };

  const handleContinue = () => {
    navigate('/summary');
  };

  if (isCalculating) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center max-w-md mx-auto"
        >
          <div className="animate-pulse-slow w-16 h-16 bg-gradient-to-r from-teal-400 to-primary-400 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Calculating Risk Score...
          </h3>
          <p className="text-white/60">
            Running validation checks and risk analysis
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Risk Assessment & Validation
          </h1>
          <p className="text-white/70">
            Comprehensive analysis of potential risks and compliance issues
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Score Gauge */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Risk Score</h2>
              
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
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
                    className={getRiskZoneColor(riskScore)}
                    initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (riskScore / 100) * 251.2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      strokeDasharray: "251.2 251.2",
                    }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className={`text-4xl font-bold ${getRiskZoneColor(riskScore)}`}>
                      {riskScore}
                    </div>
                    <div className="text-white/70 text-sm font-medium">
                      / 100
                    </div>
                  </div>
                </div>
              </div>

              <div className={`text-lg font-semibold ${getRiskZoneColor(riskScore)} mb-2`}>
                {getRiskZoneLabel(riskScore)}
              </div>
              <p className="text-white/60 text-sm">
                Based on {validations.length} validation checks
              </p>

              {/* Risk Zones */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Low Risk</span>
                  <span className="text-white/70">0-30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">Medium Risk</span>
                  <span className="text-white/70">31-60</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-400">High Risk</span>
                  <span className="text-white/70">61-100</span>
                </div>
              </div>
            </motion.div>
            
            {/* Customizable Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CustomizableRules />
            </motion.div>
            
            {/* Customizable Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CustomizableRules />
            </motion.div>
          </div>

          {/* Validation Results */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-teal-400" />
                  <span>Validation Results</span>
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {validations.map((validation, index) => (
                  <div key={validation.id} className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className={`p-4 rounded-xl border ${getStatusColor(validation.status)} transition-all duration-200 hover:scale-[1.02]`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(validation.status)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-white">
                              {validation.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              validation.severity === 'high' 
                                ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                                : validation.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                                : 'bg-green-500/20 text-green-300 border border-green-400/30'
                            }`}>
                              {validation.severity}
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">
                            {validation.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* AI Explanation for flagged items */}
                    {(validation.status === 'fail' || validation.status === 'warning') && mockExplanations[validation.id] && (
                      <AIExplanation
                        explanationData={mockExplanations[validation.id]}
                        isExpanded={expandedExplanations.has(validation.id)}
                        onToggle={() => toggleExplanation(validation.id)}
                      />
                    )}
                    
                    {/* AI Explanation for flagged items */}
                    {(validation.status === 'fail' || validation.status === 'warning') && mockExplanations[validation.id] && (
                      <AIExplanation
                        explanationData={mockExplanations[validation.id]}
                        isExpanded={expandedExplanations.has(validation.id)}
                        onToggle={() => toggleExplanation(validation.id)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-primary-600 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>View Summary & Recommendations</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
            
            {/* Audit Trail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AuditTrail />
            </motion.div>
            
            {/* Audit Trail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AuditTrail />
            </motion.div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <BenchmarkComparison />
        </motion.div>

        {/* Scenario Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <ScenarioSimulation />
        </motion.div>

        {/* Benchmark Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <BenchmarkComparison />
        </motion.div>

        {/* Scenario Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <ScenarioSimulation />
        </motion.div>
      </div>
    </div>
  );
};

export default ValidationPage;