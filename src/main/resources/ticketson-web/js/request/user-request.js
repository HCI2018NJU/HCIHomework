/**
 * 会员注册
 * @param email 邮箱
 * @param psw 密码
 */
function register(email,psw) {
    let data = {email: email,psw: psw};
    console.log(data);
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/user/register",
        data: JSON.stringify(data),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            console.log("SUCCESS : ", data);

        },
        error: function (e) {
            console.log("ERROR : ", e);
        }
    });
}

/**
 * 会员注册
 * @param email 邮箱
 * @param psw 密码
 */
function login(email,psw) {
    let data = {email: email,psw: psw};
    // $.ajax({
    //     type: "POST",
    //     contentType: "application/json",
    //     url: "/api/user/login",
    //     data: JSON.stringify(data),
    //     dataType: 'json',
    //     cache: false,
    //     timeout: 600000,
    //     success: function (data) {
    //         console.log("SUCCESS : ", data);
    //
    //     },
    //     error: function (e) {
    //         console.log("ERROR : ", e);
    //     }
    // });
}




