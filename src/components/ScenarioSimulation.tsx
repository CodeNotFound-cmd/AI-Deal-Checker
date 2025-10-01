import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, RotateCcw, Play } from 'lucide-react';

interface SimulationField {
  id: string;
  label: string;
  currentValue: string;
  simulatedValue: string;
  type: 'text' | 'number' | 'percentage';
  impact: number; // Impact on risk score (-50 to +50)
}

const ScenarioSimulation = () => {
  const [originalRiskScore] = useState(73);
  const [currentRiskScore, setCurrentRiskScore] = useState(73);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [simulationFields, setSimulationFields] = useState<SimulationField[]>([
    {
      id: 'interest-rate',
      label: 'Interest Rate',
      currentValue: 'Missing',
      simulatedValue: '5.25',
      type: 'percentage',
      impact: -25
    },
    {
      id: 'notional-amount',
      label: 'Notional Amount',
      currentValue: '100000000',
      simulatedValue: '100000000',
      type: 'number',
      impact: 0
    },
    {
      id: 'termination-clause',
      label: 'Termination Notice',
      currentValue: 'Missing',
      simulatedValue: '30 days',
      type: 'text',
      impact: -15
    },
    {
      id: 'collateral-requirement',
      label: 'Collateral Coverage',
      currentValue: '0',
      simulatedValue: '110',
      type: 'percentage',
      impact: -20
    }
  ]);

  const calculateRiskScore = () => {
    const totalImpact = simulationFields.reduce((sum, field) => {
      if (field.simulatedValue !== field.currentValue && field.simulatedValue.trim() !== '') {
        return sum + field.impact;
      }
      return sum;
    }, 0);
    
    return Math.max(0, Math.min(100, originalRiskScore + totalImpact));
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setSimulationFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, simulatedValue: value }
          : field
      )
    );
  };

  const runSimulation = () => {
    setIsSimulating(true);
    const newScore = calculateRiskScore();
    
    // Animate the score change
    const startScore = currentRiskScore;
    const difference = newScore - startScore;
    const steps = 20;
    const stepSize = difference / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const intermediateScore = Math.round(startScore + (stepSize * currentStep));
      setCurrentRiskScore(intermediateScore);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setCurrentRiskScore(newScore);
        setIsSimulating(false);
      }
    }, 50);
  };

  const resetSimulation = () => {
    setSimulationFields(prev => 
      prev.map(field => ({ ...field, simulatedValue: field.currentValue }))
    );
    setCurrentRiskScore(originalRiskScore);
  };

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

  const scoreDifference = currentRiskScore - originalRiskScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-teal-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                What-If Scenario Analysis
              </h2>
              <p className="text-white/70 text-sm">
                Simulate changes and see real-time risk impact
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={resetSimulation}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-primary-500 hover:from-teal-600 hover:to-primary-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Controls */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-semibold mb-4">Adjust Parameters</h3>
            
            {simulationFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">{field.label}</label>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      field.impact < 0 ? 'bg-green-500/20 text-green-300' : 
                      field.impact > 0 ? 'bg-red-500/20 text-red-300' : 
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {field.impact > 0 ? '+' : ''}{field.impact} pts
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm">Current</label>
                    <div className="mt-1 px-3 py-2 bg-white/10 rounded-lg text-white/80 text-sm">
                      {field.currentValue === 'Missing' ? (
                        <span className="text-red-300">Missing</span>
                      ) : (
                        field.currentValue + (field.type === 'percentage' ? '%' : '')
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm">Simulated</label>
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={field.simulatedValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-colors"
                      placeholder={field.type === 'percentage' ? '0.00' : 'Enter value'}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Risk Score Comparison */}
          <div className="space-y-6">
            {/* Current Risk Score */}
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <h3 className="text-white font-semibold mb-4">Simulated Risk Score</h3>
              
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
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    className={getRiskZoneColor(currentRiskScore)}
                    initial={{ strokeDasharray: "251.2 251.2", strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (currentRiskScore / 100) * 251.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      strokeDasharray: "251.2 251.2",
                    }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <motion.div 
                      key={currentRiskScore}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-bold ${getRiskZoneColor(currentRiskScore)}`}
                    >
                      {currentRiskScore}
                    </motion.div>
                    <div className="text-white/70 text-xs">/ 100</div>
                  </div>
                </div>
              </div>

              <div className={`text-sm font-semibold ${getRiskZoneColor(currentRiskScore)} mb-2`}>
                {getRiskZoneLabel(currentRiskScore)}
              </div>
              
              {/* Score Change Indicator */}
              {scoreDifference !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm flex items-center justify-center space-x-1 ${
                    scoreDifference < 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <TrendingUp className={`h-4 w-4 ${scoreDifference < 0 ? 'rotate-180' : ''}`} />
                  <span>
                    {scoreDifference > 0 ? '+' : ''}{scoreDifference} from original
                  </span>
                </motion.div>
              )}
            </div>

            {/* Before/After Comparison */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3">Score Comparison</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Original</span>
                  <span className={`font-semibold ${getRiskZoneColor(originalRiskScore)}`}>
                    {originalRiskScore}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Simulated</span>
                  <span className={`font-semibold ${getRiskZoneColor(currentRiskScore)}`}>
                    {currentRiskScore}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Change</span>
                    <span className={`font-bold ${
                      scoreDifference < 0 ? 'text-green-400' : 
                      scoreDifference > 0 ? 'text-red-400' : 'text-white'
                    }`}>
                      {scoreDifference > 0 ? '+' : ''}{scoreDifference}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScenarioSimulation;