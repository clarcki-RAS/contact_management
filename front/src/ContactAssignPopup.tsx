import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Toast } from "./Toast";

interface Ligne {
  id_ligne: number;
  numero: string;
  msisdn: string;
  typeLigne: string;
  statut: string;
  utilisateurAssigne: string | null;
  etat_assignation: boolean;
}

interface Employee {
  id: number;
  nom: string;
  prenom: string;
}

interface ContactAssignPopupProps {
  open: boolean;
  onClose: () => void;
  employeeId: number;
  matricule: string;
  onAssign: (employeeId: number, matricule: string) => void;
}
interface ContactAssignPopupProps {
  open: boolean;
  onClose: () => void;
  lineId: number | null; // ID de ligne, peut être null
  employeeId: string; // Assurez-vous que cette propriété est définie
  matricule: string | undefined; // Matricule, peut être une chaîne ou undefined
  onAssign: (lineId: number, matricule: string) => Promise<void>; // Modifiez le type si nécessaire
}

const ContactAssignPopup: React.FC<ContactAssignPopupProps> = ({
  open,
  onClose,
  employeeId,
  matricule,
}) => {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLigne, setLoadingLigne] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch unassigned lignes from the backend
  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get("http://localhost:8000/api/lignes/unassigned")
        .then((response) => {
          setLignes(response.data);
        })
        .catch(() => {
          setErrorMessage(
            "Une erreur s'est produite lors du chargement des lignes."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  const handleAssign = async (id_ligne: number) => {
    setLoadingLigne(id_ligne);
    setErrorMessage(null);
    console.log("Données envoyées :", { id_ligne, matricule: matricule });

    try {
      await axios.post("http://localhost:8000/api/employes/assign-line", {
        id_ligne, // Assurez-vous que cette variable contient une valeur valide
        matricule: matricule, // Assurez-vous que `employeeId` contient une valeur valide
      });
      onClose();
      Toast.fire({
        icon: "success",
        title: "Assignation reussie",
      });
    } catch (error) {
      setErrorMessage("Une erreur s'est produite lors de l'assignation.");
      Toast.fire({
        icon: 'error',
        title: "Erreur lors de l'assignation"
      })
    } finally {
      setLoadingLigne(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assigner une ligne</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ mt: 2 }}>
            {lignes.length > 0 ? (
              <>
                {errorMessage && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
                {lignes.map((ligne) => (
                  <Box
                    key={ligne.id_ligne}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                      p: 1,
                      backgroundColor: "whitesmoke",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      <strong>Numéro:</strong> {ligne.numero} |{" "}
                      <strong>MSISDN:</strong> {ligne.msisdn}
                      <strong></strong>
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAssign(ligne.id_ligne)}
                      disabled={loadingLigne === ligne.id_ligne}
                      startIcon={
                        loadingLigne === ligne.id_ligne ? (
                          <CircularProgress size={16} />
                        ) : null
                      }
                      sx={{
                        pointerEvents:
                          loadingLigne === ligne.id_ligne ? "none" : "auto",
                      }}
                    >
                      {loadingLigne === ligne.id_ligne
                        ? "Assignation..."
                        : "Assigner"}
                    </Button>
                  </Box>
                ))}
              </>
            ) : (
              <Typography color="textSecondary" variant="body2">
                Aucune ligne disponible pour l'assignation.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          disabled={loadingLigne !== null}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactAssignPopup;
