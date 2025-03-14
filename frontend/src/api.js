// src/api.js
import axios from 'axios';

// Ajuste si tu veux pointer sur une URL différente 
// (par exemple un proxy, ou un nom de domaine).
// En local, si FastAPI tourne sur http://localhost:8000:
//const BASE_URL = process.env.REACT_APP_API_URL;
const BASE_URL = "https://sybergueapidev01-dhf9e2bgesfdb3hc.westeurope-01.azurewebsites.net"
export async function generateDoc({
  compte_rendu_file,
  description_missions,
  montant_provision
  
}) {
  // Construire le FormData pour l'envoi du fichier + champs
  const fd = new FormData();
  fd.append('compte_rendu_file', compte_rendu_file);
  fd.append('description_missions', description_missions);
  fd.append('montant_provision', montant_provision);
  

  // Appeler l'endpoint FastAPI
  const response = await axios.post(`${BASE_URL}/api/generate-doc`, fd, {
    responseType: 'blob'
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  });

  // On retourne le blob pour que MissionPage.js puisse le télécharger
  return response.data; 
}
