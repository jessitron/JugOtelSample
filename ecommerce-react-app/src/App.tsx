import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default App;