import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import RootLayout from "./RootLayout";
import ReportRegister from "./ReportRegister";

const Rapport = () => {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [reportFormOpen, setReportFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const handleAddNewReport = (newReport) => {
        setReports((prevReports) => [newReport, ...prevReports]); // Ajouter le nouveau rapport en haut de la liste
    };
    
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // "success" ou "error"
    });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/rapports");
                console.log("Données reçues du backend :", response.data);
                setReports(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des rapports :", error);
            }
        };

        fetchReports();
    }, []);

    const handleDeleteDialogOpen = useCallback((report) => {
        setReportToDelete(report);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogClose = useCallback(() => {
        setReportToDelete(null);
        setDeleteDialogOpen(false);
    }, []);

    const handleDeleteReport = useCallback(async () => {
        if (!reportToDelete || !reportToDelete.id_rapport) {
            console.error("Aucun rapport valide à supprimer.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/rapports/${reportToDelete.id_rapport}`);
            setReports((prevReports) =>
                prevReports.filter(
                    (report) => report.id_rapport !== reportToDelete.id_rapport
                )
            );
            setSnackbar({
                open: true,
                message: "Rapport supprimé avec succès.",
                severity: "success",
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du rapport :", error);
            setSnackbar({
                open: true,
                message: "Impossible de supprimer le rapport. Veuillez réessayer.",
                severity: "error",
            });
        } finally {
            setDeleteDialogOpen(false);
        }
    }, [reportToDelete]);

    const handleReportFormClose = () => setReportFormOpen(false);

    const handleReportFormOpen = (e) => {
        e.preventDefault();
        setReportFormOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const filteredReports = reports.filter((report) => {
        if (!report.id_rapport || !report.date_redaction) return false;
        const formattedDate = dayjs(report.date_redaction).format("DD/MM/YYYY");
        return (
            report.id_rapport.toString().includes(searchQuery) ||
            formattedDate.includes(searchQuery)
        );
    });

    return (
        <>
            <RootLayout />
            <Grid className="mx-16 mt-5">
                <Grid
                    style={{ paddingTop: "20.5px", paddingBottom: "23.5px" }}
                    className="bg-theme-color-3"
                >
                    <h1 className="font-quicksand text-white font-bold text-xl ps-16">
                        GESTION DES RAPPORTS
                    </h1>
                </Grid>

                <Grid container className="w-full pt-7" style={{ height: "762px" }}>
                    <Grid item xs={12} className="w-full">
                        <Grid
                            container
                            className="w-full h-fit py-4 ps-10 text-xl text-theme-color-1 font-bold border"
                        >
                            <Grid item className="w-full" xs={8}>
                                <p>Liste des rapports</p>
                            </Grid>

                            <Grid
                                item
                                className="w-full font-medium text-black text-regular"
                                xs={3}
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 pt-0.5 text-theme-color-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        className="ml-2 outline-none bg-transparent font-light"
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Rechercher par ID ou Date (DD/MM/YYYY)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </Grid>

                            <Grid item className="w-full flex justify-center" xs={1}>
                                <button
                                    className="bg-theme-color-3 text-white px-2 py-2 hover:text-theme-color-2 hover:bg-white border border-theme-color-2 transition duration-200 ease-out"
                                    onClick={handleReportFormOpen}
                                >
                                    <IconPlus className="h-5" />
                                </button>
                            </Grid>
                        </Grid>

                        <Grid
                            className="border mt-3 h-full"
                            style={{ maxHeight: "650px", overflowY: "auto" }}
                        >
                            <Grid className="h-20 w-full px-2 mt-2">
                                {filteredReports.map((report) => (
                                    <Grid
                                        container
                                        className={`w-full h-full border items-center text-sm hover:bg-gray-100 transition ${
                                            reportToDelete?.id_rapport === report.id_rapport ? "bg-gray-200" : ""
                                        }`}
                                        key={report.id_rapport}
                                    >
                                        <Grid
                                            item
                                            className="flex justify-start items-center pl-4 font-semibold"
                                            style={{ width: "10%" }}
                                        >
                                            <p>{report.id_rapport}</p>
                                        </Grid>
                                        <Grid
                                            item
                                            className="flex justify-start items-center pl-4 font-medium"
                                            style={{ width: "20%" }}
                                        >
                                            <p>{dayjs(report.date_redaction).format("DD/MM/YYYY")}</p>
                                        </Grid>
                                        <Grid
                                            item
                                            className="flex justify-start items-center px-4 text-justify font-light"
                                            style={{ width: "60%" }}
                                        >
                                            <p>{report.contenue}</p>
                                        </Grid>
                                        <Grid
                                            item
                                            className="flex justify-center items-center pr-4"
                                            style={{ width: "10%" }}
                                        >
                                            <IconTrash
                                                className="cursor-pointer text-red-500"
                                                onClick={() => handleDeleteDialogOpen(report)}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <ReportRegister open={reportFormOpen} 
    handleClose={handleReportFormClose} 
    onSuccess={handleAddNewReport}  />

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">Confirmer la suppression</DialogTitle>
                <DialogContent id="dialog-description">
                    <p>Êtes-vous sûr de vouloir supprimer ce rapport ?</p>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDeleteReport} color="secondary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>

        </>
    );
};

export default Rapport;
