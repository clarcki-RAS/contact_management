const { Lignes, Forfait } = require('../models');

const getContacts = async (req, res) => {
  try {
    const contacts = await Lignes.findAll({
      include: [
        {
          model: Forfait,
          as: 'ligneForfait', // Utilisation de l'alias  avec le modèle
          attributes: ['id_forfait', 'nom_forfait', 'prix', 'validite', 'date_debut'],
        },
      ],
      attributes: ['id_ligne', 'custcode', 'numero', 'msisdn', 'typeLigne', 'statut', 'utilisateurAssigne', 'etat_assignation'],
    });

    // Traiter les données pour remplacer les champs manquants par "--"
    const formattedContacts = contacts.map((contact) => {
      const forfait = contact.ligneForfait || {}; // Utilisation du même alias pour accéder au forfait

      return {
        id_ligne: contact.id_ligne || '--',
        custcode: contact.custcode || '--',
        numero: contact.numero || '--',
        msisdn: contact.msisdn || '--',
        typeLigne: contact.typeLigne || '--',
        statut: contact.statut || '--',
        utilisateurAssigne: contact.utilisateurAssigne || '--',
        etat_assignation: contact.etat_assignation !== undefined ? contact.etat_assignation : '--',
        forfait: {
          id_forfait: forfait.id_forfait || '--',
          nom_forfait: forfait.nom_forfait || '--',
          prix: forfait.prix !== undefined ? forfait.prix : '--',
          validite: forfait.validite !== undefined ? forfait.validite : '--',
          date_debut: forfait.date_debut || '--',
        },
      };
    });

    res.status(200).json(formattedContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contacts.' });
  }
};

const updateLigneStatus = async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver la ligne par son ID
    const ligne = await Lignes.findByPk(id);
    if (!ligne) {
      return res.status(404).json({ message: 'Ligne non trouvée.' });
    }

    // Mise à jour du statut de la ligne en "Résilié"
    ligne.statut = 'resilie';
    await ligne.save();

    res.status(200).json({ message: 'Statut de la ligne mis à jour en "Résilié".' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la ligne:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la ligne.' });
  }
};

const destituerUtilisateur = async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver la ligne par son ID
    const ligne = await Lignes.findByPk(id);
    if (!ligne) {
      return res.status(404).json({ message: 'Ligne non trouvée.' });
    }

    // Mise à jour des champs utilisateur et état d'assignation
    ligne.utilisateurAssigne = '--';
    ligne.etat_assignation = false;
    await ligne.save();

    res.status(200).json({ message: "L'utilisateur a été destitué avec succès." });
  } catch (error) {
    console.error('Erreur lors de la destitution:', error);
    res.status(500).json({ message: 'Erreur lors de la destitution.' });
  }
};

const reactivateLigne = async (req, res) => {
  const { id } = req.params;

  try {
    // Trouver la ligne par son ID
    const ligne = await Lignes.findByPk(id);
    if (!ligne) {
      return res.status(404).json({ message: 'Ligne non trouvée.' });
    }

    // Mise à jour du statut de la ligne en "active"
    ligne.statut = 'active';
    await ligne.save();

    res.status(200).json({ message: 'Statut de la ligne mis à jour en "active".' });
  } catch (error) {
    console.error('Erreur lors de la réactivation de la ligne:', error);
    res.status(500).json({ message: 'Erreur lors de la réactivation.' });
  }
};

module.exports = { getContacts, updateLigneStatus, destituerUtilisateur,reactivateLigne };

