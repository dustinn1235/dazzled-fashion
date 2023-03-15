import React, { useEffect, useState } from "react";
import Products from "../components/Products";

const Shop = () => {
  const [items, setItems] = useState([]);
  const fetchItemsData = async () => {
    const URL = "http://localhost:80/api/items";
    const res = await fetch(URL);
    const items = await res.json();
    setItems(items);
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  return (
    <div className="flex justify-center w-full">
      <Products items={items} />
    </div>
  );
};

export default Shop;




