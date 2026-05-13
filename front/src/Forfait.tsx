import React, { useState } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { CheckCircle} from '@mui/icons-material';



interface ForfaitProps {
  open: boolean;
  handleClose: () => void;
}

const Forfait: React.FC<ForfaitProps> = ({ open, handleClose }) => {
  const [form, setForm] = useState({
    nomForfait: '',
    prix: '',
    validite: '',
    dateDebut: '',

  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess('');
    setError('');

    // Validation des champs
    const isValid = Object.values(form).every((field) => field !== '');
    if (!isValid) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    setLoading(true);

    try {
      // Appel à l'API pour ajouter le forfait
      const response = await fetch('http://localhost:8000/api/forfaits/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_forfait: form.nomForfait,
          prix: parseFloat(form.prix),
          validite: form.validite,
          date_debut: form.dateDebut,
          id_ligne: parseInt(form.idLigne, 10),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Une erreur est survenue lors de l\'ajout du forfait.');
      }

      const data = await response.json();
      setSuccess(data.message);
      handleReset();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      nomForfait: '',
      prix: '',
      validite: '',
      dateDebut: '',
      idLigne: '',
    });
    setSubmitted(false);
    setSuccess('');
    setError('');
    handleClose();
  };

  const renderTextField = (
    label: string,
    name: keyof typeof form,
    type = 'text',
    disabled = false
  ) => {
    const isFieldEmpty = submitted && !form[name];
    const isFieldFilled = submitted && form[name];

    return (
      <TextField
        variant="outlined"
        label={label}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleTextFieldChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isFieldFilled ? <CheckCircle color="success" /> : isFieldEmpty && <ErrorIcon color="error" />}
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={disabled}
        error={isFieldEmpty}
        helperText={isFieldEmpty ? `Veuillez indiquer ${label.toLowerCase()}` : ''}
        className="mb-6"
        sx={{
          width: '100%',
          maxWidth: '520px',
        }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold mb-16 text-center bg-blue-500 text-white p-4">
        Ajouter un Forfait
      </DialogTitle>
      <DialogContent className="bg-white p-8 shadow-md mt-5 rounded-md w-full max-w-7xl">
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mt-5">
            {renderTextField('Nom du Forfait', 'nomForfait')}
            {renderTextField('Prix', 'prix', 'number')}
            {renderTextField('Validité (en jours)', 'validite', 'number')}
            {renderTextField('Date de Début', 'dateDebut', 'date')}

          </div>

          <DialogActions className="mt-16 flex justify-center w-full">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              sx={{
                minWidth: '100px',
                fontSize: '0.75rem',
                padding: '4px 8px',
              }}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                minWidth: '100px',
                fontSize: '0.75rem',
                padding: '4px 8px',
              }}
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Forfait;
