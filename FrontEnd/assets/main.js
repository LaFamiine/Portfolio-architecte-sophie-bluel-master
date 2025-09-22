 // Fonction pour afficher les travaux

function showWork(works){
    // Récupérer la classe gallery
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    // Créer une boucle qui va permettre de renseigner les informations pour créer les balises nécessaires aux travaux
        // Créer une balise figure et lui attribuer un id
        works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.setAttribute("id", work.id);

        // Créer une balise img et lui attribuer sa source et son attribut ALT
        const img = document.createElement("img");
        img.setAttribute("src", work.imageUrl);
        img.setAttribute("alt", work.title);

        // Créer une balise figcaption et lui attribuer son titre
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        // Intégrer la figure dans l'élément parent "gallery"
        gallery.appendChild(figure);

        // Intégrer l'image et le figcaption dans l'élément parent "figure"
        figure.appendChild(img);
        figure.appendChild(figcaption);
    });
}
import { apiWork } from "./api.js";
apiWork().then((works) => {
  console.log(works);
  showWork(works);
});