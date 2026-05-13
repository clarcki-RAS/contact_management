import { useState, useEffect } from 'react';
import { Typography, Box, Button, Dialog } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import KeyVerification from './key-verification';

const App = () => {
  const [displayText, setDisplayText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const fullText = 'Contact center';

  useEffect(() => {
    let currentIndex = 0;

    const typeLetter = () => {cww
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        currentIndex += 1;
        setTimeout(typeLetter, 120);
      }
    };

    typeLetter();

    return () => {
      setDisplayText('');
    };
  }, []);

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

  return (
    <div className="bg-[url('./img/login.png')] bg-cover bg-center min-h-screen flex items-start justify-start px-4 sm:px-6 lg:px-8 relative">
      {/* Contenu principal à gauche */}
      <Box className="mt-10 ml-8">
        <Typography
          variant="h2"
          component="h2"
          className="text-white text-xl sm:text-4xl lg:text-6xl font-bold mb-4"
        >
          {displayText}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className="text-white text-sm sm:text-base lg:text-lg max-w-md"
        >
          Bienvenue cher utilisateur , veuillez contacter un administrateur en cas de probleme.
        </Typography>
      </Box>

      {/* Boutons Login et Sign Up à droite, côte à côte */}
      <Box className="absolute right-4 top-2/3 transform -translate-y-1/2 flex space-x-4 mr-10 mb-20">
        <Link to="/Login" className="no-underline">
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            className="bg-blue-500 hover:bg-indigo-700 text-white"
          >
            Se connecter
          </Button>
        </Link>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<PersonAddIcon />}
          className="bg-lime-100 border-white hover:bg-slate-400 hover:text-black"
          onClick={handleOpenDialog}
        >
          Creer un compte
        </Button>
      </Box>

      {/* Dialog contenant le composant KeyVerification */}
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

export default App;
