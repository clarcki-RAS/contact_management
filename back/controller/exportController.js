const ExcelJS = require('exceljs');
const { Employe } = require('../models'); // Assurez-vous que le modèle Employe est correctement importé

exports.exportEmployesToExcel = async (req, res) => {
  try {
    // 1. Récupérer les données de la table Employe
    const employes = await Employe.findAll({
      attributes: [
        'matricule',
        'nom',
        'prenom',
        'siege',
        'localiteTravail',
        'fonction',
        'classification',
        'affectationPrecedente',
        'dateEmbauche',
        'email',
        'contactPersonnel',
      ],
    });

    if (!employes.length) {
      return res.status(404).json({ error: "Aucun employé trouvé." });
    }

    // 2. Créer un workbook et une feuille Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employes');

    // 3. Ajouter les colonnes
    worksheet.columns = [
      { header: 'MATRICULE', key: 'matricule', width: 15 },
      { header: 'NOM', key: 'nom', width: 20 },
      { header: 'PRÉNOM', key: 'prenom', width: 20 },
      { header: 'SIÈGE', key: 'siege', width: 20 },
      { header: 'LOCALITÉ DE TRAVAIL', key: 'localiteTravail', width: 20 },
      { header: 'FONCTION', key: 'fonction', width: 20 },
      { header: 'CLASSIFICATION', key: 'classification', width: 20 },
      { header: 'AFFECTATION PRÉCÉDENTE', key: 'affectationPrecedente', width: 25 },
      { header: 'DATE D\'EMBAUCHE', key: 'dateEmbauche', width: 15 },
      { header: 'EMAIL', key: 'email', width: 25 },
      { header: 'CONTACT PERSONNEL', key: 'contactPersonnel', width: 20 },
    ];

    // 4. Ajouter les données
    worksheet.addRows(employes.map((e) => e.toJSON()));

    // 5. Appliquer le style à la première ligne (en-têtes)
    const headerRow = worksheet.getRow(1); // Récupère la première ligne (en-têtes)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Texte 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF5C47' }, // Fond 
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrer le texte
    });

    // 6. Configurer les en-têtes HTTP pour le téléchargement
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Employes.xlsx'
    );

    // 7. Envoyer le fichier Excel
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Erreur lors de l\'exportation des employés:', error);
    res.status(500).json({ error: 'Erreur lors de l\'exportation des employés.' });
  }
};
