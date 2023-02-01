import React from "react";
import { useLocation } from "react-router-dom";

const ProductPage = () => {
  const location = useLocation();
  const product = location.state;
  console.log(product);
  return (
    <div>
      <div className="w-full mt-8 flex justify-center mb-10">
        <img src={product.imgURL} className="w-[45%] object-contain"></img>
      </div>
      <h1 className="font-bold text-[1.6rem] w-[60%] break-words">
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
