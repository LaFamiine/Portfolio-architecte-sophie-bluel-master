async function loadWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (response.ok) {
      workData = await response.json();
      console.log("Travaux chargés:", workData.length);
      showWork(workData);

      // Charger aussi les catégories pour les filtres si pas connecté
      const token = localStorage.getItem("token");
      if (!token) {
        loadCategoriesForFilters();
      }
    } else {
      console.error("Erreur chargement works:", response.status);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Fonction pour afficher les travaux
function showWork(workData) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  workData.forEach((element) => {
    const figure = document.createElement("figure");
    figure.setAttribute("id", element.id);
    const img = document.createElement("img");
    img.src = `${element.imageUrl}?t=${new Date().getTime()}`;
    img.alt = element.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = element.title;
    gallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
  });
}

// Afficher la barre admin si connecté
function initAdminBar() {
  const token = localStorage.getItem("token");
  if (token) {
    if (!document.getElementById("adminBar")) {
      document.body.insertAdjacentHTML("afterbegin", adminBarHTML);
      document.body.classList.add("admin-mode");
    } else {
      const adminBar = document.getElementById("adminBar");
      adminBar.style.display = "block";
      document.body.classList.add("admin-mode");
    }
  } else {
    // Cacher la barre si déconnecté
    const adminBar = document.getElementById("adminBar");
    if (adminBar) {
      adminBar.style.display = "none";
      document.body.classList.remove("admin-mode");
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

// Ouvrir la modale galerie
function openGalleryModal() {
  const galleryModal = document.getElementById("galleryModal");
  if (galleryModal) {
    galleryModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    loadGalleryImages();
  } else {
    console.log("Modale galerie non trouvée");
  }
}

async function loadGalleryImages() {
  try {
     const timestamp = new Date().getTime();
    const response = await fetch(`http://localhost:5678/api/works?t=${timestamp}`);

    if (!response.ok) throw new Error("API non disponible");

    const works = await response.json();
    console.log("Images chargées dans modale:", works.length);

    const modalGallery = document.getElementById("modalGallery");
    if (modalGallery) {
      modalGallery.innerHTML = "";

      works.forEach((work) => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `
                    <img src="${work.imageUrl}?t=${timestamp}" alt="${work.title}">
                    <div class="delete-icon" data-id="${work.id}">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                `;
        modalGallery.appendChild(galleryItem);
      });

      addDeleteEvents();
    }
  } catch (error) {
    console.error("Erreur chargement modale:", error);
  }
}

// ÉVÉNEMENTS DE SUPPRESSION
function addDeleteEvents() {
  const deleteIcons = document.querySelectorAll(".delete-icon");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const workId = this.getAttribute("data-id");
      if (workId && confirm("Voulez-vous vraiment supprimer ce projet ?")) {
        deleteWork(workId);
      }
    });
  });
}

// FONCTION POUR SUPPRIMER UN TRAVAIL
async function deleteWork(workId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté");
    return false;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Projet supprimé avec succès");
      loadGalleryImages();
      loadWorks();
      return true;
    } else {
      const error = await response.text();
      alert("Erreur suppression: " + error);
      return false;
    }
  } catch (error) {
    alert("Erreur connexion serveur");
    return false;
  }
}

