import axios from "axios";

export async function requestMockGPTSummaryFunction() {
  const url =
    "https://q6aff9rpt2.execute-api.eu-central-1.amazonaws.com/default/ct-ai-step-mock-gpt";

  try {
    console.log("Making GET request to:", url);
    const response = await axios.get(url);
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
  }
}