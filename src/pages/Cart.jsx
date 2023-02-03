const Cart = () => {
  return (
    <div className="w-full">
      <h1 className="font-bold text-[1.5rem] mb-8">Shopping Cart</h1>
      <div className="grid gap-10">
        <div className="grid grid-rows-[0.5fr,1fr,4fr] grid-cols-[1.5fr,2fr,1.2fr] gap-x-4 w-full aspect-[1/0.5]">
          <img
            src="/rick1.webp"
            className="row-start-1 row-span-full h-fit max-h-full w-full object-contain aspect-[1/2]"
          ></img>
          <h1 className="col-start-2 font-semibold text-[1.1rem] w-[60%] break-words">
            Name
          </h1>
          <select className="w-1/3 h-[min(2rem,70%)] col-start-2 row-start-2 font-medium">
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
          </select>
          <span className="text-right">$10.00</span>
          <input className="border-[1px] border-black w-full mt-4 px-2 col-start-3 h-[min(2rem,70%)]"></input>
          <button className="row-start-3 col-start-3 mt-auto text-end h-[min(2rem,20%)] underline">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
