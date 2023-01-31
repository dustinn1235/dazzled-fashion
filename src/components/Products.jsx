import Product from "./Product";

const Products = () => {
  const items = [
    {
      name: "TESTNAME1",
      price: 10,
      imgURL: "/test.webp",
    },
    {
      name: "TESTNAME2",
      price: 10,
      imgURL: "/rick1.webp",
    },
    {
      name: "TESTNAME3",
      price: 10,
      imgURL: "/test3.webp",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-14 md:grid-cols-3 lg:w-[80%]">
      {items.map((e) => (
        <Product product={e} key={e.name} />
      ))}
    </div>
  );
};
export default Products;
