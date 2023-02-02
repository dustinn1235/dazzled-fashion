import { useState } from "react";

const Carousel = ({ product }) => {
  // get more image from API
  const imgs = ["/rick1.webp", "/rick2.webp", "/rick3.webp"];
  const [curIndex, setCurIndex] = useState(0);
  const translateX = -100;

  const buttonHandle = () => {
    if (curIndex == imgs.length - 1) {
      setCurIndex(0);
    } else setCurIndex(curIndex + 1);
  };

  return (
    <>
      <div
        className={`flex w-full transition ease-in-out duration-200 translate-x-[${
          curIndex * translateX
        }%]`}
        // className={`flex w-full transition ease-in-out duration-200 translate-x-[-200%]`}
      >
        {imgs.map((e) => (
          <div className="min-w-full flex justify-center mb-10" key={e}>
            <img src={e} className="w-[45%] object-contain"></img>
          </div>
        ))}
      </div>
      <button className="w-1/2 bg-green-300" onClick={() => buttonHandle()}>
        {curIndex}
      </button>
      <button className="w-1/2 bg-red-300">right</button>
    </>
  );
};

export default Carousel;
