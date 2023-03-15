import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";
import { useCartUpdate } from "../utils/CartContext";
import {fetchWithLoadBalancerHealthCheck, loadBalancerHealthCheck} from "../utils/loadBalancerUtils";


const ProductPage = () => {
  const location = useLocation();
  const product = location.state;
  const [qty, setQty] = useState({});
  // use to set disable add to bag button when item is out of stock
  const [disabled, setDisabled] = useState(false);

  // fetch the qty of the item. Example response
  // {
  //   S: 5,
  //   M: 2
  // }
  const fetchQty = async () => {
    try {
      const url = `/api/qty/${product.name}`;
      console.log("fetching qty" + url);
      const res = await fetchWithLoadBalancerHealthCheck(url);
      const qty = await res.json();
      setQty(qty);
    } catch (error) {
      console.error("Error fetching quantity data:", error.message);
    }
  };

  // Get update function
  const { addItem } = useCartUpdate();
  // Get size input
  const sizeInput = useRef();

  // toggle disabled add to cart button if user choose an item out of stock
  const handleSizeChange = () => {
    const value = sizeInput.current.value[0];
    qty[value] === 0 ? setDisabled(true) : setDisabled(false);
  };

  useEffect(() => {
    fetchQty();
  }, []);

  // use to read value of sizeinput on page load. We need to figure if the first value is out of stock to toggle the button
  useEffect(() => {
    const value = sizeInput.current.value[0];
    qty[value] === 0 ? setDisabled(true) : setDisabled(false);
    const healthCheckInterval = setInterval(loadBalancerHealthCheck, 3000); // Check every 5 seconds
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [sizeInput.current?.value]);

  return (
    <div className="md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] md:grid grid-cols-[1.5fr,2fr] gap-x-2">
      <Carousel product={product} />
      <div>
        <h1 className="font-medium text-[1.5rem] w-[60%] break-words">
          {product.name}
        </h1>
        <h2 className="text-[1.3rem]">${product.price.toFixed(2)}</h2>
        <select
          className="border-[1px] border-black w-full mt-4 h-[2.5rem] px-2"
          ref={sizeInput}
          onChange={handleSizeChange}
        >
          {product.sizes.map((e, i) => {
            if (qty[e] !== 0) {
              return (
                <option key={e} value={e}>
                  {e}
                </option>
              );
            } else {
              return (
                <option key={e} value={null}>
                  {e} - OUT OF STOCK
                </option>
              );
            }
          })}
        </select>
        <button
          className="w-full mt-8 font-bold text-white bg-black h-[2.5rem]"
          onClick={() => addItem(product, sizeInput.current.value)}
          disabled={disabled}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
