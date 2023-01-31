import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Link to={`/shop/${product.name}`} state={product}>
      <div className="flex justify-center h-[30vh] md:h-[40vh]">
        <img
          src={product.imgURL}
          className="h-full max-w-[90%] object-contain"
        ></img>
      </div>
      <h1 className="text-xl text-center mt-6">{product.name}</h1>
      <span className="text-lg text-center block">
        ${product.price.toFixed(2)}
      </span>
    </Link>
  );
};

export default Product;
