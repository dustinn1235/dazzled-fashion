import Product from "./Product";

const Products = () => {
  const items = [
    {
      name: "TESTNAME",
      price: 10,
      imgURL: "/test.webp",
    },
    {
      name: "TESTNAME",
      price: 10,
      imgURL: "/test3.webp",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-x-2">
      {items.map((e) => (
        <Product {...e} />
      ))}
    </div>
  );
};
export default Products;
