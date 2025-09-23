import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {

  return (

    <BrowserRouter>
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AnimatedRoutes>
          <Routes>
         <Route path="/" element={<MainScreen />} />
          <Route path="/detail" element={<DetailScreen />} />
            {/* Другие роуты */}
          </Routes>
        </AnimatedRoutes>
      </div>
    </BrowserRouter>
  );
}

export default App;