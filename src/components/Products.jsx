import Product from "./Product";

const Products = () => {
  const items = [
    {
      name: "test1",
      price: 10,
      imgURL: "/test3.webp",
    },
    {
      name: "test2",
      price: 10,
      imgURL: "/test2.webp",
    },
  ];
  return (
    <div className="flex flex-col">
      {items.map((e) => (
        <Product {...e} />
      ))}
    </div>
  );
};
export default Products;
