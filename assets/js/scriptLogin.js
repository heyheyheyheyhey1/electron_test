
jQuery(document).ready(function () {

    /*
        Fullscreen background
    */
    $.backstretch("assets/img/backgrounds/1.jpg");

    /*
	    Modals
	*/
    $('#showLogin').on('click', function (e) {
        e.preventDefault();
        $('#' + $(this).data('modal-id')).modal();
    });

    $('#showRegiste').on('click', function (e) {
        e.preventDefault();
        $('#' + $(this).data('modal-id')).modal();
    });

    /*
        Form validation
    */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });


});


let email = document.getElementById("email")
let passwd = document.getElementById("passwd")
let btnLogin = document.getElementById("btnLogin")
let btnRegiste = document.getElementById("btnRegiste")



btnLogin.onclick = function () {
    let xmlRequest = new XMLHttpRequest()
    console.log("email: ", email.value, "passwd: ", passwd.value)
    xmlRequest.open("GET", `http://127.0.0.1:66/login?email=${email.value}&passwd=${passwd.value}`, true)
    xmlRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlRequest.responseText)
            let info = JSON.parse(xmlRequest.responseText)

            if (info.status == "ok") {
                if (!isInBrowser) {
                    let ipcRenderer = nodeRequire("electron").ipcRenderer

                    ipcRenderer.send("setid", info.id)

                    ipcRenderer.send("showChatList")
                    console.log("ggggg")
                } else {
                    console.log("login ok")
                    window.open(`http://127.0.0.1:66/chatList.html?id=${info.id}`, "_self", null, true)

                }
            }
        }
    }
    xmlRequest.send(null)
}


btnRegiste.onclick=function (){
    
}