/* ==========================================================================
   Données des événements
   Ajouter un événement = ajouter un objet dans ce tableau.
   Les pages evenements.html et evenement.html se construisent à partir d’ici.
   ========================================================================== */

const EVENEMENTS = [
  {
    id: "repas-raclette-2027",
    titre: "Repas raclette à volonté",
    debut: "2027-03-06T18:30",
    fin: null,
    ouverture: null,
    couleur: "corail",
    lieu: {
      nom: "Salle Polyvalente",
      adresse: "",
      codePostal: "56140",
      ville: "Caro"
    },
    tarif: "14 €",
    resume: "Apéro (kir ou soft), raclette à volonté, gâteau et café. On vous attend nombreux pour un repas convivial !",
    affiche: {
      src: "assets/img/affiche-lara-clette.png",
      largeur: 596,
      hauteur: 843,
      alt: "Affiche « Lara Clette » du repas raclette : samedi 6 mars 2027 à 18h30, salle polyvalente de Caro, 14 €. Au menu : apéro (kir ou soft), raclette, gâteau et café."
    },
    reservation: "#reserver",
    sections: [
      {
        titre: "Au menu",
        liste: ["Apéro (kir ou soft)", "Raclette à volonté", "Gâteau", "Café"]
      }
    ]
  },
  {
    id: "loto-de-paques-2027",
    titre: "Loto de Pâques",
    debut: "2027-03-29T14:00",
    fin: "2027-03-29T18:00",
    ouverture: "11h30",
    couleur: "turquoise",
    lieu: {
      nom: "Salle des fêtes",
      adresse: "Place de la Mairie",
      codePostal: "56800",
      ville: "Ploërmel"
    },
    tarif: "à partir de 3 €",
    resume: "Bons d’achat de 1 100 €, 600 €, 300 €, 2 × 200 €, 5 × 100 € et de nombreux autres lots. Buvette et restauration sur place.",
    affiche: null,
    reservation: null,
    sections: [
      {
        titre: "Lots à gagner",
        liste: [
          "Bon d’achat de 1 100 €",
          "Bon d’achat de 600 €",
          "Bon d’achat de 300 €",
          "2 bons d’achat de 200 €",
          "5 bons d’achat de 100 €",
          "Nombreux autres bons d’achat de 50 € à 30 €, tous divisibles",
          "Loto perso : bons d’achat de 50 €, 100 € et 150 €"
        ]
      },
      {
        titre: "Tarifs",
        tarifs: [
          ["La plaque de 10 + 2 offertes", "20 €"],
          ["La plaque de 8 + 1 offerte", "18 €"],
          ["La plaque de 6 + 1 offerte", "15 €"],
          ["La plaque de 3", "8 €"],
          ["La carte simple", "3 €"],
          ["Les 4 cartes loto perso", "10 €"],
          ["La carte loto perso", "3 €"]
        ]
      },
      {
        titre: "Buvette et restauration",
        texte: "Buvette et restauration sur place. Formule plateau : sandwich, gâteau et boisson = 1 carte offerte."
      }
    ]
  }
];
