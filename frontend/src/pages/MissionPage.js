import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateDoc } from '../api';
import { useAuth0 } from '@auth0/auth0-react';

function MissionPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const [file, setFile] = useState(null);
  const [descriptionMissions, setDescriptionMissions] = useState('');
  const [montantProvision, setMontantProvision] = useState('');

  // État pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Veuillez sélectionner un fichier (compte rendu de réunion)');
      return;
    }

    try {
      setIsLoading(true);
      // const token = await getAccessTokenSilently({ audience: "bergue-api" });
      const responseBlob = await generateDoc({
        compte_rendu_file: file,
        description_missions: descriptionMissions,
        montant_provision: montantProvision
      } //, token
      );

      // Télécharger le fichier
      const url = window.URL.createObjectURL(responseBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lettre_mission.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération');
    } finally {
      // Quel que soit le résultat (succès ou échec),
      // on repasse l'état à false
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Générer une lettre de mission</h1>

        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Veuillez patienter, génération en cours...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Champ pour le fichier (compte rendu de réunion) */}
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
                  }
                }}
                accept=".txt,.doc,.docx,.pdf"
                required
              />
            </div>

            {/* Champ pour la description des missions */}
            <div className="form-group">
              <label>Court descriptif des missions :</label>
              <textarea
                rows="5"
                value={descriptionMissions}
                onChange={(e) => setDescriptionMissions(e.target.value)}
                required
              />
            </div>

            {/* Champ pour le montant de la provision */}
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
              Générer la lettre
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default MissionPage;
