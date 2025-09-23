import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/detail" element={<DetailScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;