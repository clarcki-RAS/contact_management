import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const LigneUpdate = ({ open, handleClose, ligne, onUpdate, onSuccess }) => {
  const [formData, setFormData] = useState({
    custcode: '',
    numero: '',
    msisdn: '',
    typeLigne: '',
    statut: '',
  });

  // Pré-remplir le formulaire avec les données de la ligne sélectionnée
  useEffect(() => {
    if (ligne) {
      setFormData({
        custcode: ligne.custcode || '',
        numero: ligne.numero || '',
        msisdn: ligne.msisdn || '',
        typeLigne: ligne.typeLigne || '',
        statut: ligne.statut || '',
      });
    }
  }, [ligne]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/lignes/${formData.numero}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour de la ligne');
      onUpdate(); // Notifie la mise à jour
      console.log('Mise à jour réussie, Snackbar déclenchée.');
      onSuccess(); // Ouvre la Snackbar de succès
      handleClose(); // Ferme le formulaire
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Mise à jour de la ligne</DialogTitle>
      <DialogContent>
        <TextField
          label="Custcode"
          name="custcode"
          value={formData.custcode}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Numéro"
          name="numero"
          value={formData.numero}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="MSISDN"
          name="msisdn"
          value={formData.msisdn}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Type de Ligne"
          name="typeLigne"
          value={formData.typeLigne}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Statut"
          name="statut"
          value={formData.statut}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LigneUpdate;
