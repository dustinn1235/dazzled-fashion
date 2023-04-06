import React from "react";
import { Link } from "react-router-dom";

const Thankyou = () => {
  return (
    <div className="w-full md:max-w-[90%] lg:max-w-[min(80%,60rem)]">
      <h1 className="font-bold text-[1.5rem] mb-4">Thank you for Shopping!</h1>
      <div>
        <p>If you want to continue shopping press the below button</p>
        <Link to="/" className="bg-black text-white mt-4 p-4 block w-fit">
          Continue browsing
        </Link>
      </div>
    </div>
  );
};

export default Thankyou;