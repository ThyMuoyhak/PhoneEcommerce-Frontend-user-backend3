import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SlideShow from './components/SlideShow';
import Category from './components/Category';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Shop from './pages/Shop';
import Deals from './pages/Deals';
import Support from './pages/Support';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';


function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-16">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <SlideShow />
                                <Category />
                                <Products />
                            </>
                        } />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/deals" element={<Deals />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<Checkout />} />
                        
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </div>
                <Footer></Footer>
            </div>
        </Router>
    );
}

export default App;