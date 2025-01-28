const { Employe, Lignes } = require('../models');

exports.addEmploye = async (req, res) => {
  try {
    const employe = await Employe.create(req.body);
    res.status(201).json({ message: 'Employé ajouté avec succès', employe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'employé" });
  }
};

exports.getAllEmployes = async (req, res) => {
  try {
    const employes = await Employe.findAll();
    res.status(200).json(employes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des employés." });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { matricule } = req.params;

  try {
    const result = await Employe.destroy({ where: { matricule } });

    if (result === 0) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.updateEmployee = async (req, res) => {
  const { matricule } = req.params;
  const updatedData = req.body;

  try {
    const employee = await Employe.findOne({ where: { matricule } });
    if (!employee) {
      return res.status(404).json({ error: 'Employé non trouvé' });
    }

    await employee.update(updatedData);

    res.status(200).json({
      message: 'Employé mis à jour avec succès',
      employe: employee,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.getEmployeesWithNoLines = async (req, res) => {
  try {
    const employes = await Employe.findAll({
      where: { id_ligne: null },
    });
    res.status(200).json(employes);
  } catch (error) {
    console.error("Erreur lors de la récupération des employés :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

exports.assignLineToEmployee = async (req, res) => {
  const { id_ligne, matricule } = req.body; // Récupère les paramètres depuis le corps de la requête

  if (!id_ligne || !matricule) {
    return res.status(400).json({ error: "Employee ID et Line ID sont requis." });
  }

  try {
    const employe = await Employe.findOne({ where: { matricule } });
    if (!employe) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    const ligne = await Lignes.findOne({
      where: { id_ligne, etat_assignation: false },
    });
    if (!ligne) {
      return res.status(404).json({ error: "Ligne non disponible pour l'assignation." });
    }

    await employe.update({ id_ligne });
    await ligne.update({ etat_assignation: true });

    res.status(200).json({ message: "Ligne assignée avec succès à l'employé." });
  } catch (error) {
    console.error("Erreur lors de l'assignation :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

