import { Link } from 'react-router-dom';
import { Beaker, Dna, HelpCircle, ArrowRight } from 'lucide-react';

const FeatureCard = ({ to, icon: Icon, title, description }: { to: string, icon: any, title: string, description: string }) => (
  <Link to={to} className="block group">
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-200 transition-colors">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-500 mb-4 flex-grow">{description}</p>
      <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
        Start Experimenting <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  </Link>
);

export const Home = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Discover How AI Writes
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Before ChatGPT, how did computers generate text? Explore the fundamental algorithms through interactive experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          to="/ngram"
          icon={Beaker}
          title="N-Gram Lab"
          description="See how counting words leads to simple predictions. The foundation of probability in language models."
        />
        <FeatureCard
          to="/genetic"
          icon={Dna}
          title="Genetic Text Lab"
          description="Watch text 'evolve' from random gibberish to meaningful sentences using biological principles."
        />
        <FeatureCard
          to="/mystery"
          icon={HelpCircle}
          title="Sampling Lab"
          description="Control the 'creativity' of a model. Learn about temperature and how we choose the next word."
        />
      </div>

      <div className="bg-indigo-50 rounded-2xl p-8 sm:p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why learn this?</h2>
        <p className="text-gray-600 text-lg">
          Modern Large Language Models (LLMs) are incredibly complex, but they stand on the shoulders of these simpler ideas. 
          Understanding N-grams helps you grasp "context window" and "next token prediction". 
          Genetic algorithms show how optimization works. 
          Sampling strategies explain why AI sometimes hallucinates or gets creative.
        </p>
      </div>
    </div>
  );
};
