import { useState, useEffect, useMemo } from 'react';
import { NGramModel, NGramStats } from '../lib/ngram';
import { Play, RefreshCw, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx } from 'clsx';

const PRESET_CORPORA = {
  rhyme: "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb whose fleece was white as snow. And everywhere that Mary went, Mary went, Mary went, the lamb was sure to go.",
  tech: "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. Particular applications of AI include expert systems, speech recognition, and machine vision.",
  seuss: "I do not like green eggs and ham. I do not like them Sam I am. I do not like them in a house. I do not like them with a mouse. I do not like them here or there. I do not like them anywhere."
};

export const NGramLab = () => {
  const [corpus, setCorpus] = useState(PRESET_CORPORA.rhyme);
  const [n, setN] = useState(2);
  const [prompt, setPrompt] = useState("Mary");
  const [generated, setGenerated] = useState<string[]>([]);
  const [method, setMethod] = useState<'greedy' | 'random'>('greedy');
  
  // Derived state for the model
  const model = useMemo(() => {
    const m = new NGramModel(n);
    m.train(corpus);
    return m;
  }, [corpus, n]);

  // Current context stats
  const [currentStats, setCurrentStats] = useState<NGramStats[]>([]);

  // Update stats whenever prompt or generated text changes
  useEffect(() => {
    // Combine prompt and generated text to find the current "end" of the sequence
    const fullText = prompt + (generated.length > 0 ? " " + generated.join(" ") : "");
    const tokens = fullText.replace(/([.,!?;:()"])/g, " $1 ").replace(/\s+/g, " ").trim().split(" ");
    
    const stats = model.getNextTokenStats(tokens);
    setCurrentStats(stats.slice(0, 5)); // Top 5
  }, [prompt, generated, model]);

  const handleGenerateStep = () => {
    const fullText = prompt + (generated.length > 0 ? " " + generated.join(" ") : "");
    const tokens = fullText.replace(/([.,!?;:()"])/g, " $1 ").replace(/\s+/g, " ").trim().split(" ");
    
    const nextToken = model.generate(tokens, method);
    if (nextToken) {
      setGenerated(prev => [...prev, nextToken]);
    }
  };

  const handleReset = () => {
    setGenerated([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Column: Configuration & Corpus */}
      <div className="lg:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-2">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Settings className="w-5 h-5 mr-2" /> Model Settings
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">N-Gram Order (N)</label>
            <input 
              type="range" min="1" max="4" step="1" 
              value={n} onChange={(e) => { setN(parseInt(e.target.value)); handleReset(); }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 (Unigram)</span>
              <span>2 (Bigram)</span>
              <span>3 (Trigram)</span>
              <span>4 (4-gram)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {n === 1 ? "Predicts based on global frequency only." : 
               `Predicts based on the previous ${n-1} word(s).`}
            </p>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Selection Method</label>
             <div className="flex rounded-md shadow-sm" role="group">
                <button 
                  type="button"
                  onClick={() => setMethod('greedy')}
                  className={clsx("px-4 py-2 text-sm font-medium border rounded-l-lg", 
                    method === 'greedy' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")}
                >
                  Greedy (Max Prob)
                </button>
                <button 
                  type="button"
                  onClick={() => setMethod('random')}
                  className={clsx("px-4 py-2 text-sm font-medium border rounded-r-lg", 
                    method === 'random' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")}
                >
                  Random (Weighted)
                </button>
             </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Training Corpus</h3>
          <div className="flex space-x-2 mb-2">
            {Object.keys(PRESET_CORPORA).map((key) => (
              <button
                key={key}
                onClick={() => { setCorpus(PRESET_CORPORA[key as keyof typeof PRESET_CORPORA]); handleReset(); }}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <textarea 
            className="flex-1 w-full p-2 border border-gray-300 rounded-md text-sm font-mono resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={corpus}
            onChange={(e) => { setCorpus(e.target.value); handleReset(); }}
            placeholder="Paste text here to train the model..."
          />
        </div>
      </div>

      {/* Middle Column: Playground */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        <div className="bg-white shadow rounded-lg p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold">Generation Playground</h3>
             <div className="space-x-2">
               <button onClick={handleReset} className="p-2 text-gray-500 hover:text-gray-700" title="Reset Generated Text">
                 <RefreshCw className="w-5 h-5" />
               </button>
               <button 
                 onClick={handleGenerateStep}
                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                 <Play className="w-4 h-4 mr-2" /> Generate Next
               </button>
             </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt (Start of sentence)</label>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); handleReset(); }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 border border-gray-200 rounded-md p-4 bg-gray-50 overflow-y-auto font-mono text-lg leading-relaxed">
            <span className="text-gray-800">{prompt}</span>
            {generated.map((token, idx) => (
              <span key={idx} className="text-indigo-600 font-medium animate-fade-in">
                {token.match(/^[.,!?;:]/) ? "" : " "}{token}
              </span>
            ))}
            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse align-middle"></span>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="bg-white shadow rounded-lg p-4 h-64">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Token Probabilities</h3>
          {currentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 1]} hide />
                <YAxis type="category" dataKey="token" width={80} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={20}>
                  {currentStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No prediction available (unknown context)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
