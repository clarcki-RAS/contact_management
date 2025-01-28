const { Lignes, Employes, Forfaits, sequelize } = require('../models'); // Modèles inclus correctement

exports.addLigne = async (req, res) => {
  try {
    const ligne = await Lignes.create(req.body);
    res.status(201).json({ message: 'Ligne ajoutée avec succès', ligne });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ligne :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la ligne" });
  }
};

exports.getAllLignes = async (req, res) => {
  try {
    const lignes = await Lignes.findAll();
    res.status(200).json(lignes);
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes :", error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lignes' });
  }
};

exports.getLigneById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
if (isNaN(id)) {
  return res.status(400).json({ error: "L'ID doit être un entier valide." });
}

    const ligne = await Lignes.findByPk(id);
    if (!ligne) {
      return res.status(404).json({ message: 'Ligne non trouvée' });
    }
    res.status(200).json(ligne);
  } catch (error) {
    console.error("Erreur lors de la récupération de la ligne :", error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la ligne' });
  }
};

exports.updateLigne = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Lignes.update(req.body, { where: { id_ligne: id } });
    if (!updated) {
      return res.status(404).json({ message: 'Ligne non trouvée pour mise à jour' });
    }
    res.status(200).json({ message: 'Ligne mise à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ligne :", error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la ligne' });
  }
};

exports.deleteLigne = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lignes.destroy({ where: { id_ligne: id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Ligne non trouvée pour suppression' });
    }
    res.status(200).json({ message: 'Ligne supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la ligne :", error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la ligne' });
  }
};

