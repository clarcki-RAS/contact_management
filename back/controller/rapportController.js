const { Rapport } = require('../models');
exports.addRapport = async (req, res) => {
  try {
    console.log('Données reçues dans req.body :', req.body); // Ajout du log

    const { date_redaction, contenue } = req.body;

    if (!date_redaction || !contenue) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const newRapport = await Rapport.create({ date_redaction, contenue });
    res.status(201).json(newRapport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’ajout du rapport.' });
  }
};
exports.getRapports = async (req, res) => {
  try {
    const rapports = await Rapport.findAll();
    res.status(200).json(rapports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des rapports." });
  }
};
exports.deletRapports = async (req, res) => {
  try {
    const { id_rapport } = req.query; // Récupérer l'ID à partir de la query string
    if (!id_rapport) {
      return res.status(400).json({ error: "L'ID du rapport est requis." });
    }

    const deletedReport = await Rapport.destroy({ where: { id_rapport } });
    if (deletedReport) {
      res.status(200).json({ message: "Rapport supprimé avec succès." });
    } else {
      res.status(404).json({ error: "Rapport non trouvé." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du rapport." });
  }
};
