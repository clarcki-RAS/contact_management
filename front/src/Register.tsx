import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Avatar, Box, Grid, InputAdornment
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProfilePopupProps {
    open: boolean;
    onClose: () => void;
}

const ProfilePopup = ({ open, onClose }: ProfilePopupProps) => { 
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/api/auth/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user;
        setName(userData.name);
        setSurname(userData.surname);
        setRole(userData.role);
        setLocation(userData.location);
        setEmail(userData.email);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

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
            <Grid item xs={12} sm={12} display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                <Avatar src="/path-to-avatar.jpg" sx={{ width: 70, height: 70 }} />
                <IconButton sx={{ ml: -4 }} aria-label="edit picture">
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    size="small"
                    variant="filled" // Champ avec style "filled"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Surname"
                    value={surname}
                    size="small"
                    variant="filled"
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Service"
                    value={role}
                    size="small"
                    variant="filled"
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Lieu de travail"
                    value={''} // Champ vide
                    size="small"
                    variant="filled"
                   
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Localité"
                    value={location}
                    size="small"
                    variant="filled"
                   
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
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
                   
                  />
                </Grid>
                     
              </Grid>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="inherit"
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
                style={{
                  textTransform: 'none',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                  boxShadow: 'none',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  marginTop: '30px',
                  marginLeft: '10px'
                }}
              >
                Se déconnecter
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePopup;
