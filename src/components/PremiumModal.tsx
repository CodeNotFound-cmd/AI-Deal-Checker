import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Zap, BarChart3, TrendingUp, Shield, CheckCircle } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'scenario' | 'benchmark';
  title: string;
  description: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, type, title, description }) => {
  const scenarioFeatures = [
    {
      icon: Zap,
      title: 'Real-time Risk Calculation',
      description: 'See instant risk score changes as you modify field values across documents'
    },
    {
      icon: TrendingUp,
      title: 'Multi-Document Impact',
      description: 'Understand how changes in one document affect the entire portfolio'
    },
    {
      icon: Shield,
      title: 'Compliance Validation',
      description: 'Ensure all scenarios maintain regulatory compliance standards'
    }
  ];

  const benchmarkFeatures = [
    {
      icon: BarChart3,
      title: 'Industry Standards',
      description: 'Compare against ISDA, Basel III, and other regulatory frameworks'
    },
    {
      icon: CheckCircle,
      title: 'Best Practice Analysis',
      description: 'Identify areas where your documents exceed or fall short of standards'
    },
    {
      icon: Sparkles,
      title: 'Peer Comparison',
      description: 'See how your risk profile compares to similar financial institutions'
    }
  ];

  const features = type === 'scenario' ? scenarioFeatures : benchmarkFeatures;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    type === 'scenario' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}>
                    {type === 'scenario' ? (
                      <Zap className="h-6 w-6 text-white" />
                    ) : (
                      <BarChart3 className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <span>{title}</span>
                      <Crown className="h-5 w-5 text-yellow-400" />
                    </h2>
                    <p className="text-white/70">{description}</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Demo Interface */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Live Demo Interface</h3>
                
                {type === 'scenario' ? (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Scenario Controls */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Adjust Parameters</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-white/70 text-sm">Interest Rate</label>
                            <div className="mt-1 flex items-center space-x-3">
                              <input
                                type="range"
                                min="0"
                                max="10"
                                defaultValue="5.25"
                                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-white text-sm w-12">5.25%</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-white/70 text-sm">Notional Amount</label>
                            <div className="mt-1 flex items-center space-x-3">
                              <input
                                type="range"
                                min="10"
                                max="500"
                                defaultValue="100"
                                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-white text-sm w-16">$100M</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-white/70 text-sm">Collateral Coverage</label>
                            <div className="mt-1 flex items-center space-x-3">
                              <input
                                type="range"
                                min="80"
                                max="150"
                                defaultValue="110"
                                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-white text-sm w-12">110%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Risk Score Display */}
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4">
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
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                className="text-yellow-400"
                                style={{
                                  strokeDasharray: "251.2 251.2",
                                  strokeDashoffset: 125.6
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-2xl font-bold text-yellow-400">45</div>
                            </div>
                          </div>
                          <div className="text-yellow-400 font-semibold">Medium Risk</div>
                          <div className="text-white/70 text-sm">Simulated Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">92%</div>
                          <div className="text-white/70 text-sm">ISDA Compliance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">78%</div>
                          <div className="text-white/70 text-sm">Basel III</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">85%</div>
                          <div className="text-white/70 text-sm">Industry Avg</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h5 className="text-white font-medium mb-3">Compliance Breakdown</h5>
                        <div className="space-y-2">
                          {['Interest Rate Specification', 'Termination Clauses', 'Settlement Terms'].map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-white/80 text-sm">{item}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-white/20 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full" 
                                    style={{ width: `${85 + index * 5}%` }}
                                  />
                                </div>
                                <span className="text-white/70 text-sm w-8">{85 + index * 5}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Premium Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <feature.icon className="h-5 w-5 text-teal-400" />
                        <h4 className="text-white font-medium">{feature.title}</h4>
                      </div>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto ${
                    type === 'scenario'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Try {title} Now</span>
                  <Crown className="h-5 w-5" />
                </motion.button>
                <p className="text-white/60 text-sm mt-3">
                  Fully functional premium feature - no restrictions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;