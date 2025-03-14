// src/api.js
import axios from 'axios';

// Ajustez l'URL si besoin, par exemple lisez process.env.REACT_APP_API_URL
const BASE_URL = "https://sybergueapidev01-dhf9e2bgesfdb3hc.westeurope-01.azurewebsites.net";

// 1) INITIER
export async function initiateDocGeneration({ compte_rendu_file, description_missions, montant_provision }) {
  const fd = new FormData();
  fd.append('compte_rendu_file', compte_rendu_file);
  fd.append('description_missions', description_missions);
  fd.append('montant_provision', montant_provision);

  // POST /initiate -> { job_id: "xxx", status: "started" }
  const response = await axios.post(`${BASE_URL}/api/generate-doc/initiate`, fd);
  return response.data; 
}

// 2) VERIFIER STATUT
export async function checkGenerationStatus(jobId) {
  // GET /status?job_id=xxx -> { status: "pending"/"done"/"error", error: "..."}
  const response = await axios.get(`${BASE_URL}/api/generate-doc/status`, {
    params: { job_id: jobId }
  });
  return response.data;
}

// 3) TELECHARGER
export async function downloadGeneratedDoc(jobId) {
  // GET /download?job_id=xxx
  const response = await axios.get(`${BASE_URL}/api/generate-doc/download`, {
    params: { job_id: jobId },
    responseType: 'blob'
  });
  return response.data; // blob
}
