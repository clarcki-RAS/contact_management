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
  
  module.exports = { reactivateLigne };
  
  import axios from 'axios';

const reactivateLigne = async (id) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/contacts/${id}/reactiver`);
    console.log(response.data.message);
  } catch (error) {
    console.error('Erreur lors de la réactivation:', error.response?.data || error.message);
  }
};
