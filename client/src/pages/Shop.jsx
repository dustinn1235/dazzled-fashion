import React, { useEffect, useState } from "react";
import Products from "../components/Products";
import {fetchWithLoadBalancerHealthCheck, loadBalancerHealthCheck} from "../utils/loadBalancerUtils";


const Shop = () => {
  const [items, setItems] = useState([]);
  const fetchItemsData = async () => {
    try {
      const res = await fetchWithLoadBalancerHealthCheck("/api/items");
      const items = await res.json();
      setItems(items);
    } catch (error) {
      console.error("Error fetching items data:", error.message);
    }
  };

  useEffect(() => {
    fetchItemsData();
    const healthCheckInterval = setInterval(loadBalancerHealthCheck, 3000); // Check every 5 seconds

    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);

  return (
    <div className="flex justify-center w-full">
      <Products items={items} />
    </div>
  );
};

export default Shop;
