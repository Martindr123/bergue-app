// src/api.js
import axios from 'axios';

// Ajustez l'URL si besoin, ou utilisez process.env.REACT_APP_API_URL
// Ici on suppose que c'est votre backend déployé sur Azure :
const BASE_URL = "https://sybergueapidev01-dhf9e2bgesfdb3hc.westeurope-01.azurewebsites.net";
// Si vous testez en local, vous pouvez le changer en "http://localhost:8000"

/**
 * Lance la génération en BACKGROUND
 * Retourne un objet: { job_id: "xxxx", status: "started" }
 */
export async function initiateDocGeneration({ compte_rendu_file, description_missions, montant_provision }) {
  console.log("[initiateDocGeneration] Début de la fonction...");
  try {
    const fd = new FormData();
    fd.append('compte_rendu_file', compte_rendu_file);
    fd.append('description_missions', description_missions);
    fd.append('montant_provision', montant_provision);

    console.log("[initiateDocGeneration] Envoi de la requête POST à:", `${BASE_URL}/api/generate-doc/initiate`);
    console.log("[initiateDocGeneration] FormData:", {
      compte_rendu_file: compte_rendu_file.name,
      description_missions,
      montant_provision
    });

    const response = await axios.post(`${BASE_URL}/api/generate-doc/initiate`, fd);
    console.log("[initiateDocGeneration] Réponse reçue:", response.data);

    return response.data; 
  } catch (error) {
    console.error("[initiateDocGeneration] ERREUR:", error);
    throw error; 
  }
}

/**
 * Vérifie le statut de la génération
 * Retourne un objet: { status: "pending"|"done"|"error", error: "..." }
 */
export async function checkGenerationStatus(jobId) {
  console.log("[checkGenerationStatus] Vérification du statut pour jobId:", jobId);
  try {
    const response = await axios.get(`${BASE_URL}/api/generate-doc/status`, {
      params: { job_id: jobId }
    });
    console.log("[checkGenerationStatus] Réponse reçue:", response.data);
    return response.data;
  } catch (error) {
    console.error("[checkGenerationStatus] ERREUR:", error);
    throw error;
  }
}

/**
 * Télécharge le document généré
 * Retourne un blob (document .docx)
 */
export async function downloadGeneratedDoc(jobId) {
  console.log("[downloadGeneratedDoc] Téléchargement pour jobId:", jobId);
  try {
    const response = await axios.get(`${BASE_URL}/api/generate-doc/download`, {
      params: { job_id: jobId },
      responseType: 'blob'
    });
    console.log("[downloadGeneratedDoc] Blob reçu:", response);
    return response.data; // blob
  } catch (error) {
    console.error("[downloadGeneratedDoc] ERREUR:", error);
    throw error;
  }
}
