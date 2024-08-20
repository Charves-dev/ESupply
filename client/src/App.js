import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import Main from './Main';
import DeliveryView from './DeliveryView.js';
import AdminView from './Admin.js';
import PartList from './PartList.js';
import GoodsForm from './GoodsForm.js';
import GoodsTable from './GoodsTable.js';
import ProductForm from './ProductForm.js';

function App() {
  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route path="/"             element={<Login/>} />
          <Route path="/login"        element={<Login/>} />
          <Route path="/main"         element={<Main />} />
          <Route path="/deliveryView" element={<DeliveryView />} />
          <Route path="/admin"        element={<AdminView />} />
          <Route path="/partList"     element={<PartList />} />
          <Route path="/goodsTable"   element={<GoodsTable />} />
          <Route path="/goodsForm"    element={<GoodsForm />} />
          <Route path='/productForm'  element={<ProductForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
