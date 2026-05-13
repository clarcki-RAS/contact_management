import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import pour la navigation
//import axios from "axios";
import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface KeyVerificationProps {
  onVerificationFail: () => void; // Appelé si la clé est incorrecte
  onVerificationSuccess: () => void; // Appelé si la clé est correcte
}

const KeyVerification: React.FC<KeyVerificationProps> = ({ onVerificationFail }) => {
  const [securityKey, setSecurityKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Hook pour la navigation

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityKey(event.target.value);
    setError(""); // Réinitialiser l'erreur à chaque modification
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = true//await axios.post("/api/verify-key/", { key: securityKey });  response.data.success
      if (response==true) {
        // Redirige vers la page LoginForm
        navigate("/Login-forms");
      } else {
        setError("Clé incorrecte. Veuillez réessayer.");
        onVerificationFail();
      }
    } catch (err) {
      console.error("Erreur lors de la vérification :", err);
      setError("Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.");
    }
  };

  return (
    <div className="relative">
      <DialogTitle>
        Entrer la clé de sécurité
        <Button
          onClick={onVerificationFail}
          color="inherit"
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          &times;
        </Button>
      </DialogTitle>
      <form onSubmit={handleFormSubmit}>
        <DialogContent className="pt-4 pb-4 flex-grow">
          <Typography variant="body1" component="p" className="mb-4">
            Pour continuer, entrez la clé de sécurité :
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Clé de sécurité"
            type="password"
            value={securityKey}
            onChange={handleKeyChange}
            fullWidth
            variant="outlined"
          />
          {error && (
            <Typography variant="body2" color="error" className="mt-2">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onVerificationFail} color="primary">
            Annuler
          </Button>
          <Button type="submit" color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export default KeyVerification;
