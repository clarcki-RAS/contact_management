import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Avatar, Box, Grid, InputAdornment, DialogActions
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Popup de confirmation de déconnexion
const ConfirmLogoutPopup = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Voulez-vous vraiment vous déconnecter ?</DialogTitle>
    <DialogActions>
      <Button onClick={onClose}>Annuler</Button>
      <Button onClick={onConfirm} color="error">
        Se déconnecter
      </Button>
    </DialogActions>
  </Dialog>
);

const ProfilePopup = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token non trouvé");
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, surname, service, location, email } = response.data;
        setName(name);
        setSurname(surname);
        setService(service);
        setLocation(location);
        setEmail(email);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error.response || error);
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    if (open) fetchUserData();
  }, [open, navigate]);

  const handleConfirmLogout = async () => {
    try {
      await axios.post('/api/auth/logout', { email });
      localStorage.removeItem('token');
      setConfirmLogoutOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.response || error);
    }
  };

  const openConfirmLogout = () => setConfirmLogoutOpen(true);
  const closeConfirmLogout = () => setConfirmLogoutOpen(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '400px',
          padding: 2,
          position: 'absolute',
          right: 10,
          top: 90,
          margin: 0,
        },
      }}
    >
      <DialogTitle>
        Info utilisateur
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate autoComplete="off" className="pt-5">
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" justifyContent="center" sx={{ mb: 2 }}>
              <Avatar src="/path-to-avatar.jpg" sx={{ width: 70, height: 70 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                disabled
                value={name}
                size="small"
                variant="filled"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                disabled
                label="Prenom"
                value={surname}
                size="small"
                variant="filled"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                fullWidth
                disabled
                label="Service"
                value={service}
                size="small"
                variant="filled"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                fullWidth
                disabled
                label="Localite de travail"
                value={location}
                size="small"
                variant="filled"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                label="Email"
                value={email}
                size="small"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="inherit"
                startIcon={<ExitToAppIcon />}
                onClick={openConfirmLogout}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  boxShadow: 'none',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  marginTop: '30px',
                  marginLeft: '10px',
                }}
              >
                Se déconnecter
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <ConfirmLogoutPopup
        open={confirmLogoutOpen}
        onClose={closeConfirmLogout}
        onConfirm={handleConfirmLogout}
      />
    </Dialog>
  );
};

export default ProfilePopup;
