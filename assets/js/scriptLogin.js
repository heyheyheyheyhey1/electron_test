
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
    xmlRequest.open("GET", `http://108.61.182.64:66/login?email=${email.value}&passwd=${passwd.value}`, true)
    xmlRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xmlRequest.responseText)
            let info = JSON.parse(xmlRequest.responseText)

            if (info.status == "ok") {
                if (!isInBrowser) {
                    let ipcRenderer = nodeRequire("electron").ipcRenderer

                    ipcRenderer.send("setid", info.id)

                    ipcRenderer.send("showChatList")
                    
                } else {
                    console.log("login ok")
                    window.open(`http://108.61.182.64:66/chatList.html?id=${info.id}`, "_self", null, true)

                }
            }
            else{
                $('#email_check').html('<span style="color:green">登陆失败，检查用户名或密码</span>')
            }
        }
    }
    xmlRequest.send(null)
}


btnRegiste.onclick=function (){
    console.log("registe clicked")
    let email=$("#Reg_email").val()
    let passwd=$("#Reg_passwd").val()
    let repasswd=$("#Reg_repasswd").val()
    let username=$("#Reg_username").val()
    console.log(email,passwd,repasswd,username)
    let xmlRequest=new XMLHttpRequest()
    let formdata=new FormData()
    formdata.append("username",username)
    formdata.append("passwd",passwd)
    formdata.append("email",email)
    xmlRequest.open("POST","http://108.61.182.64:66/registe",true)
    xmlRequest.onreadystatechange=function(){
        if (this.status==200&&this.readyState==4){
            console.log(xmlRequest.responseText)
            let obj = JSON.parse(xmlRequest.responseText)
            if (obj.status!="ok"){
                $('#Reg_email_check').html('<span style="color:green">注册失败，换个邮箱再试试</span>')
                console.log("注册失败")
            }
            else{
                console.log("注册成功")
                $('#Reg_email_check').html('<span style="color:green">注册成功,可以去检查你的邮件了</span>')
            }
        }
    }
    xmlRequest.send(formdata)
}