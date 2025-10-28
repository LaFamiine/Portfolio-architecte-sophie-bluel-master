// Fonction pour afficher les travaux
function showWork(workData) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    workData.forEach((element) => {
        const figure = document.createElement("figure");
        figure.setAttribute("id", element.id);
        const img = document.createElement("img");
        img.setAttribute("src", element.imageUrl);
        img.setAttribute("alt", element.title);
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = element.title;
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    });
}

// Afficher la barre admin si connecté
function initAdminBar() {
    const token = localStorage.getItem('token');
    if (token) {
        if (!document.getElementById('adminBar')) {
            document.body.insertAdjacentHTML('afterbegin', adminBarHTML);
            document.body.classList.add('admin-mode');
        } else {
            const adminBar = document.getElementById('adminBar');
            adminBar.style.display = 'block';
            document.body.classList.add('admin-mode');
        }
    } else {
        // Cacher la barre si déconnecté
        const adminBar = document.getElementById('adminBar');
        if (adminBar) {
            adminBar.style.display = 'none';
            document.body.classList.remove('admin-mode');
        }
    }
}

// Créer une boucle pour afficher les boutons "catégories" via l'API
function btnFiltres(categoryData) {
    const filters = document.querySelector(".filters");
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";

    allButton.addEventListener("click", () => {
        showWork(workData);
    });
    filters.appendChild(allButton);

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

// Variables globales pour les modales
let addPhotoModal, closeAddPhotoModalBtn;
let workData = [];
let categoryData = [];

// Seconde modale
function openAddPhotoModal() {
    if (addPhotoModal) {
        addPhotoModal.style.display = 'block';
        closeGalleryModal();
    }
}

function closeAddPhotoModal() {
    if (addPhotoModal) {
        addPhotoModal.style.display = 'none';
        resetAddPhotoForm();
    }
}

function resetAddPhotoForm() {
    const addPhotoForm = document.getElementById('addPhotoForm');
    const validatePhotoBtn = document.getElementById('validatePhotoBtn');
    
    if (addPhotoForm && validatePhotoBtn) {
        addPhotoForm.reset();
        validatePhotoBtn.disabled = true;
        
        const preview = document.querySelector('.preview-image');
        if (preview) {
            preview.style.display = 'none';
        }
        
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
         
            attachUploadEvents();
        }
    }
}

