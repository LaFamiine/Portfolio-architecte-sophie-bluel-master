// Fonction pour afficher les travaux

function showWork(workData) {
    // Récupérer la classe gallery
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Créer une boucle qui va permettre de renseigner les informations pour créer les balises nécessaires aux travaux
    // Créer une balise figure et lui attribuer un id
    workData.forEach((element) => {
        const figure = document.createElement("figure");
        figure.setAttribute("id", element.id);
        // Créer une balise img et lui attribuer sa source et son attribut ALT
        const img = document.createElement("img");
        img.setAttribute("src", element.imageUrl);
        img.setAttribute("alt", element.title);
        // Créer une balise figcaption et lui attribuer son titre
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = element.title;
        // Intégrer la figure dans l'élément parent "gallery"
        gallery.appendChild(figure);
        // Intégrer l'image et le figcaption dans l'élément parent "figure"
        figure.appendChild(img);
        figure.appendChild(figcaption);
    });
}

// Créer une boucle pour afficher les boutons "catégories" via l'API
// Au clic, il faut afficher les travaux qui ont le même id que le bouton sélectionné

function btnFiltres(categoryData) {
    const filters = document.querySelector(".filters");
    // Créer le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";

    allButton.addEventListener("click", () => {
    showWork(workData);
    });
    filters.appendChild(allButton);

    //categorieData = données de l'API
    categoryData.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.setAttribute("data-category", category.id);
        button.addEventListener("click", () => {
        const filteredWorks = workData.filter((work) => work.categoryId === category.id);
        showWork(filteredWorks);
        
        });
        
        filters.appendChild(button);
    });
}

// Conditions token
const log = document.querySelector('.log li');

if(localStorage.getItem('token')){
    // Mode connecté - bouton logout
    const btnLogout = document.createElement('button');
    btnLogout.classList.add("logout"); // ← Correction ici
    btnLogout.innerText = "logout";

    // Événement de déconnexion
    btnLogout.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html"; // Redirection
    });

    log.appendChild(btnLogout);
} else {
    // Mode déconnecté - lien login
    const btnLogin = document.createElement('a');
    btnLogin.href = "formulaire.html";
    btnLogin.innerText = "login";
    btnLogin.classList.add("login-link"); // Optionnel

    log.appendChild(btnLogin);
}

function toggleFilters() {
    const token = localStorage.getItem('token');
    const filters = document.querySelector('.filters');
    
    if (filters) {
        if (token) {
            // Connecté - cacher les filtres
            filters.style.display = 'none';
        } else {
            // Déconnecté - montrer les filtres
            filters.style.display = 'flex';
        }
    }
}

toggleFilters();

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log("Modale initialisation...");
    
    // Sélection des éléments
    const editProjectsBtn = document.getElementById('editProjectsBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeModal = document.querySelector('.close-modal');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const modalGallery = document.getElementById('modalGallery');

    // Fonction pour ouvrir la modale
    function openModal() {
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        loadGalleryImages();
    }

    // Fonction pour fermer la modale
    function closeGalleryModal() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Charger les images depuis l'API
    async function loadGalleryImages() {
        try {
            console.log("Chargement des images API...");
            const response = await fetch('http://localhost:5678/api/works');
            
            if (!response.ok) throw new Error('API non disponible');
            
            const works = await response.json();
            console.log("Images chargées:", works.length);
            
            modalGallery.innerHTML = '';
            
            works.forEach(work => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <div class="delete-icon" data-id="${work.id}">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                `;
                modalGallery.appendChild(galleryItem);
            });
            
        } catch (error) {
            console.error('Erreur chargement:', error);
            modalGallery.innerHTML = `
                <div style="grid-column: 1 / -1; color: red; padding: 20px;">
                    Erreur de chargement: ${error.message}
                </div>
            `;
        }
    }
    

    // ÉVÉNEMENTS
    if (editProjectsBtn) {
        editProjectsBtn.addEventListener('click', openModal);
        console.log("Event listener ajouté au bouton modifier");
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeGalleryModal);
    }

    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function() {
            console.log(" Bouton ajouter photo cliqué");
            // Ici vous pourrez ajouter la 2ème modale plus tard
        });
    }

    // Fermer en cliquant en dehors
    galleryModal.addEventListener('click', function(event) {
        if (event.target === galleryModal) {
            closeGalleryModal();
        }
    });
});