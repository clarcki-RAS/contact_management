import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import RootLayout from "./RootLayout";
import { IconPlus } from "@tabler/icons-react";
import FormulaireContact from "./Contact-register";
import Forfait from "./Forfait";
import axios from "axios";
import AssignUserPopup from "./AssingUserPopup";
import { Toast } from "./Toast";
interface Contact {
  id_ligne: number; // Utiliser les noms de champs du backend
  custcode: string;
  numero: string;
  msisdn: number;
  utilisateurAssigne: string;
  statut: string;
  typeLigne: string;
  etat_assignation: string;
  forfait: {
    id_forfait: string;
    nom_forfait: string;
    prix: number;
    validite: string;
    date_debut: string;
  };
}
interface ContactProps {
  lineId: number;
  employees: {
    id: number;
    name: string;
    surname: string;
    id_ligne: number | null;
  }[];
  onUpdateEmployee: (employeeId: number, lineId: number) => void;
}

const Contact: React.FC<ContactProps> = ({
  lineId,
  employees,
  onUpdateEmployee,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleAssignUser = (employeeId: number, lineId: number) => {
    onUpdateEmployee(employeeId, lineId);
  };

  const [resilierPopupOpen, setResilierPopupOpen] = useState(false);
  const handleResilierPopupOpen = () => {
    setResilierPopupOpen(true);
  };

  const handleResilierPopupClose = () => {
    setResilierPopupOpen(false);
  };

  const handleContactAdded = async () => {
    await syncContacts();
  };

  // Ajout des nouveaux états pour les popups
  const [reactivationPopupOpen, setReactivationPopupOpen] = useState(false);
  const [destitutionPopupOpen, setDestitutionPopupOpen] = useState(false);

  // Fonctions pour gérer les popups de réactivation
  const handleReactivationPopupOpen = () => setReactivationPopupOpen(true);
  const handleReactivationPopupClose = () => setReactivationPopupOpen(false);
  const syncContacts = async () => {
    try {
      const response = await axios.get("/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Erreur lors de la synchronisation des contacts :", error);
    }
  };

  const handleReactivationConfirm = async () => {
    if (selectedContact) {
      try {
        // Appeler l'API pour réactiver la ligne
        await axios.put(`/api/contacts/${selectedContact.id_ligne}/reactiver`);
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id_ligne === selectedContact.id_ligne
              ? { ...contact, statut: "active" }
              : contact
          )
        );
        await syncContacts();

        Toast.fire({
          icon: "success",
          title: "ligne reactive avec succes",
        });
      } catch (error) {
        console.error("Erreur lors de la réactivation :", error);
        alert("Une erreur s'est produite lors de la réactivation.");
      } finally {
        setReactivationPopupOpen(false);
      }
    }
  };

  // Fonctions pour gérer les popups de destitution
  const handleDestitutionPopupOpen = () => setDestitutionPopupOpen(true);
  const handleDestitutionPopupClose = () => setDestitutionPopupOpen(false);

  const handleDestitutionConfirm = async () => {
    if (selectedContact) {
      try {
        // Appeler l'API pour destituer l'utilisateur
        await axios.put(`/api/contacts/${selectedContact.id_ligne}/destituer`);
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id_ligne === selectedContact.id_ligne
              ? { ...contact, etatAssignation: false }
              : contact
          )
        );
        await syncContacts();
        Toast.fire({
          icon: "success",
          title: "La ligne a ete libere",
        });
      } catch (error) {
        console.error("Erreur lors de la destitution :", error);
        alert("Une erreur s'est produite lors de la destitution.");
      } finally {
        setDestitutionPopupOpen(false);
      }
    }
  };

  const handleResiliationConfirm = async () => {
    if (!selectedContact || !selectedContact.id_ligne) {
      alert("Aucun ID de ligne valide trouvé.");
      console.error("Erreur : ID de ligne manquant :", selectedContact);
      return;
    }

    try {
      await axios.put(`/api/contacts/${selectedContact.id_ligne}/resilier`);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id_ligne === selectedContact.id_ligne
            ? { ...contact, statut: "Résilié" }
            : contact
        )
      );
      await syncContacts();
      Toast.fire({
        icon: "success",
        title: "la ligne a ete resilie avec succes",
      });
    } catch (error) {
      console.error("Erreur lors de la résiliation :", error);
      alert("Une erreur s'est produite lors de la résiliation.");
    } finally {
      setResilierPopupOpen(false);
    }
  };

  const calculateDelaisEcoule = (date_debut: string, validite: number) => {
    const today = new Date();
    const startDate = new Date(date_debut);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= validite ? "Expiré" : `${diffDays} jours écoulés`;
  };

  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [forfaitPopupOpen, setForfaitPopupOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleContactFormOpen = () => {
    setContactFormOpen(true);
  };

  const handleContactFormClose = () => setContactFormOpen(false);

  const handleForfaitPopupOpen = () => {
    setForfaitPopupOpen(true);
  };
  const [editPopupOpen, setEditPopupOpen] = useState(false);

const handleEditPopupOpen = () => setEditPopupOpen(true);
const handleEditPopupClose = () => setEditPopupOpen(false);

const handleEditSubmit = async (updatedContact: Contact) => {
  try {
    await axios.put(`/api/contacts/${updatedContact.id_ligne}`, updatedContact);
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id_ligne === updatedContact.id_ligne ? updatedContact : contact
      )
    );
    Toast.fire({
      icon: "success",
      title: "Ligne modifiée avec succès",
    });
    setEditPopupOpen(false);
  } catch (error) {
    console.error("Erreur lors de la modification de la ligne :", error);
    alert("Une erreur s'est produite lors de la modification.");
  }
};


  const handleForfaitPopupClose = () => {
    setForfaitPopupOpen(false);
  };

  useEffect(() => {
    syncContacts();
    if (selectedContact) {
      const updatedContact = contacts.find(
        (contact) => contact.id_ligne === selectedContact.id_ligne
      );
      if (updatedContact) {
        setSelectedContact(updatedContact);
      }
    }
  }, [contacts]);

  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact)
      .map((value) => value.toString().toLowerCase())
      .some((field) => field.includes(searchQuery.toLowerCase()))
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
            GESTION DES LIGNES PROFESSIONNELLES
          </h1>
        </Grid>

        <Grid container className="w-full pt-7" style={{ height: "762px" }}>
          <Grid item xs={8} className="w-full pe-6">
            <Grid
              container
              className="w-full h-fit py-4 ps-10 text-xl text-theme-color-1 font-bold border"
            >
              <Grid item className="w-full" xs={8}>
                <p>Liste des lignes professionnelles</p>
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
                  onClick={handleContactFormOpen}
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
                {filteredContacts.map((contact) => (
                  <Grid
                    container
                    className="w-full h-full border text-lg cursor-pointer hover:bg-gray-100"
                    key={contact.id_ligne}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Grid item style={{ width: "20%" }}>
                      <p>{contact.typeLigne}</p>
                    </Grid>
                    <Grid item style={{ width: "40%" }}>
                      <p>{contact.numero}</p>
                    </Grid>
                    <Grid item style={{ width: "40%" }}>
                      <p>{contact.utilisateurAssigne}</p>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4} className="w-full h-full border">
            <Grid
              container
              className="w-full h-fit py-4 ps-10 text-lg text-theme-color-1 font-bold border-b"
            >
              <Grid item className="w-full" xs={6}>
                <p>Information détaillée</p>
              </Grid>
            </Grid>
            {selectedContact ? (
              <Grid className="p-4 text-base space-y-2">
                <p>
                  <strong>Custcode :</strong> {selectedContact.custcode}
                </p>
                <p>
                  <strong>Utilisateur assigne :</strong>{" "}
                  {selectedContact.utilisateurAssigne}
                </p>
                <p>
                  <strong>Numéro :</strong> {selectedContact.numero}
                </p>
                <p>
                  <strong>Statut :</strong> {selectedContact.statut}
                </p>
                <p>
                  <strong>Type de Ligne :</strong> {selectedContact.typeLigne}
                </p>
                <p>
                  <strong>Coût du Forfait :</strong>{" "}
                  {selectedContact.forfait.prix} MGA
                </p>
                <p>
                  <strong>Delais avant expiration:</strong> -- jours
                </p>
                <p>
                  <strong>Date Attribution Forfait :</strong>{" "}
                  {selectedContact.forfait.date_debut}
                </p>
                <p>
                  <strong>Date Expiration Forfait :</strong>{" "}
                  {selectedContact.forfait.validite}
                </p>
                <Grid container spacing={2} className="mt-6">


                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleResilierPopupOpen}
                      disabled={selectedContact.statut === "resilie"}
                    >
                      Resilier la ligne
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleReactivationPopupOpen}
                      disabled={selectedContact.statut === "active"}
                    >
                      Réactiver la ligne
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenPopup}
                    >
                      Assigner utilisateur
                    </Button>
                    <AssignUserPopup
                      open={isPopupOpen}
                      onClose={handleClosePopup}
                      lineId={selectedContact.id_ligne}
                      employees={employees}
                      onAssign={handleAssignUser}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDestitutionPopupOpen}
                      disabled={selectedContact.utilisateurAssigne === "--"}
                    >
                      Destituer l'utilisateur
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleForfaitPopupOpen}
                      disabled={
                        
                        selectedContact.statut === "resilie"
                      }
                    >
                      Ajouter forfait
                    </Button>
                  </Grid>               
                   <Grid item xs={4}>
                   {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditPopupOpen}
                  >
                    Modifier la ligne
                  </Button> */}
                  {/* <EditContactPopup
                    open={editPopupOpen}
                    contact={selectedContact}
                    onClose={handleEditPopupClose}
                    onSubmit={handleEditSubmit}
                  /> */}
                </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid className="p-4 text-base">
                <p>Aucun contact sélectionné</p>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={resilierPopupOpen}
        onClose={handleResilierPopupClose}
        aria-labelledby="resiliation-dialog-title"
        aria-describedby="resiliation-dialog-description"
      >
        <DialogTitle id="resiliation-dialog-title">
          Confirmer la résiliation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="resiliation-dialog-description">
            Êtes-vous sûr de vouloir résilier cette ligne ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResilierPopupClose} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleResiliationConfirm}
            color="secondary"
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      {/* Popup de confirmation pour la réactivation */}
      <Dialog
        open={reactivationPopupOpen}
        onClose={handleReactivationPopupClose}
        aria-labelledby="reactivation-dialog-title"
        aria-describedby="reactivation-dialog-description"
      >
        <DialogTitle id="reactivation-dialog-title">
          Confirmer la réactivation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reactivation-dialog-description">
            Êtes-vous sûr de vouloir réactiver cette ligne ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReactivationPopupClose} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleReactivationConfirm}
            color="secondary"
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup de confirmation pour la destitution */}
      <Dialog
        open={destitutionPopupOpen}
        onClose={handleDestitutionPopupClose}
        aria-labelledby="destitution-dialog-title"
        aria-describedby="destitution-dialog-description"
      >
        <DialogTitle id="destitution-dialog-title">
          Confirmer la destitution
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="destitution-dialog-description">
            Êtes-vous sûr de vouloir destituer cet utilisateur ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDestitutionPopupClose} color="primary">
            Annuler
          </Button>
          <Button
            onClick={handleDestitutionConfirm}
            color="secondary"
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <FormulaireContact
        open={contactFormOpen}
        handleClose={handleContactFormClose}
      />
      <Forfait open={forfaitPopupOpen} handleClose={handleForfaitPopupClose} />
    </>
  );
};

export default Contact;
