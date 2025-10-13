//formulaire

const login = document.querySelector("#submit");

login.addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value; 

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })
    .then(function(response){
        if(!response.ok){
            error.innerText = "Identifiant ou mot de passe incorrect";
        } else {
            response.json().then(function(data){
                localStorage.setItem("token", data.token);
                window.location.href = "index_edit.html";
            })
        }
    })
});