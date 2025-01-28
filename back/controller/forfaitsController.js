const { Forfait, HistoriqueForfaits } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const verifierForfaits = async () => {
  try {
    const aujourdHui = moment().format('YYYY-MM-DD');

    // Récupérer les forfaits expirés
    const forfaitsExpirés = await Forfait.findAll({
      where: {
        date_debut: {
          [Op.lte]: aujourdHui, // Date de début inférieure ou égale à aujourd'hui
        },
        validite: {
          [Op.lte]: moment(aujourdHui).diff(moment(Sequelize.col('date_debut')), 'days'),
        },
      },
    });

    // Ajouter les forfaits expirés dans HistoriqueForfaits
    for (const forfait of forfaitsExpirés) {
      await HistoriqueForfaits.create({
        id_forfait: forfait.id_forfait,
        nom_forfait: forfait.nom_forfait,
        prix: forfait.prix,
        validite: forfait.validite,
        date_debut: forfait.date_debut,
        date_fin: moment(forfait.date_debut).add(forfait.validite, 'days').format('YYYY-MM-DD'),
      });

      // Supprimer les forfaits expirés de la table principale
      await forfait.destroy();
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des forfaits :', err);
  }
};

module.exports = {
  verifierForfaits,
};
