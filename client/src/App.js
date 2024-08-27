import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import Main from './Main';
import DeliveryView from './DeliveryView.js';
import AdminView from './Admin.js';
import ProductPartList from './ProductPartList.js';
import GoodsForm from './GoodsForm.js';
import GoodsTable from './GoodsTable.js';
import ProductForm from './ProductForm.js';
import OrderList from './OrderList.js';
import MyPage from './MyPage.js';
import PartList from './PartList.js';

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
          <Route path="/productPartList"     element={<ProductPartList />} />
          <Route path="/goodsTable"   element={<GoodsTable />} />
          <Route path="/goodsForm"    element={<GoodsForm />} />
          <Route path='/productForm'  element={<ProductForm />} />
          <Route path='/orderList'    element={<OrderList />} />
          <Route path='/myPage'       element={<MyPage />}/>
          <Route path='/partList'     element={<PartList />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
