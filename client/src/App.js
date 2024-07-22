import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import Main from './Main';

function App() {
  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
