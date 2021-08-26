import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

const loginForm = document.querySelector(".login-form")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")

loginForm.addEventListener("submit", loginUser)

async function loginUser(e) {
    e.preventDefault()
    const res = await Fetch.get(`users?email=${loginEmail.value}`)
    console.log(res)
    if(res.length === 0){
        return alert("This user doesnt exist")
    }
    if(res[0].password !== loginPassword.value){
        return alert("Wrong password")
    }
    Storage.setData("account", res[0].id)
    Storage.setData("role", res[0].roleId)
    document.location.href="../html/rights-roles.html"
}

