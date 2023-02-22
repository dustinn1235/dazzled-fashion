import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const Carousel = ({ product }) => {
  const imgs = product.imgURL;
  const [curIndex, setCurIndex] = useState(0);
  const translateX = -100;

  const buttonHandle = (direction) => {
    if (direction === 1 && curIndex === imgs.length - 1) {
      setCurIndex(0);
    } else if (direction === -1 && curIndex === 0) {
      setCurIndex(imgs.length - 1);
    } else setCurIndex(curIndex + direction);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => buttonHandle(1),
    onSwipedRight: () => buttonHandle(-1),
  });

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-full aspect-square transition ease-in-out duration-200`}
        style={{ transform: `translateX(${curIndex * translateX}%)` }}
        {...swipeHandlers}
      >
        {imgs.map((e) => (
          <div className="min-w-full flex justify-center" key={e}>
            <img
              src={e}
              className="max-w-[70%] max-h-full object-contain"
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
    </div>
  );
};

export default Carousel;
