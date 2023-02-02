import { useState } from "react";

const Carousel = ({ product }) => {
  // get more image from API
  const imgs = ["/rick1.webp", "/rick2.webp", "/rick3.webp"];
  const [curIndex, setCurIndex] = useState(0);
  const translateX = -100;

  const buttonHandle = (direction) => {
    if (direction === 1 && curIndex === imgs.length - 1) {
      setCurIndex(0);
    } else if (direction === -1 && curIndex === 0) {
      setCurIndex(imgs.length - 1);
    } else setCurIndex(curIndex + direction);
  };

  return (
    <>
      <div
        className={`flex w-full aspect-square transition ease-in-out duration-200 translate-x-[${
          curIndex * translateX
        }%]`}
      >
        {imgs.map((e) => (
          <div className="min-w-full flex justify-center" key={e}>
            <img
              src={e}
              className="w-[50%] max-h-full object-contain"
              alt={product.name}
            ></img>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center text-center gap-[2%] text-[1.5rem] my-4">
        {imgs.map((e, i) => (
          <button
            key={i}
            className={`w-[2%] aspect-square bg-zinc-400 rounded-full transition duration-300 ${
              i === curIndex && "bg-zinc-600"
            }`}
          ></button>
        ))}
      </div>

      <button className="w-1/2 bg-green-300 " onClick={() => buttonHandle(-1)}>
        {curIndex}
      </button>
      <button className="w-1/2 bg-red-300" onClick={() => buttonHandle(1)}>
        right
      </button>
    </>
  );
};

export default Carousel;