// Gestion de l'upload d'image
function attachUploadEvents() {
    const uploadBtn = document.getElementById('uploadBtn');
    const photoUpload = document.getElementById('photoUpload');
    
    if (uploadBtn && photoUpload) {
        uploadBtn.addEventListener('click', () => {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 4 * 1024 * 1024) {
                    alert('Le fichier est trop volumineux (4Mo maximum)');
                    return;
                }
                
                // Aperçu
                const reader = new FileReader();
                reader.onload = function(e) {
                    const uploadArea = document.getElementById('uploadArea');
                    const validatePhotoBtn = document.getElementById('validatePhotoBtn');
                    
                    if (uploadArea && validatePhotoBtn) {
                        uploadArea.innerHTML = `
                            <img src="${e.target.result}" class="preview-image" style="display: block;">
                            <button type="button" id="changeImageBtn" class="btn-upload">Changer l'image</button>
                        `;
                        
                        const changeImageBtn = document.getElementById('changeImageBtn');
                        if (changeImageBtn) {
                            changeImageBtn.addEventListener('click', () => {
                                photoUpload.click();
                            });
                        }

                        // Bouton Valider
                        validatePhotoBtn.disabled = false;
                    }
                };
                reader.readAsDataURL(file);
            }
            const validatePhotoBtn = document.getElementById('validatePhotoBtn');
    if (validatePhotoBtn) {
        validatePhotoBtn.disabled = true;
    }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAdminBar();

    // Token
    const log = document.querySelector('.log li');
    if(localStorage.getItem('token')){
        const btnLogout = document.createElement('button');
        btnLogout.classList.add("logout");
        btnLogout.innerText = "logout";
        btnLogout.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = "index.html";
        });
        log.appendChild(btnLogout);
    } else {
        const btnLogin = document.createElement('a');
        btnLogin.href = "formulaire.html";
        btnLogin.innerText = "login";
        btnLogin.classList.add("login-link");
        log.appendChild(btnLogin);
    }

    // Gestion des filtres
    function toggleFilters() {
        const token = localStorage.getItem('token');
        const filters = document.querySelector('.filters');
        if (filters) {
            filters.style.display = token ? 'none' : 'flex';
        }
    }
    toggleFilters();

    // MODALE si connecté
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    console.log("Mode admin activé - initialisation modale...");

    // Bouton "modifier"
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection && !document.getElementById('editProjectsBtn')) {
        const editButton = document.createElement('button');
        editButton.id = 'editProjectsBtn';
        editButton.innerHTML = '<i class="fas fa-edit"></i> modifier';
        editButton.style.cssText = `
            background: none;
            border: none;
            color: black;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        `;
        
        const title = portfolioSection.querySelector('h2');
        if (title) {
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.justifyContent = 'center';
            title.style.gap = '10px';
            title.appendChild(editButton);
            console.log("Bouton modifier créé");
        }
    }

    const editProjectsBtn = document.getElementById('editProjectsBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeModal = document.querySelector('.close-modal');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const modalGallery = document.getElementById('modalGallery');
    
    addPhotoModal = document.getElementById('addPhotoModal');
    closeAddPhotoModalBtn = document.querySelector('.close-add-photo-modal');

    // Fonction pour ouvrir la modale galerie
    function openModal() {
        console.log("Ouverture modale...");
        if (galleryModal) {
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            loadGalleryImages();
        } else {
            console.log("Modale non trouvée");
        }
    }

    // Fermer la modale galerie
    function closeGalleryModal() {
        if (galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Charger les images depuis l'API
    async function loadGalleryImages() {
        try {
            console.log("Chargement des images API...");
            const response = await fetch('http://localhost:5678/api/works');
            
            if (!response.ok) throw new Error('API non disponible');
            
            const works = await response.json();
            console.log("Images chargées:", works.length);
            
            if (modalGallery) {
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
            }
            
        } catch (error) {
            console.error('Erreur chargement:', error);
            if (modalGallery) {
                modalGallery.innerHTML = `
                    <div style="grid-column: 1 / -1; color: red; padding: 20px;">
                        Erreur de chargement: ${error.message}
                    </div>
                `;
            }
        }
    }

    // Formulaire d'ajout de photo
   async function submitNewWork(title, categoryId, imageFile) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Vous devez être connecté pour ajouter un travail');
        return false;
    }

    // Créer FormData pour l'envoi
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', title);
    formData.append('category', categoryId);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            
            await refreshAllData();
            
            return true;
        } else {
            const error = await response.text();
            console.error('Erreur API:', error);
            return false;
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
        return false;
    }
}

async function refreshAllData() {
    try {
        console.log("Rafraîchissement des données...");
        
        // Rafraîchir les works
        const worksResponse = await fetch("http://localhost:5678/api/works");
        if (worksResponse.ok) {
            workData = await worksResponse.json();
            showWork(workData);
        };
        
    } catch (error) {
        console.error('Erreur rafraîchissement:', error);
    }
}
    
    // ÉVÉNEMENTS
    if (editProjectsBtn) {
        editProjectsBtn.addEventListener('click', openModal);
        console.log("Event listener ajouté au bouton modifier");
    } else {
        console.log("Bouton modifier non trouvé");
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeGalleryModal);
    }

    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', openAddPhotoModal);
    }

    if (closeAddPhotoModalBtn) {
        closeAddPhotoModalBtn.addEventListener('click', closeAddPhotoModal);
    }
    
    if (addPhotoModal) {
        addPhotoModal.addEventListener('click', function(event) {
            if (event.target === addPhotoModal) {
                closeAddPhotoModal();
            }
        });
    }
    attachUploadEvents();

}); 