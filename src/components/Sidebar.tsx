import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  Brain,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const steps = [
  { id: 0, name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 1, name: 'Upload', path: '/upload', icon: Upload },
  { id: 2, name: 'Extract', path: '/extract', icon: FileText },
  { id: 3, name: 'Validate', path: '/validate', icon: Shield },
  { id: 4, name: 'Summary', path: '/summary', icon: CheckCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const currentStep = steps.find(step => step.path === location.pathname)?.id || 0;

  return (
    <div className="w-80 bg-white/10 backdrop-blur-md border-r border-white/20">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-primary-500 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Deal Checker</h1>
            <p className="text-sm text-white/70">Risk Assessment Platform</p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.path === location.pathname;
            const isCompleted = step.id < currentStep;
            const isAccessible = step.id === 0 || step.id <= currentStep + 1; // Dashboard always accessible

            return (
              <Link
                key={step.id}
                to={isAccessible ? step.path : '#'}
                className={`block ${!isAccessible ? 'pointer-events-none' : ''}`}
              >
                <motion.div
                  whileHover={isAccessible ? { scale: 1.02, x: 4 } : {}}
                  whileTap={isAccessible ? { scale: 0.98 } : {}}
                  className={`
                    relative flex items-center p-4 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-white/20 border border-white/30 shadow-lg' 
                      : isCompleted
                      ? 'bg-green-500/20 border border-green-400/30'
                      : isAccessible
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-white/5 border border-white/5 opacity-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      p-3 rounded-lg
                      ${isActive 
                        ? 'bg-white text-primary-800' 
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`
                          text-sm font-medium
                          ${isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/80'}
                        `}>
                          {step.id === 0 ? 'Overview' : `Step ${step.id}`}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <div className={`
                        font-semibold
                        ${isActive ? 'text-white' : isCompleted ? 'text-green-200' : 'text-white/70'}
                      `}>
                        {step.name}
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-2 left-8 w-0.5 h-4 bg-white/20"></div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-r from-teal-500/20 to-primary-500/20 rounded-xl border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-teal-300" />
            <span className="text-sm font-medium text-white">Analysis Stats</span>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex justify-between">
              <span>Documents Processed</span>
              <span className="text-white">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>Risk Score Accuracy</span>
              <span className="text-green-300">98.7%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;