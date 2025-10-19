import './App.css';
import MowvExperience from './components/MowvExperience.jsx';
import useSmoothScroll from './hooks/useSmoothScroll';

export default function App() {
  useSmoothScroll();
  return <MowvExperience />;
}
