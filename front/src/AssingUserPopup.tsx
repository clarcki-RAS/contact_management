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

interface Employe {
  matricule: string;
  nom: string;
  prenom: string;
  siege: string;
  localiteTravail: string;
  fonction: string;
  classification: string;
  affectationPrecedente: string;
  dateEmbauche: string;
  email: string;
  contactPersonnel: string;
  createdAt: string;
  updatedAt: string;
  id_ligne: number | null;
}

interface AssignUserPopupProps {
  open: boolean;
  onClose: () => void;
  lineId: number;
  onAssign: (matricule: string, lineId: number) => Promise<void>;
}

const AssignUserPopup: React.FC<AssignUserPopupProps> = ({
  open,
  onClose,
  lineId,
  onAssign,
}) => {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMatricule, setLoadingMatricule] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch employes from the backend
  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get("http://localhost:8000/api/employes/no-lines")
        .then((response) => {
          setEmployes(response.data);
        })
        .catch(() => {
          setErrorMessage(
            "Une erreur s'est produite lors du chargement des employés."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  const employesWithoutLine = employes.filter((emp) => emp.id_ligne === null);

  const handleAssign = async (matricule: string) => {
    setLoadingMatricule(matricule);
    setErrorMessage(null);
    console.log("Données envoyées :", { id_ligne: lineId, matricule: matricule });
    try {
      await axios.post("http://localhost:8000/api/lignes/assign-user", {
        id_ligne: lineId, // Assurez-vous que cette variable contient une valeur valide
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
      setLoadingMatricule(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assigner un utilisateur</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ mt: 2 }}>
            {employesWithoutLine.length > 0 ? (
              <>
                {errorMessage && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
                {employesWithoutLine.map((emp) => (
                  <Box
                    key={emp.matricule} // Utilisation de "matricule" comme clé unique
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
                      <strong>Matricule:</strong> {emp.matricule} |{" "}
                      <strong>Nom:</strong> {emp.nom} {emp.prenom}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAssign(emp.matricule)}
                      disabled={loadingMatricule === emp.matricule}
                      startIcon={
                        loadingMatricule === emp.matricule ? (
                          <CircularProgress size={16} />
                        ) : null
                      }
                      sx={{
                        pointerEvents:
                          loadingMatricule === emp.matricule ? "none" : "auto",
                      }}
                    >
                      {loadingMatricule === emp.matricule
                        ? "Assignation..."
                        : "Assigner"}
                    </Button>
                  </Box>
                ))}
              </>
            ) : (
              <Typography color="textSecondary" variant="body2">
                Aucun employé disponible pour l'assignation.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          disabled={loadingMatricule !== null}
        >
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserPopup;
