function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

firebase.auth().signInWithEmailAndPassword(email,password)

.then(()=>{

document.getElementById("loginBox").style.display="none"
document.getElementById("app").style.display="block"

// Ensure dashboard function is available before calling
if (typeof dashboard === 'function') {
  // Wait a moment for Firebase to fully initialize
  setTimeout(() => {
    if (typeof dashboard === 'function') {
      dashboard()
    } else {
      console.error('Dashboard function lost after delay')
      alert('Error loading dashboard. Please refresh the page.')
    }
  }, 1500)
} else {
  // If dashboard not available immediately, wait longer and retry
  setTimeout(() => {
    if (typeof dashboard === 'function') {
      dashboard()
    } else {
      console.error('Dashboard function not found after delay')
      alert('Error loading dashboard. Please refresh the page.')
    }
  }, 2000)
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