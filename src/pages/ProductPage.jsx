import { useRef } from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";
import { useCartUpdate } from "../utils/CartContext";

const ProductPage = () => {
  const location = useLocation();
  const product = location.state;

  // Get update function
  const { addItem } = useCartUpdate();
  // Get size input
  const sizeInput = useRef();

  return (
    <div>
      <Carousel product={product} />
      <h1 className="font-medium text-[1.5rem] w-[60%] break-words">
        {product.name}
      </h1>
      <h2 className="text-[1.3rem]">${product.price.toFixed(2)}</h2>
      <select
        className="border-[1px] border-black w-full mt-4 h-[2.5rem] px-2"
        ref={sizeInput}
      >
        {product.sizes.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <button
        className="w-full mt-8 font-bold text-white bg-black h-[2.5rem]"
        onClick={() => addItem(product, sizeInput.current.value)}
      >
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductPage;
