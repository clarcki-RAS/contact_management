import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const EmployeeUpdate = ({ open, handleClose, employee, onUpdate, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    siege: '',
    localiteTravail: '',
    classification: '',
    affectationPrecedente: '',
    dateEmbauche: '',
    email: '',
    contactPersonnel: '',
  });

  // Pré-remplir le formulaire avec les données de l'employé sélectionné
  useEffect(() => {
    if (employee) {
      setFormData({
        matricule: employee.matricule || '',
        nom: employee.nom || '',
        prenom: employee.prenom || '',
        siege: employee.siege || '',
        localiteTravail: employee.localiteTravail || '',
        classification: employee.classification || '',
        affectationPrecedente: employee.affectationPrecedente || '',
        dateEmbauche: employee.dateEmbauche || '',
        email: employee.email || '',
        contactPersonnel: employee.contactPersonnel || '',
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/employes/${formData.matricule}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour de l’employé');
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
      <DialogTitle>Mise à jour de l'employé</DialogTitle>
      <DialogContent>
        <TextField
          label="Matricule"
          name="matricule"
          value={formData.matricule}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled // Matricule non modifiable
        />
        <TextField
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Siège"
          name="siege"
          value={formData.siege}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Localité de Travail"
          name="localiteTravail"
          value={formData.localiteTravail}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Classification"
          name="classification"
          value={formData.classification}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Affectation Précédente"
          name="affectationPrecedente"
          value={formData.affectationPrecedente}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date d'Embauche"
          name="dateEmbauche"
          type="date"
          value={formData.dateEmbauche}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Personnel"
          name="contactPersonnel"
          value={formData.contactPersonnel}
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

export default EmployeeUpdate;
