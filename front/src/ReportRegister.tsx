import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface ReportRegisterProps {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
  onSuccess: (newReport: any) => void; // Accepter le nouveau rapport
}

const ReportRegister: React.FC<ReportRegisterProps> = ({ open, handleClose, onSuccess }) => {
  const [form, setForm] = useState({
    date_redaction: '',
    contenue: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // success ou error
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = Object.values(form).every((field) => field !== '');
    if (isValid) {
        try {
            const response = await axios.post('http://localhost:8000/api/rapports', form);
            console.log('Rapport enregistré avec succès :', response.data);

            setSnackbar({ open: true, message: 'Rapport enregistré avec succès !', severity: 'success' });
            handleReset(); // Réinitialiser le formulaire
            handleClose(); // Fermer la popup
            onSuccess(response.data); // Notifier le parent avec le rapport ajouté
        } catch (error) {
            console.error('Erreur lors de la soumission du rapport :', error);
            setSnackbar({ open: true, message: 'Erreur lors de l\'enregistrement du rapport.', severity: 'error' });
        }
    }
};


  const handleReset = () => {
    setForm({
      date_redaction: '',
      contenue: '',
    });
    setSubmitted(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-xl font-semibold text-center bg-blue-500 text-white p-4">
        Ajouter un Rapport
      </DialogTitle>
      <DialogContent className="bg-white p-8 shadow-md rounded-md w-full">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-5">
            <TextField
              variant="outlined"
              label="Date de Rédaction"
              name="date_redaction"
              type="date"
              value={form.date_redaction}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={submitted && !form.date_redaction}
              helperText={submitted && !form.date_redaction ? 'Veuillez remplir ce champ.' : ''}
            />
            <TextField
              variant="outlined"
              label="Contenu du Rapport"
              name="contenue"
              multiline
              rows={4}
              value={form.contenue}
              onChange={handleChange}
              fullWidth
              error={submitted && !form.contenue}
              helperText={submitted && !form.contenue ? 'Veuillez remplir ce champ.' : ''}
            />
          </div>
          <DialogActions className="mt-8 flex justify-center w-full">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{ minWidth: '100px', fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: '100px', fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ReportRegister;
