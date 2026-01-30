// Données initiales
let aCarnet = [
  {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": "Ludo",
    "Nom": "Vic",
    "Tél": {
      "port": "0601020304",
      "bureau": "0299020304"
    },
    "email": "ludo.vic@lolgroup.com",
    "entreprise": "Rugby Atack"
  },
  {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": "Cloë",
    "Nom": "Von",
    "Tél": {
      "port": "0601020305",
      "bureau": "0299020305"
    },
    "email": "cloe.von@lolgroup.com",
    "entreprise": "Make Up"
  },
  {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": "Olivier",
    "Nom": "Romarin",
    "Tél": {
      "port": "0601020306",
      "bureau": "0299020306"
    },
    "email": "olivier.r@lolgroup.com",
    "entreprise": "Café Corp"
  },
  {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": "Pierre",
    "Nom": "Ruelle",
    "Tél": {
      "port": "0601020307",
      "bureau": "0299020307"
    },
    "email": "pierre.r@lolgroup.com",
    "entreprise": "La Taxe"
  },
  {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": "Douglas",
    "Nom": "Soccer",
    "Tél": {
      "port": "0601020308",
      "bureau": "0299020308"
    },
    "email": "douglas.s@lolgroup.com",
    "entreprise": "Doudou la Frappe"
  }
];

// Initialiser le localStorage avec les données si vide
if (!localStorage.getItem('mesContacts')) {
  localStorage.setItem('mesContacts', JSON.stringify(aCarnet));
}

// Récupérer les contacts depuis le localStorage
let contactsJSON = localStorage.getItem('mesContacts');
let contacts = contactsJSON ? JSON.parse(contactsJSON) : [];

// Créer les éléments de la page
const body = document.querySelector('body');
const main = document.createElement('main');
body.appendChild(main);

// Fonction pour ajouter un contact au DOM
const addContact = (person) => {
  const section = document.createElement('section');
  section.classList = 'section';
  section.id = `section${person.ID}`;

  const card = document.createElement('details');
  card.classList = 'carte';
  card.id = `carte${person.ID}`;

  const summary = document.createElement('summary');
  const glass = document.createElement('div');
  glass.classList = 'glass';
  glass.id = `glass${person.ID}`;

  const divUser = document.createElement('div');
  divUser.classList = 'user';
  summary.appendChild(divUser);

  const divIcone = document.createElement('div');
  divIcone.classList = 'icone';
  divUser.appendChild(divIcone);

  const divInfo = document.createElement('div');
  divInfo.classList = 'info';
  divUser.appendChild(divInfo);

  const icone = document.createElement('i');
  icone.classList.add('fa-solid', 'fa-user-astronaut');
  divIcone.appendChild(icone);

  const spanName = document.createElement('span');
  spanName.classList = 'name';
  divInfo.appendChild(spanName);

  const prenom = document.createElement('h2');
  prenom.classList = 'prenom';
  prenom.textContent = `${person.Prenom.charAt(0).toUpperCase()}${person.Prenom.substring(1).toLowerCase()}`;
  spanName.appendChild(prenom);

  const nom = document.createElement('h2');
  nom.classList = 'nom';
  nom.textContent = `${person.Nom.charAt(0).toUpperCase()}${person.Nom.substring(1).toLowerCase()}`;
  spanName.appendChild(nom);

  const entreprise = document.createElement('h3');
  entreprise.classList = 'entreprise';
  entreprise.textContent = `de ${person.entreprise.toUpperCase()}`;
  divInfo.appendChild(entreprise);

  const divIcon = document.createElement('div');
  divIcon.classList = 'icon';
  divUser.appendChild(divIcon);

  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-address-book');
  divIcon.appendChild(icon);

  const divContact = document.createElement('div');
  divContact.classList = 'contact';
  card.appendChild(divContact);

  const login = document.createElement('p');
  login.textContent = `email: ${person.email}`;
  divContact.appendChild(login);

  const tel = document.createElement('p');
  tel.textContent = `Tél: ${person.Tél.port}`;
  divContact.appendChild(tel);

  const spanEdit = document.createElement('span');
  spanEdit.classList = 'edit';
  divContact.appendChild(spanEdit);

  // Ajouter icône d'édition
  const iconEdit = document.createElement('i');
  iconEdit.classList.add('fa-solid', 'fa-user-pen');
  iconEdit.type = 'button';
  iconEdit.id = `edit${person.ID}`;
  spanEdit.appendChild(iconEdit);

  // Ajouter icône de suppression
  const iconDelete = document.createElement('i');
  iconDelete.classList.add('fa-solid', 'fa-user-minus');
  iconDelete.type = 'button';
  iconDelete.id = `delete${person.ID}`;
  spanEdit.appendChild(iconDelete);

  card.appendChild(summary);
  glass.appendChild(card);
  section.appendChild(card);
  section.appendChild(glass);
  main.appendChild(section);
};

// Fonction pour ouvrir/fermer une carte de contact
const opencard = (carte) => {
  const openDetail = document.querySelector(`#glass${carte.ID}`);
  const detail = document.querySelector(`#carte${carte.ID}`);

  if (openDetail && detail) {
    openDetail.addEventListener('click', () => {
      detail.open = !detail.open;
    });
  }
};

// Fonction pour éditer un contact
const edit = (person) => {
  const openModalEdit = document.querySelector(`#edit${person.ID}`);
  const dialogEdit = document.querySelector('.modalEdit');
  const closeModalEdit = document.querySelector('#annulEdit');
  const closeEditX = document.querySelector('#closeEditX');
  const formEdit = document.querySelector('#edition');

  if (!openModalEdit || !dialogEdit || !formEdit) return;

  // OUVERTURE MODAL
  openModalEdit.addEventListener('click', () => {
    dialogEdit.id = `editing${person.ID}`;

    // Pré-remplissage
    formEdit.elements['Prenom'].value = person.Prenom;
    formEdit.elements['Nom'].value = person.Nom;
    formEdit.elements['Port'].value = person.Tél.port;
    formEdit.elements['Fixe'].value = person.Tél.bureau;
    formEdit.elements['Email'].value = person.email;
    formEdit.elements['Entreprise'].value = person.entreprise;

    // Reset du bouton editer (évite listeners multiples)
    const oldEditBtn = document.querySelector('#editer');
    const newEditBtn = oldEditBtn.cloneNode(true);
    oldEditBtn.replaceWith(newEditBtn);

    // NOUVEAU listener propre
    newEditBtn.addEventListener('click', (e) => {
      e.preventDefault();

      person.Prenom = formEdit.elements['Prenom'].value;
      person.Nom = formEdit.elements['Nom'].value;
      person.Tél.port = formEdit.elements['Port'].value;
      person.Tél.bureau = formEdit.elements['Fixe'].value;
      person.email = formEdit.elements['Email'].value;
      person.entreprise = formEdit.elements['Entreprise'].value;

      // Mise à jour du localStorage
      localStorage.setItem('mesContacts', JSON.stringify(contacts));

      // Rafraîchir l'affichage
      refreshDisplay();

      dialogEdit.close();
    });

    dialogEdit.showModal();
  });

  // FERMETURE MODAL
  if (closeModalEdit) {
    closeModalEdit.addEventListener('click', () => {
      dialogEdit.close();
    });
  }

  // FERMETURE MODAL en cliquant sur la croix
  if (closeEditX) {
    closeEditX.addEventListener('click', () => {
      dialogEdit.close();
    });
  }

  // Clic en dehors du formulaire
  dialogEdit.addEventListener('click', (e) => {
    if (e.target === dialogEdit) {
      dialogEdit.close();
    }
  });
};

// Fonction pour supprimer un contact
const deleted = (ID) => {
  let contacts = JSON.parse(localStorage.getItem('mesContacts')) || [];

  // Trouver l'index du contact à supprimer
  const index = contacts.findIndex(person => person.ID === ID);

  if (index !== -1) {
    // Supprimer le contact du tableau
    contacts.splice(index, 1);

    // Mettre à jour le localStorage
    localStorage.setItem('mesContacts', JSON.stringify(contacts));

    // Rafraîchir l'affichage
    refreshDisplay();
  }
};

// Fonction pour rafraîchir l'affichage des contacts
const refreshDisplay = () => {
  // Récupérer les contacts à jour
  let contacts = JSON.parse(localStorage.getItem('mesContacts')) || [];

  // Effacer le contenu actuel
  main.innerHTML = '';

  // Réafficher tous les contacts
  contacts.forEach(contact => {
    addContact(contact);
    opencard(contact);
    edit(contact);
  });
};

// Afficher chaque contact initial
contacts.forEach(contact => {
  addContact(contact);
  opencard(contact);
  edit(contact);
});

// Créer les boutons pour ajouter un nouveau contact et exporter
const addExportButtonContainer = document.createElement('span');
addExportButtonContainer.classList = 'containerAddExport';

const addContactButton = document.createElement('button');
addContactButton.type = 'button';
addContactButton.classList = 'buttonAdd';
const iconAdd = document.createElement('i');
iconAdd.classList.add('fa-solid', 'fa-user-plus');

const exportBtn = document.createElement('button');
exportBtn.type = 'button';
exportBtn.classList = 'buttonExport';
const iconExport = document.createElement('i');
iconExport.classList.add('fa-solid', 'fa-file-arrow-down');

exportBtn.appendChild(iconExport);
addContactButton.appendChild(iconAdd);
addExportButtonContainer.appendChild(addContactButton);
addExportButtonContainer.appendChild(exportBtn);
body.appendChild(addExportButtonContainer);

// Ouvrir et fermer la modal d'ajout de contact
const openModals = document.querySelector('.buttonAdd');
const dialog = document.querySelector('.modal');
const closeModal = document.querySelector('.annuler');
const closeX = document.querySelector('#closeX');

openModals.addEventListener('click', () => {
  dialog.showModal();
});

closeModal.addEventListener('click', () => {
  dialog.close();
});

// FERMETURE MODAL en cliquant sur la croix
closeX.addEventListener('click', () => {
  dialog.close();
});

// Clic en dehors du formulaire
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) {
    dialog.close();
  }
});

// Fonction pour créer un nouveau contact à partir du formulaire
const getNouveauContact = () => {
  const data = document.forms.add.elements;

  return {
    "ID": `id${Math.random().toString(36).slice(2, 11)}`,
    "Prenom": data['Prenom'].value,
    "Nom": data['Nom'].value,
    "Tél": {
      "port": data['Port'].value,
      "bureau": data['Fixe'].value
    },
    "email": data['Email'].value,
    "entreprise": data['Entreprise'].value
  };
};

// Fonction pour ajouter un nouveau contact
const newcontact = (nouveauContact) => {
  let contacts = JSON.parse(localStorage.getItem('mesContacts')) || [];
  contacts.push(nouveauContact);
  localStorage.setItem('mesContacts', JSON.stringify(contacts));

  // Ajouter le nouveau contact au DOM
  addContact(nouveauContact);
  opencard(nouveauContact);
  edit(nouveauContact);

  // Ajouter event listener pour la suppression
  const iconDelete = document.querySelector(`#delete${nouveauContact.ID}`);
  if (iconDelete) {
    iconDelete.addEventListener('click', () => {
      if (confirm(`Vous allez supprimer ${nouveauContact.Prenom} ${nouveauContact.Nom}`)) {
        const feedbackElement = document.createElement('p');
        feedbackElement.classList.add('feedback');
        feedbackElement.textContent = `Vous avez supprimé ${nouveauContact.Prenom} ${nouveauContact.Nom}`;
        body.appendChild(feedbackElement);

        setTimeout(() => {
          feedbackElement.remove();
        }, 5000);

        deleted(nouveauContact.ID);
      }
    });
  }

  console.log(nouveauContact);
};

// Sélection du formulaire et du bouton Ajouter
const formAdd = document.querySelector('form#formulaire');
const addButton = document.querySelector('#ajouter');

addButton.addEventListener('click', (e) => {
  e.preventDefault();

  const contact = getNouveauContact();
  newcontact(contact);

  formAdd.reset();
  dialog.close();
});

// Prévenir le submit du formulaire d'édition
const formEdit = document.querySelector('#edition');
if (formEdit) {
  formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}

// Ajouter les event listeners pour la suppression des contacts initiaux
contacts.forEach(contact => {
  const iconDelete = document.querySelector(`#delete${contact.ID}`);
  if (iconDelete) {
    iconDelete.addEventListener('click', () => {
      if (confirm(`Vous allez supprimer ${contact.Prenom} ${contact.Nom}`)) {
        const feedbackElement = document.createElement('p');
        feedbackElement.classList.add('feedback');
        feedbackElement.textContent = `Vous avez supprimé ${contact.Prenom} ${contact.Nom}`;
        body.appendChild(feedbackElement);

        setTimeout(() => {
          feedbackElement.remove();
        }, 5000);

        deleted(contact.ID);
      }
    });
  }
});

// Fonction pour exporter le localStorage en JSON
const exportLocalStorageJSON = () => {
  const data = localStorage.getItem('mesContacts');

  if (!data) {
    alert('Aucune donnée à exporter');
    return;
  }

  const prettyData = JSON.stringify(JSON.parse(data), null, 2);
  const blob = new Blob([prettyData], { type: 'application/json' });

  const a = document.createElement('a');
  a.download = 'mesContacts.json';
  a.href = URL.createObjectURL(blob);

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 100);
};

// Event listener pour l'export
exportBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  exportLocalStorageJSON();
  alert('Export terminé !');
});
