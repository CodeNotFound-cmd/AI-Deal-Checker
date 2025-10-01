import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, AlertTriangle, TrendingUp } from 'lucide-react';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
  impact: number; // Impact on risk score
}

const CustomizableRules = () => {
  const [rules, setRules] = useState<ValidationRule[]>([
    {
      id: 'interest-rate',
      name: 'Interest Rate Required',
      description: 'Enforce that all deals must specify an interest rate',
      enabled: true,
      severity: 'high',
      impact: 25
    },
    {
      id: 'counterparty-verification',
      name: 'Counterparty Verification',
      description: 'Require full sanctions database verification',
      enabled: true,
      severity: 'medium',
      impact: 15
    },
    {
      id: 'settlement-period',
      name: 'Settlement Period Check',
      description: 'Validate settlement dates against market standards',
      enabled: true,
      severity: 'low',
      impact: 8
    },
    {
      id: 'notional-limits',
      name: 'Notional Amount Limits',
      description: 'Flag deals exceeding $50M notional amount',
      enabled: false,
      severity: 'medium',
      impact: 12
    },
    {
      id: 'currency-validation',
      name: 'Currency Code Validation',
      description: 'Ensure currency codes follow ISO standards',
      enabled: true,
      severity: 'low',
      impact: 5
    },
    {
      id: 'collateral-requirements',
      name: 'Collateral Requirements',
      description: 'Require collateral specification for high-value deals',
      enabled: false,
      severity: 'medium',
      impact: 18
    }
  ]);

  const [currentRiskScore, setCurrentRiskScore] = useState(73);

  const toggleRule = (ruleId: string) => {
    setRules(prevRules => {
      const updatedRules = prevRules.map(rule => {
        if (rule.id === ruleId) {
          const newEnabled = !rule.enabled;
          
          // Update risk score based on rule toggle
          const scoreChange = newEnabled ? rule.impact : -rule.impact;
          setCurrentRiskScore(prev => Math.max(0, Math.min(100, prev + scoreChange)));
          
          return { ...rule, enabled: newEnabled };
        }
        return rule;
      });
      
      return updatedRules;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-400/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-400/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  const getRiskZoneColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const enabledRules = rules.filter(rule => rule.enabled);
  const totalImpact = enabledRules.reduce((sum, rule) => sum + rule.impact, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-teal-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Validation Rules
              </h2>
              <p className="text-white/70 text-sm">
                Customize risk assessment parameters
              </p>
            </div>
          </div>
          
          {/* Live Risk Score */}
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              <span className="text-white/70 text-sm">Live Risk Score</span>
            </div>
            <motion.div
              key={currentRiskScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-bold ${getRiskZoneColor(currentRiskScore)}`}
            >
              {currentRiskScore}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl border transition-all duration-200
                ${rule.enabled 
                  ? 'bg-white/5 border-white/20 hover:bg-white/10' 
                  : 'bg-white/2 border-white/10 opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-medium">
                      {rule.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                      {rule.severity.toUpperCase()}
                    </span>
                    <span className="text-white/60 text-sm">
                      +{rule.impact} risk points
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">
                    {rule.description}
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleRule(rule.id)}
                  className="ml-4 flex-shrink-0"
                >
                  {rule.enabled ? (
                    <ToggleRight className="h-8 w-8 text-teal-400" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-white/40" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules Summary */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">
                {enabledRules.length}
              </div>
              <div className="text-white/70 text-sm">Active Rules</div>
            </div>
            <div>
              <div className="text-xl font-bold text-teal-400">
                {totalImpact}
              </div>
              <div className="text-white/70 text-sm">Total Impact</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-400">
                {rules.filter(r => r.enabled && r.severity === 'high').length}
              </div>
              <div className="text-white/70 text-sm">Critical Rules</div>
            </div>
          </div>
        </div>

        {/* Warning for disabled critical rules */}
        {rules.some(r => !r.enabled && r.severity === 'high') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg flex items-center space-x-2"
          >
            <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-300 text-sm">
              Warning: Some critical validation rules are disabled. This may affect risk assessment accuracy.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomizableRules;