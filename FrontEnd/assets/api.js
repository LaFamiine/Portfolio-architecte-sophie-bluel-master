// Appel des API

const apiWork = async() => {
  await fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then((data) => (workData = data));

  showWork(workData);
}

apiWork();

const apiCategory = async() => {
  await fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then((data) => (categoryData = data));

  btnFiltres(categoryData);
}

apiCategory();