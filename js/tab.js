export default function tab(tab1,tab2,block1,block2){
    tab2.addEventListener("click", () => {
        tab1.style.background = "gray"
        tab2.style.background = "tomato"
        block1.style.display = "none"
        block2.style.display = "block"
    })
}
