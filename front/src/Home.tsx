import { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import "./styles.css";

const Home = () => {
    const navigate = useNavigate();
    
    const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [visibleBoxes, setVisibleBoxes] = useState([false, false]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setVisibleBoxes(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    } else {
                        setVisibleBoxes(prev => {
                            const newState = [...prev];
                            newState[index] = false;
                            return newState;
                        });
                    }
                });
            },
            { threshold: 0.2 }
        );

        boxRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            boxRefs.current.forEach(ref => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    return (
        <>
            <RootLayout />
            
            <div className="h-full w-full mt-0 pt-0">
                <Grid container justifyContent="center">
                    <Grid 
                        container 
                        className="px-4 sm:px-8 md:px-12 lg:px-20 bg-theme-color-3"
                        style={{ maxWidth: "", margin: "0 auto", }}
                    >
                        <Grid item xs={12} className="text-center">
                            <h1 className="text-theme-color-2 font-barlow font-bold text-4xl sm:text-6xl lg:text-7xl pt-8 sm:pt-12 lg:pt-16">
                                CONTACT CENTER
                            </h1>
                            <h1 className="text-white font-quicksand text-lg sm:text-3xl lg:text-4xl pt-4 sm:pt-8">
                                Facilitez la Gestion de Vos Informations Avec nos Applications,
                            </h1>
                            <h1 className="text-theme-color-3 font-quicksand text-md sm:text-lg mt-4 sm:mt-8 z-50 shadow-sm shadow-theme-color-1 bg-white inline-block px-4 py-2">
                                S<span className="ps-1">e</span><span className="ps-1">r</span><span className="ps-1">v</span><span className="ps-1">i</span><span className="ps-1">c</span><span className="ps-1">e</span>
                                <span className="px-4">D<span className="ps-1">A</span><span className="ps-1">G</span><span className="ps-1">C</span></span>
                            </h1>
                        </Grid>
                    </Grid>

                    <Grid container justifyContent="center">
                        <Grid item xs={12} className="pt-4"></Grid> {/* Réduit le padding-top pour rapprocher les sections */}
                        <Grid item xs={12} className="px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8">
                            <h2 className="text-center font-quicksand font-semibold text-md sm:text-lg lg:text-xl leading-relaxed">
                                Bienvenue sur notre plateforme de Gestion en ligne, Cette plateforme a été mise en place dans le but de gérer 
                                et centraliser les contacts des employés et des lignes téléphoniques. Facilitez votre travail en utilisant 
                                notre plateforme de gestion de données centralisée.
                            </h2>
                        </Grid>

                        <Grid item xs={12} className="text-center pt-6 sm:pt-8">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-theme-color-3 relative inline-block">
                                MODULES DU PLATEFORM
                                <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 h-1 w-3/4 bg-gray-300"></span>
                            </h1>
                        </Grid>

                        {/* Section contenant les deux boxes avec animation */}
                        <Grid item xs={12} className="px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-10">
                            <Grid container justifyContent="center" alignItems="flex-start" spacing={7}>
                                
                                {/* Premier Grid box */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    className={`px-2 box-animation ${visibleBoxes[0] ? "visible" : ""}`}
                                    ref={el => (boxRefs.current[0] = el)} // Référence pour la première box
                                >
                                    <Box className="w-full mx-auto relative">
                                        <img src="./src/img/employe.jpg" className="object-cover h-40 sm:h-60 w-full" />
                                        <div className="pt-6 sm:pt-10 pb-2 px-5 border">
                                            <Grid container>
                                                <Grid item xs={12} className="pb-2 font-barlow text-lg">
                                                    Dans cette section, nous allons gérer les Informations sur les Employés
                                                </Grid> 
                                                <button onClick={(e) => { e.preventDefault(); navigate('/Employee') }} className="view-more-btn">
                                                    Accéder
                                                </button>
                                            </Grid>
                                        </div>
                                        <div className="card-title">
                                            Gestion Des Employés
                                        </div>
                                    </Box>
                                </Grid>

                                {/* Deuxième Grid box */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    className={`px-2 box-animation ${visibleBoxes[1] ? "visible" : ""}`}
                                    ref={el => (boxRefs.current[1] = el)} // Référence pour la deuxième box
                                >
                                    <Box className="w-full mx-auto relative">
                                        <img src="./src/img/contact.jpg" className="object-cover h-40 sm:h-60 w-full" />
                                        <div className="pt-6 sm:pt-10 pb-2 px-5 border">
                                            <Grid container>
                                                <Grid item xs={12} className="pb-2 font-barlow text-lg">
                                                    Dans cette section, nous allons gérer les Informations sur les lignes téléphoniques
                                                </Grid>
                                                <button onClick={(e) => { e.preventDefault(); navigate('/Sim-card') }} className="view-more-btn">
                                                    Accéder 
                                                </button>
                                            </Grid>
                                        </div>
                                        <div className="card-title">
                                            Gestion Des  Lignes
                                        </div>
                                    </Box>
                                </Grid>
{/* troisieme box */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    className={`px-2 box-animation ${visibleBoxes[1] ? "visible" : ""}`}
                                    ref={el => (boxRefs.current[1] = el)} 
                                >
                                    <Box className="w-full mx-auto relative">
                                        <img src="./src/img/rapport.jpg" className="object-cover h-40 sm:h-60 w-full" />
                                        <div className="pt-6 sm:pt-10 pb-2 px-5 border">
                                            <Grid container>
                                                <Grid item xs={12} className="pb-2 font-barlow text-lg">
                                                    Dans cette section, nous allons gerer les rapport d'utilisation des lignes 
                                                </Grid>
                                                <button onClick={(e) => { e.preventDefault(); navigate('/Rapport') }} className="view-more-btn">
                                                    Accéder 
                                                </button>
                                            </Grid>
                                        </div>
                                        <div className="card-title">
                                            Gestion Des  Rapport d'utilisation 
                                        </div>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default Home;
