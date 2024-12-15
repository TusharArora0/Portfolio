import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <div className="App" style={{ 
          background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Animated gradient background */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(156, 39, 176, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(106, 27, 154, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(186, 104, 200, 0.1) 0%, transparent 60%)
            `,
            animation: 'gradientMove 15s ease infinite alternate',
            pointerEvents: 'none',
          }} />
          
          {/* Glass overlay */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none',
          }} />

          <style>
            {`
              @keyframes gradientMove {
                0% {
                  transform: translate(0, 0) scale(1);
                }
                100% {
                  transform: translate(2%, 2%) scale(1.05);
                }
              }
            `}
          </style>

          <Navbar />
          <main style={{ 
            flex: 1, 
            position: 'relative',
            zIndex: 1,
            '& > *': {
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(18, 18, 18, 0.7)',
            }
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
