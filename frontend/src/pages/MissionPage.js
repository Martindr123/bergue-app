// src/pages/MissionPage.js
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth0 } from '@auth0/auth0-react';

import {
  initiateDocGeneration,
  checkGenerationStatus,
  downloadGeneratedDoc
} from '../api';

function MissionPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const [file, setFile] = useState(null);
  const [descriptionMissions, setDescriptionMissions] = useState('');
  const [montantProvision, setMontantProvision] = useState('');

  // Gestion du job
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null); // "pending", "done", "error", null
  const [errorMessage, setErrorMessage] = useState(null);

  // Pour afficher un spinner ou bloquer le bouton
  const [isLoading, setIsLoading] = useState(false);

  // pollingRef => pour arrêter le setInterval
  const pollingRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container">
          <h2>Vous devez être connecté pour accéder à cette page</h2>
          <button
            type="submit"
            className="submit-btn"
            onClick={loginWithRedirect}
          >
            Se connecter
          </button>
        </div>
      </Layout>
    );
  }

  // Handle form submission => on initie la génération
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[MissionPage] handleSubmit déclenché");

    if (!file) {
      alert('Veuillez sélectionner un fichier (compte rendu de réunion)');
      return;
    }

    try {
      setIsLoading(true);
      setJobId(null);
      setJobStatus(null);
      setErrorMessage(null);

      console.log("[MissionPage] Appel à initiateDocGeneration...");
      const result = await initiateDocGeneration({
        compte_rendu_file: file,
        description_missions: descriptionMissions,
        montant_provision : montantProvision
      });
      // result => { job_id: "xxx", status: "started" }
      console.log("[MissionPage] initiateDocGeneration -> result:", result);

      setJobId(result.job_id);
      setJobStatus("pending");

      // Lancer un polling pour checker le statut toutes les 5s
      console.log("[MissionPage] Lancement du polling setInterval");
      pollingRef.current = setInterval(async () => {
        try {
          console.log("[MissionPage] Polling du statut pour jobId =", result.job_id);
          const statusData = await checkGenerationStatus(result.job_id);
          console.log("[MissionPage] checkGenerationStatus ->", statusData);

          setJobStatus(statusData.status);

          if (statusData.status === "done") {
            console.log("[MissionPage] Job terminé -> on arrête le polling");
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsLoading(false);
          } else if (statusData.status === "error") {
            console.warn("[MissionPage] Job en erreur:", statusData.error);
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsLoading(false);
            setErrorMessage(statusData.error);
          }
        } catch (pollErr) {
          console.error("[MissionPage] Erreur lors du polling:", pollErr);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsLoading(false);
          setErrorMessage("Erreur lors du polling de statut");
        }
      }, 5000);

    } catch (error) {
      console.error("[MissionPage] Erreur lors de l'init de génération:", error);
      alert("Erreur lors de l'initialisation de la génération");
      setIsLoading(false);
    }
  };

  // Nettoyer le setInterval si on démonte le composant
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        console.log("[MissionPage] Nettoyage du setInterval");
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Téléchargement quand le job est "done"
  const handleDownload = async () => {
    console.log("[MissionPage] handleDownload déclenché pour jobId:", jobId);
    if (!jobId) {
      console.warn("[MissionPage] Pas de jobId, téléchargement impossible.");
      return;
    }
    try {
      const blob = await downloadGeneratedDoc(jobId);
      console.log("[MissionPage] Blob récupéré, on force le téléchargement...");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lettre_mission_${jobId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[MissionPage] Erreur lors du téléchargement:", err);
      alert("Erreur lors du téléchargement du document");
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Générer une lettre de mission</h1>

        {/* Formulaire */}
        {!jobStatus && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Compte-rendu de réunion :</label>
              <div
                className="dropzone"
                onClick={() => {
                  document.getElementById('fileInput').click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  setFile(droppedFile);
                  console.log("[MissionPage] Fichier déposé via onDrop:", droppedFile);
                }}
              >
                {file
                  ? `Fichier sélectionné : ${file.name}`
                  : 'Glissez-déposez le fichier ici ou cliquez pour le sélectionner'}
              </div>
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                    console.log("[MissionPage] Fichier sélectionné via input:", e.target.files[0]);
                  }
                }}
                accept=".txt,.doc,.docx,.pdf"
                required
              />
            </div>

            <div className="form-group">
              <label>Court descriptif des missions :</label>
              <textarea
                rows="5"
                value={descriptionMissions}
                onChange={(e) => setDescriptionMissions(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Montant de la provision :</label>
              <input
                type="text"
                value={montantProvision}
                onChange={(e) => setMontantProvision(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              Lancer la génération
            </button>
          </form>
        )}

        {/* Si jobStatus est "pending" => on affiche l'attente */}
        {jobStatus === "pending" && (
          <div style={{ marginTop: '20px' }}>
            <div className="loading-spinner-container">
              <div className="spinner"></div>
            </div>
            <p>La génération est en cours. Veuillez patienter...</p>
          </div>
        )}

        {/* Si jobStatus est "done" => proposer de télécharger */}
        {jobStatus === "done" && (
          <div style={{ marginTop: '20px' }}>
            <p>La lettre de mission est prête&nbsp;!</p>
            <button onClick={handleDownload} className="submit-btn">
              Télécharger la lettre
            </button>
          </div>
        )}

        {/* Si jobStatus === "error" => afficher l'erreur */}
        {jobStatus === "error" && (
          <div style={{ marginTop: '20px', color: 'red' }}>
            <p>Une erreur est survenue&nbsp;: {errorMessage}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MissionPage;
