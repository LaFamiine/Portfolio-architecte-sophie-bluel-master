 // Fonction pour afficher les travaux

function showWork(workData){
    // Récupérer la classe gallery
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Créer une boucle qui va permettre de renseigner les informations pour créer les balises nécessaires aux travaux
    // Créer une balise figure et lui attribuer un id
    workData.forEach(element => {
      const figure = document.createElement("figure");
      figure.setAttribute("id", element.id)
      // Créer une balise img et lui attribuer sa source et son attribut ALT
      const img = document.createElement("img");
      img.setAttribute("src", element.imageUrl);
      img.setAttribute("alt", element.title)
      // Créer une balise figcaption et lui attribuer son titre
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = element.title
      // Intégrer la figure dans l'élément parent "gallery"
      gallery.appendChild(figure)
      // Intégrer l'image et le figcaption dans l'élément parent "figure"
      figure.appendChild(img);
      figure.appendChild(figcaption);
    });

}

// Créer une boucle pour afficher les boutons "catégories" via l'API
// Au clic, il faut afficher les travaux qui ont le même id que le bouton sélectionné

function btnFiltres(categoryData){
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";

  categoryData.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.addEventListener("click", () => {
      const filteredWorks = works.filter(work => work.categoryId === category.id);
      showWork(filteredWorks);
  allButton.addEventListener("click", () => filterWorks("all"));
      
    });
    button.setAttribute("data-category", category.id);
    filters.appendChild(button);
  });

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.addEventListener("click", () => {
    showWork(works);
  });
  filters.appendChild(allButton);
}

