import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../utils/CartContext";

const Cart = () => {
  const { cart } = useCart();
  const itemArr = Array.from(cart.keys());
  return (
    <div className="w-full">
      <h1 className="font-bold text-[1.5rem] mb-8">Shopping Cart</h1>
      {itemArr.length === 0 ? (
        <div>
          <p>Your shopping cart is empty</p>
          <Link to="/" className="bg-black text-white mt-4 p-4 block w-fit">
            Continue browsing
          </Link>
        </div>
      ) : (
        <div className="grid gap-10">
          {itemArr.map((e) => (
            <CartItem item={cart.get(e)} key={e} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
