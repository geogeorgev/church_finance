function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

firebase.auth().signInWithEmailAndPassword(email,password)

.then(()=>{

document.getElementById("loginBox").style.display="none"
document.getElementById("app").style.display="block"

dashboard()

})

.catch((error)=>{

alert(error.message)

})

}


function logout(){

firebase.auth().signOut().then(()=>{

location.reload()

})

}