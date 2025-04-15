import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from "./components/Footer.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

const App = () => {
  return (
      <div className="min-h-screen font-poppins flex flex-col">
          <Navigation />
          <main className="p-6 flex-grow">
              <Outlet />
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} aria-label="Notifications" limit={1} />
      </div>
  );
};

export default App;