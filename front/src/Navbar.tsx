import { Grid } from "@mui/material";
import { IconHome, IconUser, IconChartBar } from "@tabler/icons-react"; // Import des icônes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "./Profile"; // Vérifiez le chemin d'importation

const NavBar = () => {
    const navigate = useNavigate();
    const [openPopup, setOpenPopup] = useState(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <>
            <Grid className="fixed top-0 w-full bg-white flex items-center justify-center z-20 border-b-2 border-theme-color-2 shadow-md">
                <nav className="flex w-full justify-between px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-7 items-center">
                    {/* Logo et titre */}
                    <div className="flex items-center">
                        <img src="./src/img/ampf.png" alt="Logo" className="h-8 w-8 mr-2" />
                        <h1 className="text-sm sm:text-lg lg:text-xl font-bold cursor-default text-theme-color-3 font-quicksand">
                            Gestion Des Contacts
                        </h1>
                    </div>
                    
                    {/* Menu pour la navigation */}
                    <div className="flex items-center">
                        <ul className="flex items-center space-x-4 sm:space-x-6">
                            <li 
                                className="nav-btn flex items-center text-xs sm:text-sm lg:text-base" 
                                onClick={(e) => { e.preventDefault(); navigate('/Home'); }}
                            >
                                <IconHome stroke={1.5} size={20} className="mr-1" />
                                Acceuil
                            </li>
                            <li 
                                className="nav-btn flex items-center text-xs sm:text-sm lg:text-base" 
                                onClick={(e) => { e.preventDefault(); navigate('/Dashboard'); }}
                            >
                                <IconChartBar size={20} strokeWidth={1.5} className="mr-1" />
                                Statistique
                            </li>

                            <li 
                                className="nav-btn flex items-center text-xs sm:text-sm lg:text-base" 
                                onClick={(e) => { e.preventDefault(); handleOpenPopup(); }}
                            >
                                <IconUser stroke={1.5} size={20} className="mr-1" />
                                Utilisateur
                            </li>
                        </ul>
                    </div>
                </nav>
            </Grid>

            <div className="pt-24 sm:pt-28">
                {/* Contenu de la page */}
            </div>

            <ProfilePopup open={openPopup} onClose={handleClosePopup} />
        </>
    );
};

export default NavBar;
