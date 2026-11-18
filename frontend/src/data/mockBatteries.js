
/*
  ReVolt - Battery Assessment Data

  Sample output provided by our trained ML model.
  Future assessment records will come from Flask.
*/

export const sampleAssessment = {
  batteryId: "B0047",

  referenceCapacityAh: 1.674,

  predictedCapacityAh: 1.617,

  sohPercent: 96.56,

  healthStatus: "Healthy",

  secondLifeScreening: {
    status: "Eligible",
    type: "Preliminary",
  },

  predictionSource: "ML model",

  dataSource: "Recorded discharge-cycle features",
};

// No additional battery predictions are fabricated.
export const mockBatteries = [];

// Converts Flask response fields into the format
// expected by the React frontend.
export function normalizeAssessment(data) {
  return {
    batteryId: data.batteryId ?? data.battery_id,

    referenceCapacityAh:
      data.referenceCapacityAh ?? data.reference_capacity_ah,

    predictedCapacityAh:
      data.predictedCapacityAh ?? data.predicted_capacity_ah,

    sohPercent:
      data.sohPercent ?? data.soh_percent,

    healthStatus:
      data.healthStatus ?? data.health_status,

    secondLifeScreening:
      data.secondLifeScreening ?? data.second_life_screening,

    predictionSource: "ML model",

    dataSource: "Recorded discharge-cycle features",
  };
}
