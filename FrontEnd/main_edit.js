// Sélection des éléments
const openModalBtn = document.getElementById('openModalBtn');
const galleryModal = document.getElementById('galleryModal');
const closeModal = document.querySelector('.close-modal');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const modalGallery = document.getElementById('modalGallery');

// Fonction pour ouvrir la modale
function openModal() {
  galleryModal.style.display = 'block';
  loadGalleryImages();
}

// Fonction pour fermer la modale
function closeGalleryModal() {
  galleryModal.style.display = 'none';
}

// Charger les images dans la galerie modale
async function loadGalleryImages() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    
    modalGallery.innerHTML = ''; // Vider la galerie
    
    works.forEach(work => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
      `;
      modalGallery.appendChild(galleryItem);
    });
  } catch (error) {
    console.error('Erreur chargement galerie:', error);
  }
}

// Événements
openModalBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeGalleryModal);
addPhotoBtn.addEventListener('click', function() {
  // Ici vous pouvez ouvrir une autre modale pour ajouter une photo
  console.log('Ouvrir modale ajout photo');
});

// Fermer la modale en cliquant en dehors
galleryModal.addEventListener('click', function(event) {
  if (event.target === galleryModal) {
    closeGalleryModal();
  }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && galleryModal.style.display === 'block') {
    closeGalleryModal();
  }
});