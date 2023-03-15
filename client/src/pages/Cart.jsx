import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import Modal from "../components/Modal";
import { useCart, useCartUpdate } from "../utils/CartContext";

const Cart = () => {
  const { cart } = useCart();
  const { changeQty, resetCart } = useCartUpdate();
  const itemArr = Array.from(cart.keys());
  // use to set a modal when submitting order
  const [showModal, setShowModal] = useState(false);
  // use to set loading modal when submitting order
  const [isLoading, setIsLoading] = useState(false);
  // use to display confirmation message
  const [isFetchSuccess, setIsFetchSuccess] = useState(false);

  // calculate sub total of current
  const calculateTotal = () => {
    let total = 0;
    for (const [_, value] of cart) {
      total += value.price * value.qty;
    }
    return total;
  };
  const total = useMemo(() => calculateTotal(), [cart]);

  const sendOrder = async (data) => {
    // show message modal
    setShowModal(!showModal);
    setIsLoading(true);
    const URL = "http://localhost/api/addOrder";
    const res = await fetch(URL, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setTimeout(() => setIsLoading(false), 200);

    // if not enough in stock
    if (res.status !== 200) {
      // update cart qty
      const msg = await res.json();
      for (const e in msg) {
        const diff = msg[e] - cart.get(e).qty;
        changeQty(cart.get(e), msg[e], diff);
      }
    } else {
      // Order complete
      setIsFetchSuccess(true);
      // reset cart
      resetCart();
      console.log("Success");
    }
  };

  const handleOrderSubmit = () => {
    // create obj to post to database
    const obj = {};
    obj.userName = "test_user";
    obj.subTotal = total;
    obj.date = new Date();
    // Add every time in cart
    obj.items = [];
    for (const key of cart.keys()) {
      const itemJSON = {};
      const value = cart.get(key);
      itemJSON.name = value.name;
      itemJSON.price = value.price;
      itemJSON.qty = value.qty;
      itemJSON.size = value.size;
      obj.items.push(itemJSON);
    }
    sendOrder(obj);
  };

  return (
    <div className="w-full md:max-w-[90%] lg:max-w-[min(80%,60rem)]">
      <h1 className="font-bold text-[1.5rem] mb-4">Shopping Cart</h1>
      {itemArr.length === 0 ? (
        <div>
          <p>Your shopping cart is empty</p>
          <Link to="/" className="bg-black text-white mt-4 p-4 block w-fit">
            Continue browsing
          </Link>
        </div>
      ) : (
        <div>
          <div className="grid gap-10 max-h-[50vh] overflow-auto scrollbar-hide pt-4 border-t-2">
            {itemArr.map((e) => (
              <CartItem item={cart.get(e)} key={e} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2">
            <p className="text-[0.8rem] mb-3 mt-2">
              Shipping & taxes calculated at checkout
            </p>
            <div className="flex w-full">
              <p className="font-semibold">Subtotal</p>
              <p className="ml-auto font-semibold">${total.toFixed(2)}</p>
            </div>
            <button
              className="bg-black text-white w-full h-[2.5rem] mt-3 font-bold"
              onClick={handleOrderSubmit}
            >
              CHECK OUT
            </button>
          </div>
        </div>
      )}
      <Modal
        hidden={showModal}
        setHidden={setShowModal}
        isLoading={isLoading}
        isFetchSuccess={isFetchSuccess}
      ></Modal>
    </div>
  );
};

export default Cart;
