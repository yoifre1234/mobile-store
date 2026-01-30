import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Header from './components/Header';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (

    <CartProvider>
      
      <Header />
      
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      
    </CartProvider>
  );
}

export default App;