exports.assignUserToLigne = async (req, res) => {
  const { id_ligne, matricule } = req.body;

  // Vérification des paramètres requis
  if (!id_ligne || !matricule) {
    return res.status(400).json({ error: "ID de ligne et matricule sont requis." });
  }

  try {
    // Recherche de l'employé correspondant au matricule
    const employe = await Employes.findOne({ where: { matricule } });
    if (!employe) {
      return res.status(404).json({ error: "Employé non trouvé." });
    }

    // Recherche de la ligne correspondant à l'ID de ligne et non assignée
    const ligne = await Lignes.findOne({
      where: { id_ligne, etat_assignation: false },
    });
    if (!ligne) {
      return res.status(404).json({ error: "Ligne non disponible pour l'assignation." });
    }

    // Mise à jour de l'assignation
    await employe.update({ id_ligne }); // Mise à jour de l'employé avec l'ID de la ligne
    await ligne.update({ etat_assignation: true }); // Marque la ligne comme assignée

    res.status(200).json({
      message: "Ligne assignée avec succès à l'employé.",
      employe,
      ligne,
    });
  } catch (error) {
    console.error("Erreur lors de l'assignation :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};


exports.getUnassignedLines = async (req, res) => {
  try {
    const lignes = await Lignes.findAll({
      where: { etat_assignation: false },
    });
    res.status(200).json(lignes);
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des lignes non assignées." });
  }
};

exports.assignLine = async (req, res) => {
  const { id_ligne } = req.params;
  try {
    const ligne = await Lignes.findByPk(id_ligne);
    if (!ligne) {
      return res.status(404).json({ message: "Ligne non trouvée." });
    }
    ligne.etat_assignation = true;
    await ligne.save();
    res.status(200).json({ message: "Ligne assignée avec succès.", ligne });
  } catch (error) {
    console.error("Erreur lors de l'assignation de la ligne :", error);
    res.status(500).json({ message: "Erreur lors de l'assignation de la ligne." });
  }
};

exports.getContacts = async (req, res) => {
  try {
      // Récupérer les données des lignes et des forfaits associées
      const contacts = await Lignes.findAll({
          attributes: [
              'id_ligne',
              'custcode',
              'numero',
              'msisdn',
              'typeLigne',
              'statut',
              'utilisateurAssigne',
              'etat_assignation'
          ],
          include: [
              {
                  model: Forfaits,
                  attributes: [
                      'id_forfait',
                      'nom_forfait',
                      'prix',
                      'validite',
                      'date_debut'
                  ],
                  required: false, // Permet d'inclure même les lignes sans forfaits associés
              }
          ]
      });

      // Remplacer les valeurs nulles par "--" dans les forfaits
      const formattedContacts = contacts.map(contact => {
          const forfait = contact.Forfaits || {}; // Si aucune donnée dans Forfaits, utiliser un objet vide
          return {
              id_ligne: contact.id_ligne,
              custcode: contact.custcode,
              numero: contact.numero,
              msisdn: contact.msisdn,
              typeLigne: contact.typeLigne,
              statut: contact.statut,
              utilisateurAssigne: contact.utilisateurAssigne|| "--",
              etat_assignation: contact.etat_assignation,
              forfait: {
                  id_forfait: forfait.id_forfait || "--",
                  nom_forfait: forfait.nom_forfait || "--",
                  prix: forfait.prix || "--",
                  validite: forfait.validite || "--",
                  date_debut: forfait.date_debut || "--",
              }
          };
      });

      // Retourner les données sous forme de réponse JSON
      res.status(200).json(formattedContacts);
  } catch (error) {
      console.error('Erreur lors de la récupération des contacts :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des contacts.' });
  }
};

exports.calculeLigne = async (req, res) => {
  try {
    // Compter les lignes avec statut 'active'
    const activeCount = await Lignes.count({
      where: { statut: 'active' },
    });

    // Compter les lignes avec statut 'resilie'
    const resilieCount = await Lignes.count({
      where: { statut: 'resilie' },
    });

    // Retourner les résultats sous forme de réponse JSON
    res.status(200).json({
      totalActive: activeCount,
      totalResilie: resilieCount,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des lignes :", error);
    res.status(500).json({ error: 'Erreur serveur lors du calcul des lignes.' });
  }
};


exports.getLineStats = async (req, res) => {
  try {
    // Compter les lignes actives et résiliées
    const activeCount = await Lignes.count({ where: { statut: 'active' } });
    const resignedCount = await Lignes.count({ where: { statut: 'resilie' } });

    // Calculer le montant total des forfaits
    const totalPrixResult = await sequelize.query(
      "SELECT COALESCE(SUM(CAST(prix AS NUMERIC)), 0) AS total FROM \"Forfaits\";",
      { type: sequelize.QueryTypes.SELECT }
    );
    const totalPrix = totalPrixResult[0].total;

    // Calculer les montants mensuels des forfaits
    const monthlyPrixResult = await sequelize.query(
      `
      SELECT 
        EXTRACT(MONTH FROM date_debut) AS mois,
        COALESCE(SUM(CAST(prix AS NUMERIC)), 0) AS total_mois
      FROM "Forfaits"
      GROUP BY EXTRACT(MONTH FROM date_debut)
      ORDER BY mois;
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Initialiser les montants par mois à 0
    const monthlyPrices = Array(12).fill(0);
    monthlyPrixResult.forEach(({ mois, total_mois }) => {
      monthlyPrices[mois - 1] = total_mois; // Les mois sont indexés à partir de 1
    });

    const currentMonth = new Date().getMonth(); // retourne un index entre 0 et 11

    // Créer un objet des montants mensuels avec un indicateur pour le mois courant
    const monthlyData = monthlyPrices.map((price, index) => ({
      mois: index + 1, // Mois en format 1-12
      total_mois: price,
      isCurrentMonth: index === currentMonth // Vrai pour le mois courant
    }));
    const currentMonthTotal = monthlyData.find(({ isCurrentMonth }) => isCurrentMonth)?.total_mois || 0;

    // Créer des variables pour chaque mois
    const [janvier, fevrier, mars, avril, mai, juin, juillet, aout, septembre, octobre, novembre, decembre] = monthlyPrices;

    res.status(200).json({
      active: activeCount,
      resilie: resignedCount,
      totalMoisCourant: currentMonthTotal,
      totalPrix,
      mois: {
        janvier,
        fevrier,
        mars,
        avril,
        mai,
        juin,
        juillet,
        aout,
        septembre,
        octobre,
        novembre,
        decembre,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques des lignes :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

