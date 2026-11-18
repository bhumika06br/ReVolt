
import { normalizeAssessment } from "../data/mockBatteries";

// Flask backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

// Proposed endpoints.
// Update these when the backend teammate confirms the routes.
const API_ENDPOINTS = {
  batteries: "/api/batteries",
  details: (id) => `/api/batteries/${id}`,
  assessment: (id) => `/api/batteries/${id}/assessment`,
  history: (id) => `/api/batteries/${id}/history`,
  simulation: "/api/simulate",
};

// Common API request function
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Get all batteries
export async function getBatteries() {
  return apiRequest(API_ENDPOINTS.batteries);
}

// Get battery details
export async function getBatteryDetails(id) {
  return apiRequest(API_ENDPOINTS.details(id));
}

// Get ML battery assessment
export async function analyzeBattery(id) {
  const result = await apiRequest(
    API_ENDPOINTS.assessment(id),
    { method: "POST" }
  );

  return normalizeAssessment(result);
}

// Get battery health history
export async function getBatteryHistory(id) {
  return apiRequest(API_ENDPOINTS.history(id));
}

// Run energy simulation
export async function runEnergySimulation(data) {
  return apiRequest(API_ENDPOINTS.simulation, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
