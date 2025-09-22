// Appel des API
 async function apiWork() {
  const response = await fetch("http://localhost:5678/api/works");
  console.log(response);
  if (response.ok) {
    return response.json();
  } else {
    console.log("Erreur : " + response.status);
  }
}

// Création de apiWork et intégrer la fonction showWork

[
  {
    "id": 0,
    "title": "Abajour Tahina",
    "imageUrl": "http://localhost:5678/images/abajour-tahina1651286843956.png",
    "categoryId": 1,
    "userId": 0,
    "category": {
      "id": 1,
      "name": "Objets"
    }
  },
  {
    "id": 1,
    "title": "Appartement Paris V",
    "imageUrl": "http://localhost:5678/images/appartement-paris-v.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 2,
    "title": "Restaurant Sushisen - Londres",
    "imageUrl": "http://localhost:5678/images/restaurant-sushisen-londres.png",
    "categoryId": 3,
    "userId": 0,
    "category": {
      "id": 3,
      "name": "Objets"
    }
  },
  {
    "id": 3,
    "title": "Villa \"La Balisiere\" - Port Louis",
    "imageUrl": "http://localhost:5678/images/la-balisiere.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 4,
    "title": "Structures Thermopolis",
    "imageUrl": "http://localhost:5678/images/structures-thermopolis.png",
    "categoryId": 1,
    "userId": 0,
    "category": {
      "id": 1,
      "name": "Objets"
    }
  },
  {
    "id": 5,
    "title": "Appartement Paris X",
    "imageUrl": "http://localhost:5678/images/appartement-paris-x.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 6,
    "title": "Pavillon \"Le coteau\" - Cassis",
    "imageUrl": "http://localhost:5678/images/le-coteau-cassis.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 7,
    "title": "Villa Ferneze - Isola d'Elba",
    "imageUrl": "http://localhost:5678/images/villa-ferneze.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 8,
    "title": "Appartement Paris XVIII",
    "imageUrl": "http://localhost:5678/images/appartement-paris-xviii.png",
    "categoryId": 2,
    "userId": 0,
    "category": {
      "id": 2,
      "name": "Objets"
    }
  },
  {
    "id": 9,
    "title": "Bar \"Lullaby\" - Paris",
    "imageUrl": "http://localhost:5678/images/bar-lullaby-paris.png",
    "categoryId": 3,
    "userId": 0,
    "category": {
      "id": 3,
      "name": "Objets"
    }
  },
  {
    "id": 10,
    "title": "Hotel First Arte - New Delhi",
    "imageUrl": "http://localhost:5678/images/hotel-first-arte-new-delhi.png",
    "categoryId": 3,
    "userId": 0,
    "category": {
      "id": 3,
      "name": "Objets"
    }
  }
]
