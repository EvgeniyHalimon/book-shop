import { Fetch } from "./fetches.js"
import getData  from "./getData.js"

const createBtn = document.querySelector(".create-user")
const usersList = document.querySelector(".users-list")
const pageList = document.querySelector(".page-list")
const modalUser = document.querySelector(".modal-user")
const userName = document.querySelector(".name")
const userSurname = document.querySelector(".surname")
const userEmail = document.querySelector(".email")
const userPassword = document.querySelector(".password")
const select = document.querySelector(".rank")
const saveBtn = document.querySelector(".save")

getData("users", usersList, pageList, printUser)

async function printUser() {
    const res = await Fetch.get("users")
    usersList.innerHTML = ""
    for (let i = 0; i < res.length; i++) {
        const elem = document.createElement("li")
        const { name, surname, email, roleName} = res[i]
        elem.innerHTML = `${name} ${surname} ${email} ${roleName}`
        usersList.appendChild(elem)
    }
}

createBtn.addEventListener("click", async () => {
    modalUser.style.display = "block"
    window.onclick = function (event) {
        if(event.target == modalUser){
            modalUser.style.display = "none"
        }
    }
    const roles = await Fetch.get("roles")
    for (let i = 0; i < roles.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {name} = roles[i]
        option.innerHTML = `${name}`
        select.appendChild(option)
    }
})

saveBtn.addEventListener("click", () => {
    const body = {
        name: userName.value,
        surname: userSurname.value,
        email: userEmail.value,
        password: userPassword.value,
        roleId: select.id
    }
    Fetch.post("users", body)
    modalUser.style.display = "none" 
})