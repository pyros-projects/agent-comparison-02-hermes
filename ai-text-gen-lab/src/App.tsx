import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NGramLab } from './pages/NGramLab';
import { GeneticLab } from './pages/GeneticLab';
import { MysteryLab } from './pages/MysteryLab';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ngram" element={<NGramLab />} />
          <Route path="/genetic" element={<GeneticLab />} />
          <Route path="/mystery" element={<MysteryLab />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
