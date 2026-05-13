import React, { useState } from 'react';
import { TextField, Button , Typography, Box, MenuItem, Grid, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    service: '',
    role: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
    securityKey: '', // Nouveau champ pour la clé de sécurité
  });

  const [error, setError] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const services = ['DAGC', 'DGA'];
  const roles = ['admin', 'super_admin', 'simple_user'];
  const locations = ['Antananarivo', 'Toamasina', 'Antsiranana', 'Mahajanga', 'Marovoay', 'Manakara'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password' 
          ? value === formData.confirmPassword 
          : value === formData.password
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const dataToSend = {
      email: formData.email,
      name: formData.name,
      surname: formData.surname,
      service: formData.service,
      role: formData.role,
      location: formData.location,
      password: formData.password,
      ...(formData.role === 'super_admin' && { securityKey: formData.securityKey }), // Inclut securityKey uniquement pour les super_admin
    };

    try {
      console.log("Données envoyées :", dataToSend); // Vérification des données envoyées
      const response = await axios.post('http://localhost:8000/api/auth/register', dataToSend, {
        headers: {
          'Content-Type': 'application/json', // Spécification du format JSON
        },
      });

      if (response.status === 201) {
        navigate('/')
        Swal.fire({
          icon: 'success',
          title: "L'utilisateur a bien été inscrit",
          showConfirmButton: false,
          timer: 3000, // L'alerte disparaît après 3 secondes
        });;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Erreur lors de l'inscription.");
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: '#305CA4',
        }}
      >
        <ArrowBack />
      </IconButton>
      <Box className="mb-20">
        <Box className="flex flex-col items-center pt-2 py-10 space-y-2 bg-gray-100 rounded-lg" sx={{ maxWidth: '600px', width: '100%' }}>
          <Link to="/" className="py-4">
            <img
              src="./src/img/ampf.png"
              alt="Company Logo"
              className="w-12 h-12"
            />
          </Link>
          <Typography variant="h5" className="text-center text-gray-700">
            Créer un Compte
          </Typography>
          <Typography variant="body2" className="text-center" sx={{ color: 'gray' }}>
            Bienvenue, veuillez bien remplir tous les formulaires pour s'inscrire et continuer.
          </Typography>
        </Box>

        <Box
          className="bg-white shadow-lg p-8 rounded-lg"
          sx={{ maxWidth: '700px', width: '100%' }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nom"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Prénom"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {services.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Rôle"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Localité"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mot de passe"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!passwordMatch}
                  helperText={!passwordMatch ? "Les mots de passe ne correspondent pas." : ""}
                />
              </Grid>
              {formData.role === 'super_admin' && (
                <Grid item xs={12}>
                  <TextField
                    label="Clé de Sécurité"
                    name="securityKey"
                    type="password"
                    value={formData.securityKey}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              )}
            </Grid>
            {error && <Typography color="error" className="text-center">{error}</Typography>}
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ width: '48%' }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: '48%' }}
                disabled={!passwordMatch || Object.values(formData).some((field) => !field && field !== formData.securityKey)}
              >
                S'inscrire
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Register;
