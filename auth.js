function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

firebase.auth().signInWithEmailAndPassword(email,password)

.then(()=>{

document.getElementById("loginBox").style.display="none"
document.getElementById("app").style.display="block"

// Ensure dashboard function is available before calling
if (typeof dashboard === 'function') {
  dashboard()
} else {
  // If dashboard not available, wait and try again
  setTimeout(() => {
    if (typeof dashboard === 'function') {
      dashboard()
    } else {
      console.error('Dashboard function not found after delay')
      alert('Error loading dashboard. Please refresh the page.')
    }
  }, 500)
}

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