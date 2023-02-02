import React from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";

const ProductPage = () => {
  const location = useLocation();
  const product = location.state;
  return (
    <div>
      <Carousel product={product} />
      <h1 className="font-medium text-[1.5rem] w-[60%] break-words">
        {product.name}
      </h1>
      <h2 className="text-[1.3rem]">${product.price.toFixed(2)}</h2>
      <select className="border-[1px] border-black w-full mt-4 h-[2.5rem] px-2">
        <option value="s">S</option>
        <option value="m">M</option>
        <option value="l">L</option>
      </select>
      <input
        className="border-[1px] border-black w-full mt-4 h-[2.5rem] px-2"
        placeholder="Quantity"
      ></input>
      <button className="w-full mt-8 font-bold text-white bg-black h-[2.5rem]">
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductPage;
