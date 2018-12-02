
module.exports = function () {
    console.log("ggggg")
    let panels = document.getElementsByClassName("leftSelect")
    for (let i = 0; i < panels.length; i++) {
        console.log(i)
        panels[i].onclick = function () {
            for (let y = 0; y < panels.length; y++) {
                if (panels[y].classList.contains("active")) panels[y].classList.remove("active")
            }
            this.classList.add("active")
            console.log(this.id)
        }
    }
}