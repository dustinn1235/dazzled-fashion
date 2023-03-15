export const loadBalancers = ["http://localhost:80", "http://localhost:81"];
let currentLoadBalancer = 0;

export const fetchWithLoadBalancerHealthCheck = async (url, options = {}) => {
  try {
    const response = await fetch(
      `${loadBalancers[currentLoadBalancer]}${url}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (
      error.message.startsWith("Failed to fetch") &&
      currentLoadBalancer === 0
    ) {
      console.log(
        `Error from load balancer ${loadBalancers[currentLoadBalancer]}`
      );
      currentLoadBalancer = (currentLoadBalancer + 1) % loadBalancers.length;
      console.log(
        "Switching to load balancer:",
        loadBalancers[currentLoadBalancer]
      );
      const fallbackResponse = await fetch(
        `${loadBalancers[currentLoadBalancer]}${url}`,
        options
      );
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback server error: ${fallbackResponse.status}`);
      }
      return fallbackResponse;
    } else {
      throw error;
    }
  }
};

export const loadBalancerHealthCheck = async () => {
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
