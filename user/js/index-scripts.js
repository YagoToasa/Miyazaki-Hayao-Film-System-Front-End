/*!
 * Start Bootstrap - Agency v6.0.1 (https://startbootstrap.com/template-overviews/agency)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-agency/blob/master/LICENSE)
 */
(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate({
                        scrollTop: target.offset().top - 72,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 74,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
})(jQuery); // End of use strict

// role
// comment
// 解析路径传值
function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

$(document).ready(function () {
    if(!getParams("movieId")){
        self.location = "../page/404-page.html"
    }
    var movieId = getParams("movieId").toString()

    let userName = getCookie("userName");
    if(!userName){
        var loginComment = document.getElementById("login-comment")
        loginComment.parentNode.removeChild(loginComment)
    }else{
        var notLoginAlter = document.getElementById("not-login-alter")
        notLoginAlter.parentNode.removeChild(notLoginAlter)
    }
    $.ajax({
        type: "post",
        contentType: "application/json;charset=UTF-8",
        url: url_pre + "Movie/get-movie-details-info?movieId=" + movieId,
        success: function (result) {
            console.log(result.data)
            var details_data = result.data
            var banner = document.getElementById("movieBanner")
            banner.style.backgroundImage = "url('" + details_data.movieCover + "')";
            $("#movieTitle").text(details_data.movieTitle)
            $("#moviePlotPicture").attr("src", details_data.moviePlotPicture);
            $("#moviePlotContent").append(details_data.moviePlotContent);
            var count = 0
            var element = '';
            var first = true;
            // 人物列表
            for (var i = 0; i < details_data.role.length; i++) {
                var role = details_data.role[i]
                var role_intro = role.intro
                var element_i =
                    '<div class="col-4">' +
                    '<div class="card">' +
                    '<img class="card-img-top" src="' + role.headUrl + '" alt="Card image cap">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title text-success">' + role.name + '</h5><hr/>' +
                    '<p class="card-text role-card-text">' + role_intro + '</p></div></div></div>';
                if (count === 3) {
                    if (first) {
                        first = false;
                        element = '<div class="carousel-item px-5 active"><div class="row">' + element + '</div></div>'
                        $("#movieRoleContent").append(element)
                        element = ''
                    } else {
                        element = '<div class="carousel-item px-5"><div class="row">' + element + '</div></div>'
                        $("#movieRoleContent").append(element)
                        element = ''
                    }
                    count = 0;
                } else {
                    count = count + 1;
                    element = element + element_i;

                }
                if (i === details_data.role.length - 1 && count < 3 && element !== '') {
                    if (first) {
                        element = '<div class="carousel-item px-5 active"><div class="row">' + element + '</div></div>'
                        $("#movieRoleContent").append(element)
                        element = ''
                    } else {
                        element = '<div class="carousel-item px-5"><div class="row">' + element + '</div></div>'
                        $("#movieRoleContent").append(element)
                        element = ''
                    }
                }
            }
            // 台词列表
            for (i = 0; i < details_data.phrase.length; i++) {
                var phrase = details_data.phrase[i]
                var phrase_element = '<li class="timeline-v4-box wow fadeInLeft">' +
                    '<i class="icon-layers"></i>' + '<p class="timeline-v4-title">' + 'No.' + (i + 1) + '</p>' +
                    '<p class="timeline-v4-details">' + phrase.content + '</p>' +
                    '<span>' + (i + 1) + '</span></li>';
                $("#moviePhraseContent").append(phrase_element);
            }
            // 媒体列表
            for(i = 0; i <details_data.media.length; i++){
                var media = details_data.media[i]
                if(media.type === "爱奇艺"){
                    $("#iqiyi_link").attr("href", media.siteUrl)
                }else if(media.type === "优酷"){
                    $("#youku_link").attr("href", media.siteUrl)
                }else if(media.type === "腾讯"){
                    $("#qq_link").attr("href", media.siteUrl)
                }
            }
            if(details_data.remark.length === 0){
                var remark_element = '<li class="timeline-v3-event"><label class="timeline-v3-event-icon"></label><div class="timeline-v3-event-copy">'+
                    '<p>(●･◡･●)ﾉ♥ 当前还没有评论, 要不要成为第一个评论的人呢?</p></div></li>';
                $("#comment-ul").append(remark_element);
            }
            // 评论列表
            for(i = 0; i < details_data.remark.length; i++){
                var remark = details_data.remark[i]
                var remark_element = '<li class="timeline-v3-event"><label class="timeline-v3-event-icon"></label><div class="timeline-v3-event-copy"><p class="timeline-v3-event-thumbnail">' +
                    remark.retime.toString().replace("T", " ").replace("+08:00","")+'</p>' +
                    '<h3>'+remark.userName+'</h3>' + '<p>' + remark.content + '</p></div></li>';
                $("#comment-ul").append(remark_element);
            }
            completeLoading();
        },
        error: function (result) {
        }
    })
    
});

// 等待所有加载
function completeLoading(){
    var loadingMask = document.getElementById("loadingMask");
        loadingMask.parentNode.removeChild(loadingMask);
}

$('#comment-commit-button').click(function () {
    var content = document.getElementById('comment-content').value;
    var userName = getCookie("userName");
    var movieId = getParams("movieId").toString();
    var param = {
        "id": 0,
        "movieId": parseInt(movieId),
        "content": content,
        "userName": userName
    }
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        url: url_pre + "Remark/create-remark",
        data: JSON.stringify(param),
        success: function (result) {
            self.location.reload()
        },
        error: function (result) {
            console.log(result)
        }
    })
})
