// src/signup-controller.ts

export const handleSubmit = (event: React.FormEvent<HTMLFormElement>, password: string) => {
    event.preventDefault(); // Empêche le rechargement de la page
    
    // Traitement des données
    console.log('Mot de passe soumis:', password);
    
    // Vous pouvez également effectuer des appels API ou des validations ici
  };
  