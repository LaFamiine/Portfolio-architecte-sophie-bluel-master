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

// boutons "catégories" via l'API
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
let currentFile = null;

// modale galerie
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
    // S'assurer que le formulaire est réinitialisé
    setTimeout(() => {
      resetAddPhotoForm();
    }, 100);
  }
}

function resetAddPhotoForm() {
  const addPhotoForm = document.getElementById("addPhotoForm");
  const validatePhotoBtn = document.getElementById("validatePhotoBtn");

  if (addPhotoForm && validatePhotoBtn) {
    // Réinitialiser le formulaire
    addPhotoForm.reset();
    validatePhotoBtn.disabled = true;
    validatePhotoBtn.style.backgroundColor = "#A7A7A7";
    
    currentFile = null;

    // l'upload area
    const uploadArea = document.getElementById("uploadArea");
    if (uploadArea) {
      uploadArea.innerHTML = `
        <i class="fas fa-image"></i>
        <input type="file" id="photoUpload" accept="image/jpeg, image/png" style="display: none;">
        <button type="button" id="uploadBtn" class="btn-upload">+ Ajouter photo</button>
        <p>jpg, png : 4mo max</p>
      `;
      
      setTimeout(() => {
        attachUploadEvents();
      }, 100);
    }
  }
}

// Gestion de l'upload
function attachUploadEvents() {
  const uploadBtn = document.getElementById("uploadBtn");
  const photoUpload = document.getElementById("photoUpload");
  const validatePhotoBtn = document.getElementById("validatePhotoBtn");

  if (uploadBtn && photoUpload) {
    //S'assurer que l'input est vide au début
    photoUpload.value = "";
    
    uploadBtn.addEventListener("click", () => {
      photoUpload.click();
    });

    photoUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      
      if (!file) {
        // Désactiver le bouton si aucun fichier
        if (validatePhotoBtn) {
          validatePhotoBtn.disabled = true;
          validatePhotoBtn.style.backgroundColor = "#A7A7A7";
        }
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (4Mo maximum)");
        photoUpload.value = "";
        currentFile = null;
        if (validatePhotoBtn) {
          validatePhotoBtn.disabled = true;
          validatePhotoBtn.style.backgroundColor = "#A7A7A7";
        }
        return;
      }

      // Validation du type de fichier
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert("Seuls les fichiers JPG et PNG sont autorisés");
        photoUpload.value = "";
        currentFile = null;
        if (validatePhotoBtn) {
          validatePhotoBtn.disabled = true;
          validatePhotoBtn.style.backgroundColor = "#A7A7A7";
        }
        return;
      }

      // Stocker le fichier actuel
      currentFile = file;

      // Aperçu
      const reader = new FileReader();
      reader.onload = function (e) {
        const uploadArea = document.getElementById("uploadArea");

        if (uploadArea && validatePhotoBtn) {
          uploadArea.innerHTML = `
            <img src="${e.target.result}" class="preview-image" style="max-width: 100%; max-height: 200px; object-fit: contain; display: block;">
            <button type="button" id="changeImageBtn" class="btn-upload">Changer l'image</button>
          `;

          const changeImageBtn = document.getElementById("changeImageBtn");
          if (changeImageBtn) {
            changeImageBtn.addEventListener("click", () => {
              resetAddPhotoForm();
            });
          }

          // Bouton Valider
          validatePhotoBtn.disabled = false;
          validatePhotoBtn.style.backgroundColor = "#1D6154";
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

// Formulaire d'ajout de photo
function initSubmitNewWork() {
  const inputTitle = document.getElementById("photoTitle");
  const selectCategory = document.getElementById("photoCategory");
  const btnValider = document.getElementById("validatePhotoBtn");

  if (!btnValider) {
    return;
  }

  btnValider.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour ajouter un travail");
      window.location.href = "login.html";
      return;
    }

    // NOUVEAU: Utiliser currentFile au lieu de inputImage.files[0]
    if (!currentFile || !inputTitle.value || !selectCategory.value) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Créer FormData pour l'envoi
    const formData = new FormData();
    formData.append("image", currentFile);
    formData.append("title", inputTitle.value);
    formData.append("category", selectCategory.value);

    console.log("Envoi des données à l'API...");

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Réponse reçue:", response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          alert("Session expirée. Veuillez vous reconnecter.");
          window.location.href = "login.html";
          return;
        }
        throw new Error("Erreur API: " + response.status);
      }

      const data = await response.json();
      console.log("Travail ajouté avec succès:", data);
      
      // Réinitialiser complètement le formulaire
      resetAddPhotoForm();
      closeAddPhotoModal();
      
      // Rafraîchir les données
      await refreshAllData();

    } catch (error) {
      console.log("Erreur:", error);
      alert("Erreur lors de l'ajout: " + error.message);
    }
  });
}

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
  } catch (error) {
    console.error("Erreur rafraîchissement:", error);
  }
}

//Charger les catégories pour les filtres
async function loadCategoriesForFilters() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
      categoryData = await response.json();
      btnFiltres(categoryData);
    }
  } catch (error) {
    console.error("Erreur chargement catégories:", error);
  }
}

// Vérifier la validité du token
function checkTokenValidity() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expiration = tokenData.exp * 1000;
      if (Date.now() >= expiration) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        console.log("Token expiré, déconnexion automatique");
      }
    } catch (error) {
      console.error("Erreur vérification token:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  checkTokenValidity();
  
  // Initialiser d'abord les événements
  attachUploadEvents();
  initSubmitNewWork();
  
  // Puis charger les données
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

  // Bouton "modifier" 
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
});