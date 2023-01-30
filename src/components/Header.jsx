const Header = () => {
  return (
    <div className="flex cursor-crosshair mb-20">
      <span className="flex-1 font-bold text-lg grid items-center">MENU</span>
      <div className="flex-1 flex justify-center">
        <img
          src="/logo.png"
          className="w-full h-full object-cover md:w-1/2 pointer-events-none"
        ></img>
      </div>
      <span className="flex-1 text-end font-bold text-lg grid items-center">
        CART (0)
      </span>
    </div>
  );
};

export default Header;
