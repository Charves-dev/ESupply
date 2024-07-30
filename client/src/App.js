import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import Main from './Main';
import DeliveryView from './DeliveryView.js';
import AdminView from './Admin.js';
import PartList from './PartList.js';

function App() {
  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/main" element={<Main />} />
          <Route path="/deliveryView" element={<DeliveryView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/partList" element={<PartList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
