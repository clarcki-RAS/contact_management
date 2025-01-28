const { Forfaits, HistoriqueForfaits, Lignes } = require('../models');

// Contrôleur pour les forfaits
const forfaitController = {
  // Ajouter un forfait avec gestion de l'historique
  async ajouterForfait(req, res) {
    try {
      const { nom_forfait, prix, validite, date_debut, id_ligne } = req.body;

      // Vérification de l'existence de la ligne associée
      const ligne = await Lignes.findByPk(id_ligne);
      if (!ligne) {
        return res.status(404).json({ message: "La ligne associée n'existe pas." });
      }

      // Vérifier si un forfait existe déjà pour cette ligne
      const forfaitExistant = await Forfaits.findOne({
        where: { id_ligne },
      });

      if (forfaitExistant) {
        // Déplacer l'ancien forfait dans l'historique
        await HistoriqueForfaits.create({
          id_ligne: forfaitExistant.id_ligne,
          id_forfait: forfaitExistant.id_forfait,
          prix: forfaitExistant.prix,
          validite: forfaitExistant.validite,
          date_debut: forfaitExistant.date_debut,
        });

        // Supprimer l'ancien forfait
        await Forfaits.destroy({
          where: { id_forfait: forfaitExistant.id_forfait },
        });
      }

      // Créer le nouveau forfait
      const nouveauForfait = await Forfaits.create({
        nom_forfait,
        prix,
        validite,
        date_debut,
        id_ligne,
      });

      res.status(201).json({
        message: 'Forfait ajouté avec succès.',
        forfait: nouveauForfait,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue.', error });
    }
  },
};

module.exports = forfaitController;
