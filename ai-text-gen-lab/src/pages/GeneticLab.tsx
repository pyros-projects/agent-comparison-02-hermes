import { useState, useEffect, useRef, useCallback } from 'react';
import { GeneticTextModel, GAStepResult } from '../lib/genetic';
import { Play, Square, RotateCcw, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DEFAULT_TARGET = "To be or not to be, that is the question.";

export const GeneticLab = () => {
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [mutationRate, setMutationRate] = useState(0.01);
  const [popSize, setPopSize] = useState(200);
  
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<GAStepResult | null>(null);
  const [history, setHistory] = useState<{generation: number, best: number, avg: number}[]>([]);
  
  const modelRef = useRef<GeneticTextModel | null>(null);
  const requestRef = useRef<number>();

  // Initialize model on mount
  useEffect(() => {
    modelRef.current = new GeneticTextModel(target, popSize, mutationRate);
    setStats(modelRef.current.step()); // Initial random state
  }, []); // Run once

  // Handle updates to settings without full reset unless necessary
  useEffect(() => {
    if (modelRef.current) {
        // If target length changed, the model resets internally
        modelRef.current.updateSettings(target, popSize, mutationRate);
    }
  }, [target, popSize, mutationRate]);

  const step = useCallback(() => {
    if (modelRef.current) {
      const result = modelRef.current.step();
      setStats(result);
      
      // Update history less frequently to save rendering if fast
      if (result.generation % 1 === 0) {
        setHistory(prev => {
            const newHist = [...prev, { 
                generation: result.generation, 
                best: result.bestFitness, 
                avg: result.avgFitness 
            }];
            // Limit history size for performance
            if (newHist.length > 200) return newHist.slice(-200);
            return newHist;
        });
      }

      if (result.bestFitness === 1) {
        setIsRunning(false);
      }
    }
  }, []);

  const animate = useCallback(() => {
    step();
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, step]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  const handleReset = () => {
    setIsRunning(false);
    if (modelRef.current) {
        modelRef.current.reset();
        setHistory([]);
        setStats(modelRef.current.step());
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left: Settings */}
      <div className="lg:col-span-1 flex flex-col space-y-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2" /> Evolution Settings
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mutation Rate ({mutationRate})</label>
            <input 
              type="range" min="0.001" max="0.1" step="0.001" 
              value={mutationRate} onChange={(e) => setMutationRate(parseFloat(e.target.value))}
              className="w-full"
            />
             <p className="text-xs text-gray-500">Higher = more chaos, Lower = stability.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Population Size ({popSize})</label>
            <input 
              type="range" min="50" max="1000" step="50" 
              value={popSize} onChange={(e) => setPopSize(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">More candidates = better search, slower.</p>
          </div>

           <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Sentence</label>
            <textarea 
              value={target}
              onChange={(e) => { 
                  setTarget(e.target.value); 
                  // Reset history if target changes significantly? 
                  // User might want to see it adapt. Let's keep running.
              }}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex-1">
           <h3 className="text-lg font-semibold mb-2">Stats</h3>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
                <span className="text-gray-500">Generation:</span>
                <span className="font-mono font-bold">{stats?.generation || 0}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Best Fitness:</span>
                <span className="font-mono font-bold text-green-600">{((stats?.bestFitness || 0) * 100).toFixed(1)}%</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500">Avg Fitness:</span>
                <span className="font-mono">{((stats?.avgFitness || 0) * 100).toFixed(1)}%</span>
             </div>
           </div>
        </div>
      </div>

      {/* Center: Visualization */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
         <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Evolution Playground</h3>
                <div className="space-x-2">
                    <button 
                        onClick={handleReset}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isRunning ? <><Square className="w-4 h-4 mr-2 fill-current" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Evolution</>}
                    </button>
                </div>
            </div>

            <div className="mb-6 space-y-1">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Best Candidate</p>
                <div className="font-mono text-2xl break-all bg-gray-50 p-4 rounded border border-gray-200 min-h-[4rem]">
                    {stats?.bestGenome.split('').map((char, i) => (
                        <span key={i} className={char === target[i] ? "text-green-600 font-bold" : "text-gray-400"}>
                            {char}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="mb-2">
                 <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Fitness History</p>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="generation" hide />
                            <YAxis domain={[0, 1]} />
                            <Tooltip formatter={(val: number) => (val * 100).toFixed(1) + "%"} labelFormatter={(l) => `Gen ${l}`}/>
                            <Line type="monotone" dataKey="best" stroke="#4f46e5" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="avg" stroke="#9ca3af" strokeWidth={1} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
};
