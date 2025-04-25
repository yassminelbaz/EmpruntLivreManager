module.exports = {
  EMAIL: {
    REQUIRED : "Email est obligatoire",
    INVALID : "email invalide ex: user@example.com",
    USED : "Email est deja utilisé",
    INCORRECT: "Email est incorrect"
  },

  PASSWORD: {
    REQUIRED : "Mot de passe est obligatoire",
    INVALID : "8 caractères minimum requis",
    INCORRECT: "Password est incorrect"
  },
   
  BORROW: {
    LIMIT_REACHED:"Vous avez deja un livr emprunté",
    NO_ACTIVE: "Aucun emprunt actif trouvé",
    ALREADY_RETURNED: "Livre deja retourné"
  },

  BOOK: {
    NOT_FOUND: "Livre non trouvé",
    NOT_AVAILABLE: "Livre deja emprunté",
    TITLE_REQUIRED: "Le titre est obligatoire",
    AUTHOR_REQUIRED: "L'auteur est obligatoire",
    INVALID_GENRE: "Genre invalide"
  },

  VALIDATION: {
    NO_CHANGES: "Aucun modification fournie",
    INVALID_ID: "ID invalide"
  }



};