// Seconde modale
function closeGalleryModal() {
  const galleryModal = document.getElementById("galleryModal");
  if (galleryModal) {
    galleryModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function openAddPhotoModal() {
  if (addPhotoModal) {
    addPhotoModal.style.display = "block";
    closeGalleryModal();
  }
}

function closeAddPhotoModal() {
  if (addPhotoModal) {
    addPhotoModal.style.display = "none";
    resetAddPhotoForm();
  }
}

function resetAddPhotoForm() {
    const addPhotoForm = document.getElementById('addPhotoForm');
    const validatePhotoBtn = document.getElementById('validatePhotoBtn');
    
    if (addPhotoForm && validatePhotoBtn) {
        addPhotoForm.reset();
        validatePhotoBtn.disabled = true;
        
        // RÉINITIALISER COMPLÈTEMENT L'UPLOAD AREA
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fas fa-image"></i>
                <input type="file" id="photoUpload" accept="image/*" style="display: none;">
                <button type="button" id="uploadBtn" class="btn-upload">+ Ajouter photo</button>
                <p>jpg, png : 4mo max</p>
            `;
            // Réattacher les événements
            attachUploadEvents();
        }
    }
}

// Gestion de l'upload d'image
function attachUploadEvents() {
  const uploadBtn = document.getElementById("uploadBtn");
  const photoUpload = document.getElementById("photoUpload");

  if (uploadBtn && photoUpload) {
    uploadBtn.addEventListener("click", () => {
      photoUpload.click();
    });

    photoUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 4 * 1024 * 1024) {
          alert("Le fichier est trop volumineux (4Mo maximum)");
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
      const validatePhotoBtn = document.getElementById("validatePhotoBtn");
      if (validatePhotoBtn) {
        validatePhotoBtn.disabled = true;
      }
    });
  }
}

// Formulaire d'ajout de photo
function initSubmitNewWork() {
  const form = document.getElementById("addPhotoForm");
  const inputImage = document.getElementById("photoUpload");
  const inputTitle = document.getElementById("photoTitle");
  const selectCategory = document.getElementById("photoCategory");
  const btnValider = document.getElementById("validatePhotoBtn");

  if (!btnValider) {
    return;
  }

  btnValider.addEventListener("click", (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour ajouter un travail");
      return false;
    }

    // Vérifier que tous les champs sont remplis
    if (!inputImage.files[0] || !inputTitle.value || !selectCategory.value) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Créer FormData pour l'envoi
    const formData = new FormData();
    formData.append("image", inputImage.files[0]);
    formData.append("title", inputTitle.value);
    formData.append("category", selectCategory.value);

    console.log("Envoi des données à l'API...");

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        console.log("Réponse reçue:", response.status);
        if (!response.ok) {
          throw new Error("Erreur API: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Travail ajouté avec succès:", data);
        closeAddPhotoModal();
        refreshAllData();
        
        setTimeout(() => {
    refreshAllData();
  }, 300);
})
      })
      .catch((error) => {
        console.log("Erreur:", error);
        alert("Erreur lors de l'ajout: " + error.message);
      });

    e.stopPropagation();
  };

async function refreshAllData() {
  try {
    const timestamp = new Date().getTime();
    const worksResponse = await fetch("http://localhost:5678/api/works?t=" + timestamp);
    if (worksResponse.ok) {
      workData = await worksResponse.json();
      showWork(workData);
    }

    // Rafraîchir aussi la modale si elle est ouverte
    const galleryModal = document.getElementById("galleryModal");
    if (galleryModal && galleryModal.style.display === "flex") {
      loadGalleryImages();
    }
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", function () {
  loadWorks();
  initAdminBar();

  // Token
  const log = document.querySelector(".log li");
  if (localStorage.getItem("token")) {
    const btnLogout = document.createElement("button");
    btnLogout.classList.add("logout");
    btnLogout.innerText = "logout";
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    });
    log.appendChild(btnLogout);
  } else {
    const btnLogin = document.createElement("a");
    btnLogin.href = "formulaire.html";
    btnLogin.innerText = "login";
    btnLogin.classList.add("login-link");
    log.appendChild(btnLogin);
  }

  // Gestion des filtres
  function toggleFilters() {
    const token = localStorage.getItem("token");
    const filters = document.querySelector(".filters");
    if (filters) {
      filters.style.display = token ? "none" : "flex";
    }
  }
  toggleFilters();

  // MODALE si connecté
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  // SÉLECTIONNER LES ÉLÉMENTS MODALES
  const editProjectsBtn = document.getElementById("editProjectsBtn");
  const galleryModal = document.getElementById("galleryModal");
  const closeModal = document.querySelector(".close-modal");
  const addPhotoBtn = document.getElementById("addPhotoBtn");
  addPhotoModal = document.getElementById("addPhotoModal");
  closeAddPhotoModalBtn = document.querySelector(".close-add-photo-modal");

  console.log("Éléments modales:", {
    editProjectsBtn: !!editProjectsBtn,
    galleryModal: !!galleryModal,
    closeModal: !!closeModal,
    addPhotoBtn: !!addPhotoBtn,
    addPhotoModal: !!addPhotoModal,
    closeAddPhotoModalBtn: !!closeAddPhotoModalBtn,
  });

  // Bouton "modifier" - CORRECTION
  const portfolioSection = document.getElementById("portfolio");
  if (portfolioSection) {
    // Créer le bouton avec ID
    const editButton = document.createElement("button");
    editButton.id = "editProjectsBtn";
    editButton.innerHTML = '<i class="fas fa-edit"></i> modifier';
    editButton.style.cssText = `
            background: none;
            border: none;
            color: black;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        `;

    const title = portfolioSection.querySelector("h2");
    if (title) {
      title.style.display = "flex";
      title.style.alignItems = "center";
      title.style.justifyContent = "center";
      title.style.gap = "10px";
      title.appendChild(editButton);
      console.log("Bouton modifier créé avec ID");
    }
  }

  // ÉVÉNEMENTS

  const newEditBtn = document.getElementById("editProjectsBtn");
  if (newEditBtn) {
    newEditBtn.addEventListener("click", openGalleryModal);
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeGalleryModal);
  }

  if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", openAddPhotoModal);
  }

  if (closeAddPhotoModalBtn) {
    closeAddPhotoModalBtn.addEventListener("click", closeAddPhotoModal);
  }

  if (addPhotoModal) {
    addPhotoModal.addEventListener("click", function (event) {
      if (event.target === addPhotoModal) {
        closeAddPhotoModal();
      }
    });
  }

  if (galleryModal) {
    galleryModal.addEventListener("click", function (event) {
      if (event.target === galleryModal) {
        closeGalleryModal();
      }
    });
  }

  attachUploadEvents();
  initSubmitNewWork();
});
