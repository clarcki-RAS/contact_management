import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

interface FormulaireContactProps {
  open: boolean;
  handleClose: () => void;
}

const FormulaireContact: React.FC<FormulaireContactProps> = ({
  open,
  handleClose,
}) => {
  const [form, setForm] = useState({
    custcode: "",
    numero: "",
    msisdn: "",
    typeLigne: "",
    statut: "",
    utilisateurAssigne: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  // Chargement des employés sans ligne
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/employes/no-lines"
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("Données invalides reçues :", data);
          setEmployees([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des employés :", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const isValid = Object.values(form).every((field) => field !== "");

    if (isValid) {
      try {
        const response = await fetch("http://localhost:8000/api/lignes/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Erreur lors de l’ajout de la ligne:",
            errorData.message
          );
          return;
        }

        const data = await response.json();
        console.log("Ligne ajoutée avec succès:", data);
        handleReset();
      } catch (error) {
        console.error("Une erreur est survenue:", error);
      }
    }
  };

  const handleReset = () => {
    setForm({
      custcode: "",
      numero: "",
      msisdn: "",
      typeLigne: "",
      statut: "",
      utilisateurAssigne: "",
    });
    setSubmitted(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold mb-16 text-center bg-red-500 text-white p-4">
        Ajouter les informations sur la ligne professionnelle
      </DialogTitle>
      <DialogContent className="bg-white p-8 shadow-md mt-5 rounded-md w-full max-w-7xl">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {/* Champs existants */}
            <TextField
              variant="outlined"
              label="Custcode"
              name="custcode"
              type="number"
              value={form.custcode}
              onChange={handleTextFieldChange}
              className="mb-6"
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Numero"
              name="numero"
              type="text"
              value={form.numero}
              onChange={handleTextFieldChange}
              className="mb-6"
              fullWidth
            />
            <TextField
              variant="outlined"
              label="MSISDN"
              name="msisdn"
              type="number"
              value={form.msisdn}
              onChange={handleTextFieldChange}
              className="mb-6"
              fullWidth
            />
            <FormControl variant="outlined" className="mb-6" fullWidth>
              <InputLabel>Type de Ligne</InputLabel>
              <Select
                value={form.typeLigne}
                onChange={handleSelectChange}
                label="Type de Ligne"
                name="typeLigne"
                error={submitted && !form.typeLigne}
              >
                <MenuItem value="postpaid">Postpaid</MenuItem>
                <MenuItem value="control">Control</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              className="mb-6 col-span-2"
              fullWidth
            >
              <InputLabel>Statut</InputLabel>
              <Select
                value={form.statut}
                onChange={handleSelectChange}
                label="Statut"
                name="statut"
                error={submitted && !form.statut}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="resilie">Résilié</MenuItem>
              </Select>
            </FormControl>

            {/* Liste des employés */}
            <FormControl
              variant="outlined"
              className="mb-6 col-span-2"
              sx={{ minWidth: 850 }}
            >
              <InputLabel>Utilisateur Assigné</InputLabel>
              <Select
                value={form.utilisateurAssigne || "--"}
                onChange={handleSelectChange}
                label="Utilisateur Assigné"
                name="utilisateurAssigne"
                error={submitted && !form.utilisateurAssigne}
              >
                {employees && employees.length > 0 ? (
                  employees.map((employee) => {
                    const employeeId = employee?.id?.toString(); // Vérifiez que `id` est défini
                    const employeeName =
                      `${employee?.nom || "Nom inconnu"} ${employee?.prenom || ""}`.trim();
                    return (
                      <MenuItem key={employeeId} value={employeeId}>
                        {employeeName}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem disabled value="">
                    Aucun employé disponible
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </div>

          <DialogActions className="mt-16 flex justify-center w-full">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{
                minWidth: "100px",
                fontSize: "0.75rem",
                padding: "4px 8px",
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                minWidth: "100px",
                fontSize: "0.75rem",
                padding: "4px 8px",
              }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaireContact;
