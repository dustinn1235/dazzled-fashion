import React, { useEffect, useState } from "react";
import Products from "../components/Products";

const loadBalancers = ["http://localhost:80", "http://localhost:81"];
let currentLoadBalancer = 0;

const fetchWithLoadBalancerHealthCheck = async (url, options = {}) => {
  try {
    const response = await fetch(`${loadBalancers[currentLoadBalancer]}${url}`, options);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error.message.startsWith("Failed to fetch") && currentLoadBalancer === 0) {
      console.log(`Error from load balancer ${loadBalancers[currentLoadBalancer]}`);
      currentLoadBalancer = (currentLoadBalancer + 1) % loadBalancers.length;
      console.log("Switching to load balancer:", loadBalancers[currentLoadBalancer]);
      const fallbackResponse = await fetch(`${loadBalancers[currentLoadBalancer]}${url}`, options);
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback server error: ${fallbackResponse.status}`);
      }
      return fallbackResponse;
    } else {
      throw error;
    }
  }
};

const loadBalancerHealthCheck = async () => {
  try {
    // Check the health of the primary load balancer
    const primaryResponse = await fetch(`${loadBalancers[0]}/lb-health-check`);

    // If the primary load balancer is healthy and the current load balancer is the backup, switch back to the primary
    if (primaryResponse.ok && currentLoadBalancer !== 0) {
      console.log("Primary load balancer is healthy again. Switching back.");
      currentLoadBalancer = 0;
    }
  } catch (error) {
    // If the primary load balancer is down and the current load balancer is the primary, switch to the backup
    if (currentLoadBalancer === 0) {
      console.log("Primary load balancer is down. Using backup load balancer.");
      currentLoadBalancer = 1;
    }
  }
};


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
