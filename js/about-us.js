import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

const aboutBlock = document.querySelector(".about-block")
const aboutText = document.querySelector(".about-text")
const editBtn = document.querySelector(".edit-btn")

getText()
async function getText() {
    const txt = await Fetch.get("about-us")
    aboutText.innerHTML = txt[0].text
}

const role = Storage.getData("role")

if(role == "User"){
    editBtn.style.display = "none"
}

editBtn.addEventListener("click", async () => {
    const txt = await Fetch.get("about-us")
    const textArea = document.createElement("textarea")
    textArea.style.width = "600px"
    textArea.style.height = "200px"
    const saveBtn = document.createElement("button")
    saveBtn.innerHTML = "Сохранить"
    textArea.value = txt[0].text
    aboutText.style.display = "none"
    editBtn.style.display = "none"
    aboutBlock.appendChild(textArea)
    aboutBlock.appendChild(saveBtn)
    saveBtn.addEventListener("click", () => {
        const body = {
            text: textArea.value
        }
        Fetch.patch("about-us/1",body)
        aboutText.style.display = "block"
        editBtn.style.display = "inline-block"
        aboutText.innerHTML = textArea.value
        textArea.style.display = "none"
        saveBtn.style.display = "none"
    })
})