const API_BASE = "http://127.0.0.1:8000";

async function request(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${endpoint}`);
  }

  return response.json();
}

export const getDashboard = () => request("/api/dashboard");

export const getSuppliers = async () => {
  const result = await request("/api/suppliers");
  return result.data ?? [];
};

export const getInventory = async () => {
  const result = await request("/api/inventory");
  return result.data ?? [];
};

export const getShipments = async () => {
  const result = await request("/api/shipments");
  return result.data ?? [];
};

export const getDisruptions = async () => {
  const result = await request("/api/disruptions");
  return result.data ?? [];
};

export const getRecoveryPlans = async () => {
  const result = await request("/api/recovery");
  return result.data ?? [];
};

export const getMapNodes = async () => {
  const result = await request("/api/maps/nodes");
  return result.data ?? [];
};

export const getMapShipments = async () => {
  const result = await request("/api/maps/shipments");
  return result.data ?? [];
};
