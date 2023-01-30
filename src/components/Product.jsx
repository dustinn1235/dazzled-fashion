const Product = ({ name, price, imgURL }) => {
  return (
    <div className="bg-red-50 flex justify-center">
      <img src={imgURL} className="w-[40%]"></img>
    </div>
  );
};

export default Product;
