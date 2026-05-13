import React, { useState } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import axios from 'axios';

interface FormulaireAPMFProps {
  open: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const FormulaireAPMF: React.FC<FormulaireAPMFProps> = ({ open, handleClose , onSuccess }) => {
 const [form, setForm] = useState({
  matricule: '',
  nom: '',
  prenom: '',
  siege: '',
  localiteTravail: '',
  fonction: '',
  classification: '',
  affectationPrecedente: '',
  dateEmbauche: '',
  email: '',
  contactPersonnel: '', // Nouveau champ
});


  const locations = ['Antananarivo', 'Toamasina', 'Antsiranana', 'Mahajanga', 'Marovoay', 'Manakara'];
  const [submitted, setSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // État pour gérer le Snackbar

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Validation du formulaire
    const isValid = Object.values(form).every((field) => field !== '');
    if (isValid) {
      try {
        // Envoi des données au backend via axios
        const response = await axios.post('http://localhost:8000/api/employes/add', form );
        console.log('Form submitted successfully:', response.data);
        onSuccess();
        // Réinitialiser le formulaire après soumission réussie
        handleReset();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleReset = () => {
    setForm({
      matricule: '',
      nom: '',
      prenom: '',
      siege: '',
      localiteTravail: '',
      fonction: '',
      classification: '',
      affectationPrecedente: '',
      dateEmbauche: '',
      email: '',
      contactPersonnel: '',
    });
    setSubmitted(false);
    handleClose();
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderTextField = (label: string, name: keyof typeof form) => {
    const isFieldEmpty = submitted && !form[name];
    const isFieldFilled = submitted && form[name];

    return (
      <TextField
        variant="outlined"
        label={label}
        name={name}
        type={name === 'contactPersonnel' ? 'number' : 'text'} // Champ téléphone comme nombre
        value={form[name]}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isFieldFilled ? <CheckCircle color="success" /> : isFieldEmpty && <Error color="error" />}
            </InputAdornment>
          ),
        }}
        error={isFieldEmpty}
        helperText={isFieldEmpty ? `Veuillez indiquer votre ${label.toLowerCase()}` : ''}
        className="mb-6"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '5px',
            '& fieldset': {
              borderColor: isFieldEmpty ? 'red' : 'grey',
            },
            '&:hover fieldset': {
              borderColor: isFieldFilled ? 'green' : 'blue',
            },
            '&.Mui-focused fieldset': {
              borderColor: isFieldFilled ? 'green' : 'blue',
            },
          },
          '& .MuiInputAdornment-root': {
            marginLeft: 0,
            color: isFieldEmpty ? 'red' : 'inherit',
          },
          '& label.Mui-focused': {
            color: isFieldFilled ? 'green' : 'blue',
          },
          width: '100%',
          maxWidth: '520px',
        }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle className="text-xl font-semibold text-center bg-red-500 text-white p-4">
        Ajouter les informations sur le personnel
      </DialogTitle>
      <DialogContent className="bg-white p-8 shadow-md rounded-md w-full">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {renderTextField('Nom', 'nom')}
            {renderTextField('Prénom', 'prenom')}
            {renderTextField('Numero Matricule', 'matricule')}
            {renderTextField('siege', 'siege')}
            <TextField
              select
              label="Localité de Travail"
              name="localiteTravail"
              value={form.localiteTravail}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                width: '100%',
                maxWidth: '520px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '5px',
                  '&:hover fieldset': {
                    borderColor: 'blue',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'blue',
                  },
                },
              }}
            >
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </TextField>
            {renderTextField('Fonction', 'fonction')}
            {renderTextField('Classification', 'classification')}
            {renderTextField('Affectation Précédente', 'affectationPrecedente')}
            <TextField
              variant="outlined"
              label="Date d'Embauche"
              name="dateEmbauche"
              type="date"
              value={form.dateEmbauche}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {submitted && form.dateEmbauche ? <CheckCircle color="success" /> : submitted && !form.dateEmbauche && <Error color="error" />}
                  </InputAdornment>
                ),
              }}
              error={submitted && !form.dateEmbauche}
              helperText={submitted && !form.dateEmbauche ? "Veuillez indiquer votre date d'embauche" : ''}
              InputLabelProps={{ shrink: true }}
              className="mb-6"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '5px',
                  '&:hover fieldset': {
                    borderColor: 'blue',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'blue',
                  },
                },
                '& label.Mui-focused': {
                  color: form.dateEmbauche ? 'green' : 'blue',
                },
                width: '1105px',
              }}
            />
          </div>
          {/* Section Contact Personnel */}
          <div className="mt-5 text-center">
            <div className="grid grid-cols-2 gap-4">
              {renderTextField('Email', 'email')}
              {renderTextField('Téléphone', 'contactPersonnel')}
            </div>
          </div>
          <DialogActions className="mt-16 flex justify-center w-full">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              className="mt-5"
              onClick={handleReset}
              sx={{
                minWidth: '100px',
                minHeight: '30px',
                fontSize: '0.75rem',
                padding: '4px 8px',
                marginLeft: '100px',
                marginRight: '200px'
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-5"
              sx={{
                minWidth: '100px',
                minHeight: '30px',
                fontSize: '0.75rem',
                marginRight: '250px',
                padding: '4px 8px'
              }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      {/* Snackbar pour message de succès */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Durée d'affichage : 3 secondes
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Employé bien enregistré !
        </Alert>
      </Snackbar>
    </Dialog>
    
  );
};

export default FormulaireAPMF;
