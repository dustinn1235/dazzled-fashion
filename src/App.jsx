import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductPage from "./pages/ProductPage";
import Shop from "./pages/Shop";

/* TODO
- Change Menu/Cart into icons
- Create page for each product
- Design product page
  - Instagram carousel
    - Dot
- Design cart page
- Create payment page
- Add footer
*/

function App() {
  return (
    <div className="w-screen px-4 py-10 md:px-6 flex flex-col items-center font-montserrat overflow-x-hidden">
      <Header />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
}

export default App;
