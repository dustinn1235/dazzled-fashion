import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductPage from "./pages/ProductPage";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import { CartProvider } from "./utils/CartContext";
import Footer from "./components/Footer";

/* TODO
- Change Menu/Cart into icons
- Create page for each product
- Design product page
  - Instagram carousel
    - Dot
    - Add swipe event
  - Quantity input validation
- Design cart page
- Create payment page
- Add footer
*/

function App() {
  return (
    <CartProvider>
      <div className="w-screen px-4 py-10 md:px-6 flex flex-col items-center font-montserrat overflow-x-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
