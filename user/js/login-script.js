/**
 * Variables
 */
const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms'),
    signup = document.getElementById('signup'),
    login = document.getElementById('login')

/**
 * Add event listener to the "Sign Up" button
 */
signupButton.addEventListener('click', () => {
    userForms.classList.remove('bounceRight')
    userForms.classList.add('bounceLeft')
}, false)

/**
 * Add event listener to the "Login" button
 */
loginButton.addEventListener('click', () => {
    userForms.classList.remove('bounceLeft')
    userForms.classList.add('bounceRight')
}, false)


/**
 * 登陆按钮
 */
login.addEventListener('click', () => {
    var userName = document.getElementById("login-UserName").value
    var password = document.getElementById("login-Password").value
    var param = {
        "userName": userName,
        "password": password
    }
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        url: url_pre + "User/check-login",
        data: JSON.stringify(param),
        success: function (result) {
            alert("登陆成功!")
            setCookie("userName", param.userName)
            self.location = "../page/home.html";
        },
        error: function (result) {
            alert("登陆失败，请检查用户名/密码是否正确")
        }

    })
}, false)

/**
 * 注册按钮
 */

signup.addEventListener('click', () => {
    var userName = document.getElementById("signup-UserName").value
    var password = document.getElementById("signup-Password").value
    var param = {
        "userName": userName,
        "password": password
    }
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        url: url_pre + "User/create-user",
        data: JSON.stringify(param),
        success: function (result) {
            alert("注册成功!")
            setCookie("userName", param.userName)
            self.location = "../page/home.html";
        },
        error: function (result) {
            alert("注册失败，用户名已存在!")
        }

    })
}, false)