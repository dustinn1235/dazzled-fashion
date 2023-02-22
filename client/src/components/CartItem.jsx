import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartUpdate } from "../utils/CartContext";
import { setInputFilter } from "../utils/InputFilter";

const CartItem = ({ item }) => {
  const { removeItem, changeQty } = useCartUpdate();
  const qtyInput = useRef();

  // get current qty
  const { cart } = useCart();
  const [curQty, setCurQty] = useState(cart.get(item.name + item.size).qty);

  // check the input after ref bind to the input element
  useEffect(() => {
    setInputFilter(
      qtyInput.current,
      (value) =>
        /^\d*$/.test(value) &&
        (value === "" || (parseInt(value) <= 20 && parseInt(value) >= 1)),
      "Must be between 1 and 20"
    );
  }, [qtyInput]);

  const handleInput = (e) => {
    const value = e.target.value;
    if (value) {
      const diff = value - curQty;
      changeQty(item, value, diff);
      setCurQty(value);
    }
  };

  return (
    <div className="grid grid-rows-[0.5fr,1fr,4fr] grid-cols-[1.5fr,2fr,1.2fr] gap-x-4 w-full aspect-[1/0.5] max-h-[40vh]">
      <Link
        to={`/shop/${item.name}`}
        state={item}
        className="row-start-1 row-span-full"
      >
        <img
          src={item.imgURL[0]}
          className="h-fit max-h-full w-full object-contain aspect-[1/2]"
        ></img>
      </Link>
      <Link
        to={`/shop/${item.name}`}
        state={item}
        className="col-start-2 font-semibold text-[1rem] break-words"
      >
        {item.name}
      </Link>
      <span className="w-1/3 h-[min(2rem,70%)] col-start-2 row-start-2 font-medium text-[0.9rem]">
        Size: {item.size}
      </span>
      <span className="text-right">${(item.price * curQty).toFixed(2)}</span>
      <input
        className="border-[1px] border-black w-full mt-4 px-2 col-start-3 h-[min(2rem,70%)] text-right"
        defaultValue={curQty}
        ref={qtyInput}
        onChange={(e) => handleInput(e)}
        onBlur={(e) => {
          if (e.target.value === "") e.target.value = curQty;
        }}
      ></input>
      <button
        className="row-start-3 col-start-3 mt-auto text-end h-[min(2rem,20%)] underline"
        onClick={() => removeItem(item)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
