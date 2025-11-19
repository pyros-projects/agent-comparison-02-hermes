import { useState, useMemo } from 'react';
import { RefreshCcw, Thermometer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Toy data: "The cat sat on the..."
const TOKENS = [
  { word: "mat", baseLogit: 10 },
  { word: "floor", baseLogit: 8 },
  { word: "couch", baseLogit: 6 },
  { word: "bed", baseLogit: 4 },
  { word: "moon", baseLogit: 1 }, // low probability
  { word: "cheese", baseLogit: 0.5 }, // very low
];

export const MysteryLab = () => {
  const [temperature, setTemperature] = useState(1.0);
  const [sampledHistory, setSampledHistory] = useState<string[]>([]);

  // Calculate probabilities based on temperature
  const data = useMemo(() => {
    // Softmax: exp(logit / temp) / sum(exp(logit / temp))
    const exps = TOKENS.map(t => Math.exp(t.baseLogit / temperature));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    
    return TOKENS.map((t, i) => ({
      word: t.word,
      logit: t.baseLogit,
      probability: exps[i] / sumExps
    }));
  }, [temperature]);

  const handleSample = () => {
    const r = Math.random();
    let accum = 0;
    for (const item of data) {
      accum += item.probability;
      if (r <= accum) {
        setSampledHistory(prev => [item.word, ...prev].slice(0, 20));
        return;
      }
    }
  };

  const getTempDescription = (t: number) => {
    if (t < 0.5) return "Conservative & Repetitive";
    if (t < 1.2) return "Balanced & Natural";
    return "Chaotic & Random";
  };

  const getTempColor = (t: number) => {
    if (t < 0.5) return "text-blue-600";
    if (t < 1.2) return "text-green-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left: Controls */}
      <div className="lg:col-span-1 flex flex-col space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Thermometer className="w-5 h-5 mr-2" /> Temperature Control
          </h3>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-gray-700">Temperature (T)</label>
              <span className="text-2xl font-bold font-mono">{temperature.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0.1" max="3.0" step="0.1" 
              value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
               <span>0.1 (Cold)</span>
               <span>3.0 (Hot)</span>
            </div>
          </div>

          <div className={`text-center p-3 rounded-lg bg-gray-50 font-medium border ${getTempColor(temperature)}`}>
            {getTempDescription(temperature)}
          </div>

          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p><strong>Low T (&lt;0.7):</strong> Exaggerates differences. The most likely word becomes almost certain. "Greedy".</p>
            <p><strong>High T (&gt;1.0):</strong> Flattens the distribution. Rare words get a higher chance. "Creative".</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex-1">
           <h3 className="text-lg font-semibold mb-4">Sampling History</h3>
           <div className="space-y-2">
             <button 
               onClick={handleSample}
               className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
             >
               <RefreshCcw className="w-4 h-4 mr-2" /> Sample Next Word
             </button>
             <div className="mt-4 border-t border-gray-100 pt-4">
               <p className="text-xs text-gray-400 uppercase mb-2">Recently Picked:</p>
               <div className="flex flex-wrap gap-2">
                 {sampledHistory.map((word, i) => (
                   <span key={i} className={`px-2 py-1 rounded text-sm ${i===0 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-600'}`}>
                     {word}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Right: Visualization */}
      <div className="lg:col-span-2 flex flex-col">
         <div className="bg-white shadow rounded-lg p-6 flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Probability Distribution</h3>
              <p className="text-gray-500">Context: "The cat sat on the..."</p>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                   <XAxis type="number" domain={[0, 1]} hide />
                   <YAxis type="category" dataKey="word" width={80} tick={{fontSize: 14, fontWeight: 500}} />
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         const d = payload[0].payload;
                         return (
                           <div className="bg-white p-2 border border-gray-200 shadow rounded">
                             <p className="font-bold">{d.word}</p>
                             <p>Raw Score: {d.logit}</p>
                             <p className="text-indigo-600">Prob: {(d.probability * 100).toFixed(1)}%</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Bar dataKey="probability" radius={[0, 4, 4, 0]} animationDuration={300}>
                     {data.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} fillOpacity={0.6 + (entry.probability * 0.4)} />
                     ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};
