import { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton, Dialog } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import KeyVerification from './key-verification';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

// Gérer l'ouverture et la fermeture de la boîte de dialogue
const handleOpenDialog = () => {
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

// Fonction appelée lors de la vérification réussie
const handleVerificationSuccess = () => {
  alert('Clé validée avec succès !');
  setOpenDialog(false);
};

// Fonction appelée lors de l’échec de la vérification ou de l’annulation
const handleVerificationFail = () => {
  setOpenDialog(false);
}; 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      
      // Si la connexion est réussie, rediriger vers /Home
      if (response.status === 200) {
        navigate('/Home');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Erreur lors de la connexion");
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    }
  };

  const handleBackClick = () => {
    window.history.back(); // Retour à la page précédente
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
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
        <Box className="flex flex-col items-center pt-2 py-10 space-y-2 bg-gray-100 rounded-lg" sx={{ maxWidth: '400px', width: '100%' }}>
          <Link to="/" className='py-4'>
            <img
              src="./src/img/ampf.png"
              alt="Company Logo"
              className="w-12 h-12"
            />
          </Link>
          <Typography variant="h5" className="text-center text-gray-700">
            Se Connecter
          </Typography>
        </Box>
        <Box
          className="bg-white shadow-lg p-8 rounded-lg max-w-md w-full space-y-6"
          sx={{ maxWidth: '350px', width: '100%' }}
        >
          <Box className="space-y-2">
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{ endAdornment: null }}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="small"
                required
              />

              {/* <div className="flex justify-end">
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div> */}

              <Button
                className='bg-theme-color-3'
                type="submit"
                variant="contained"
                fullWidth               
                sx={{ marginTop: '16px' }}
              >
                Se connecter
              </Button>
            </form>
            {error && <Typography color="error" className="text-center">{error}</Typography>}
          </Box>

          <Box className="space-y-4">
            <div className="my-4 flex items-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-sm text-gray-500">ou</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
            {/* <Button
              variant="outlined"
              fullWidth
              startIcon={<FcGoogle />}
              sx={{ color: '#305CA4', borderColor: '#305CA4' }}
            >
              Sign in with Google
            </Button> */}
          </Box>

          <Box className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Nouveau Utilisateur ?{' '}
              <Link to="" className="text-blue-400 hover:underline " onClick={handleOpenDialog}>
                Créer un Compte
              </Link>
            </span>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '1000px',
            maxWidth: '90vw',
            height: '250px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <KeyVerification
          onVerificationSuccess={handleVerificationSuccess}
          onVerificationFail={handleVerificationFail}
        />
      </Dialog>
    </div>
  );
};

export default Login;
