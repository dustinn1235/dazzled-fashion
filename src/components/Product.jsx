const Product = ({ name, price, imgURL }) => {
  return (
    <div>
      <div className="flex justify-center h-[30vh] md:h-[40vh]">
        <img src={imgURL} className="h-full max-w-[90%] object-contain"></img>
      </div>
      <h1 className="text-xl text-center mt-6">{name}</h1>
      <span className="text-lg text-center block">${price.toFixed(2)}</span>
    </div>
  );
};

export default Product;
