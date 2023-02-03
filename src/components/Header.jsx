import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

const Header = () => {
  const { numItem } = useCart();
  return (
    <div className="flex cursor-crosshair mb-20">
      <span className="flex-1 font-bold text-lg grid items-center">MENU</span>
      <Link to="/" className="flex-1 flex justify-center">
        <img
          src="/logo.png"
          className="w-full h-full object-cover md:w-1/2 pointer-events-none"
        ></img>
      </Link>
      <div className="flex-1 font-bold text-lg grid items-center">
        <Link to="/cart" className="w-fit justify-self-end">
          CART ({numItem})
        </Link>
      </div>
    </div>
  );
};

export default Header;

/* <div className="flex-1 flex items-center justify-end gap-2">
  <Link to="/cart" className="relative mr-4">
    <AiOutlineShoppingCart className="text-5xl" />
    <span className="absolute bg-black rounded-[50%] w-1/2 aspect-square text-white text-center top-0 right-[-25%]">
      {numItem}
    </span>
  </Link>
</div>; */
