import { useState, useEffect } from "react";
import {
  Grid,
  Snackbar,
  Alert,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import RootLayout from "./RootLayout";
import FormulaireAPMF from "./Employee-register";
import axios from "axios";
import EmployeeUpdate from "./Employee-update";
import ContactAssignPopup from "./ContactAssignPopup";
import { Toast } from "./Toast";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [employeeUpdateOpen, setEmployeeUpdateOpen] = useState(false);
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);
  const [addSnackbarOpen, setAddSnackbarOpen] = useState(false);

  const [assignPopupOpen, setAssignPopupOpen] = useState(false); // Pour ouvrir/fermer la popup
  const [lineId, setLineId] = useState(null); // Pour stocker l'ID de ligne si nécessaire

  const handleAddSnackbarOpen = () => setAddSnackbarOpen(true);
  const handleAddSnackbarClose = () => setAddSnackbarOpen(false);

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    handleAddSnackbarOpen();
    fetchEmployees();
  };

  const handleAssignProfessionalLine = (employee, lineId) => {
    setSelectedEmployee(employee); // Définir l'employé sélectionné
    setLineId(lineId); // Définir l'ID de la ligne
    setAssignPopupOpen(true); // Ouvrir la popup
  };

  const handleUpdateSnackbarOpen = () => setUpdateSnackbarOpen(true);
  const handleUpdateSnackbarClose = () => setUpdateSnackbarOpen(false);

  const handleOpenUpdateForm = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeUpdateOpen(true);
  };

  const handleCloseUpdateForm = () => setEmployeeUpdateOpen(false);

  // Fonction pour récupérer les employés
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/employes"); // API Backend
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des employés");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  //telechargement
  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exportation/export-employes",
        {
          responseType: "blob", // Important : permet de gérer les données binaires
        }
      );

      // Créez un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Employes.xlsx"); // Nom du fichier
      document.body.appendChild(link);
      link.click();
      link.remove(); // Supprime le lien après téléchargement
    } catch (error) {
      console.error("Erreur lors de l'exportation :", error);
      alert(
        "Erreur lors de l'exportation. Vérifiez votre connexion ou vos permissions."
      );
    }
  };
  const handleAssignLine = async (lineId) => {
    if (!selectedEmployee || !selectedEmployee.matricule) {
      console.error("Aucun employé sélectionné ou matricule manquant");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/employes/assign-line",
        {
          matricule: selectedEmployee.matricule,
          id_ligne: lineId,
        }
      );

      console.log("Ligne assignée avec succès:", response.data);
      fetchEmployees();
      setAssignPopupOpen(false);
    } catch (error) {
      console.error("Erreur lors de l’attribution de la ligne:", error);
      alert("Une erreur s'est produite lors de l'attribution de la ligne.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleEmployeeFormOpen = () => setEmployeeFormOpen(true);
  const handleEmployeeFormClose = () => setEmployeeFormOpen(false);
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };
  // Ouvrir/fermer la boîte de dialogue de confirmation
  const handleConfirmDialogOpen = () => setConfirmDialogOpen(true);
  const handleConfirmDialogClose = () => setConfirmDialogOpen(false);

  // Gérer la suppression d'un employé
  const handleDeleteEmployee = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/employes/${selectedEmployee.matricule}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      setEmployees((prevEmployees) =>
        prevEmployees.filter(
          (emp) => emp.matricule !== selectedEmployee.matricule
        )
      );
      setConfirmDialogOpen(false);
      setSelectedEmployee(null);
      handleSnackbarOpen();
      fetchEmployees();
      Toast.fire({
        icon: 'success',
        title: "Information supprimee"
      })
    } catch (error) {
      console.error("Erreur:", error);
      Toast.fire({
        icon: 'error',
        title: 'Erreur lors du traitement'
      })
    }
  };

  // Filtrer les employés tout en gérant les valeurs nulles/undefined
  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee || {})
      .map((value) => value?.toString().toLowerCase())
      .some((field) => field?.includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <RootLayout />
      <Grid className="mx-16 mt-5">
        <Grid
          style={{ paddingTop: "20.5px", paddingBottom: "23.5px" }}
          className="bg-theme-color-3"
        >
          <h1 className="font-quicksand text-white font-bold text-xl ps-16">
            GESTION DES EMPLOYÉS
          </h1>
        </Grid>

        <Grid container className="w-full pt-7" style={{ height: "762px" }}>
          <Grid item xs={8} className="w-full pe-6">
            <Grid
              container
              className="w-full h-fit py-4 ps-10 text-xl text-theme-color-1 font-bold border"
            >
              <Grid item className="w-full" xs={8}>
                <p>Liste des employés</p>
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
                    className="ml-2 outline-none bg-transparent"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </Grid>
              <Grid item className="w-full flex justify-center" xs={1}>
                <button
                  className="bg-theme-color-3 text-white px-2 py-2 hover:text-theme-color-2 hover:bg-white border border-theme-color-2 transition duration-200 ease-out"
                  onClick={handleEmployeeFormOpen}
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
                {filteredEmployees.map((employee) => (
                  <Grid
                    container
                    className="w-full h-full border text-xl cursor-pointer hover:bg-gray-100"
                    key={employee.matricule}
                    onClick={() => handleEmployeeClick(employee)}
                  >
                    <Grid
                      item
                      className="flex justify-center place-items-center font-barlow"
                      style={{ width: "20%" }}
                    >
                      <p>{employee.matricule}</p>
                    </Grid>
                    <Grid
                      item
                      className="flex justify-center place-items-center font-barlow"
                      style={{ width: "40%" }}
                    >
                      <p>
                        {employee.nom} {employee.prenom}
                      </p>
                    </Grid>
                    <Grid
                      item
                      className="flex justify-center place-items-center font-barlow"
                      style={{ width: "40%" }}
                    >
                      <p>{employee.localiteTravail}</p>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} className="w-full h-full border">
            <Grid
              container
              className="w-full h-fit py-4 ps-10 text-xl text-theme-color-1 font-bold border-b"
            >
              <Grid item className="w-full" xs={6}>
                <p>Information détaillée</p>
              </Grid>
            </Grid>
            {selectedEmployee ? (
              <Grid className="p-4 text-lg space-y-3">
                <p>
                  <strong>Matricule :</strong> {selectedEmployee.matricule}
                </p>
                <p>
                  <strong>Nom :</strong> {selectedEmployee.nom}
                </p>
                <p>
                  <strong>Prénom :</strong> {selectedEmployee.prenom}
                </p>
                <p>
                  <strong>Siège :</strong> {selectedEmployee.siege}
                </p>
                <p>
                  <strong>Localité :</strong> {selectedEmployee.localiteTravail}
                </p>
                <p>
                  <strong>Classification :</strong>{" "}
                  {selectedEmployee.classification}
                </p>
                <p>
                  <strong>Affectation Précédente :</strong>{" "}
                  {selectedEmployee.affectationPrecedente}
                </p>
                <p>
                  <strong>Date d'embauche :</strong>{" "}
                  {selectedEmployee.dateEmbauche}
                </p>
                <p>
                  <strong>Email :</strong> {selectedEmployee.email}
                </p>
                <p>
                  <strong>Contact Personnel :</strong>{" "}
                  {selectedEmployee.contactPersonnel}
                </p>

                {/* Action Buttons */}
                <Grid container spacing={3} className="mt-3">
                  <Grid item>
                    <button
                      className="bg-red-500 text-white text-sm px-14 py-1 rounded hover:bg-red-600 transition duration-200"
                      onClick={handleConfirmDialogOpen}
                    >
                      Supprimer
                    </button>
                  </Grid>
                  <Grid item>
                    <button
                      className="bg-blue-500 text-white text-sm px-20 py-1 rounded hover:bg-blue-600 transition duration-200"
                      onClick={() => handleOpenUpdateForm(selectedEmployee)}
                    >
                      Modifier
                    </button>
                  </Grid>
                  <Grid item>
                    <button
                      className="bg-orange-500 text-white text-sm px-11 py-1 rounded hover:bg-orange-600 transition duration-200"
                      onClick={() =>
                        handleAssignProfessionalLine(selectedEmployee)
                      }
                    >
                      Attribuer Ligne
                    </button>
                    <button
                      className="bg-green-700 text-white text-sm px-5 py-1 ml-5 rounded hover:bg-green-900 transition duration-200"
                      onClick={handleExportToExcel}
                    >
                      Exporter les données en .xls
                    </button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <p className="p-4 text-gray-500">
                Cliquez sur un employé pour voir les détails
              </p>
            )}
          </Grid>
        </Grid>
      </Grid>
      {/* Boîte de dialogue de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cet employé ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Non
          </Button>
          <Button onClick={handleDeleteEmployee} color="secondary">
            Oui
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={addSnackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleAddSnackbarClose}
      >
        <Alert
          onClose={handleAddSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Employé ajouté avec succès !
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Information supprimé avec succès !
        </Alert>
      </Snackbar>

      <Snackbar
        open={updateSnackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "50%" }}
        onClose={handleUpdateSnackbarClose}
      >
        <Alert
          onClose={handleUpdateSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Modification réussie !
        </Alert>
      </Snackbar>

      <FormulaireAPMF
        open={employeeFormOpen}
        handleClose={handleEmployeeFormClose}
        onSuccess={handleAddEmployee}
      />
      <EmployeeUpdate
        open={employeeUpdateOpen}
        handleClose={handleCloseUpdateForm}
        employee={selectedEmployee}
        onUpdate={fetchEmployees} // Recharge la liste des employés après mise à jour
        onSuccess={handleUpdateSnackbarOpen}
      />
      <ContactAssignPopup
        open={assignPopupOpen}
        onClose={() => setAssignPopupOpen(false)}
        lineId={lineId} // Assurez-vous que lineId est un nombre ou null
        employeeId={selectedEmployee?.id} // Ajoutez employeeId ici
        matricule={selectedEmployee?.matricule} // Assurez-vous que c'est bien une chaîne ou undefined
        onAssign={async (lineId, matricule) => {
          // Modifiez pour accepter les deux arguments
          if (matricule) {
            await handleAssignLine(lineId, matricule); // Passez le matricule correctement
          }
        }}
      />
    </>
  );
};

export default Employee;
