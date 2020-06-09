// var url_pre = "https://localhost:5001/api/"
// var pic_pre = "https://localhost:5001"
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

$(function () {
    let userName = getCookie("userName");
    if (!userName) {
        var li_element = '<li><a href="login.html">登陆</a></li>';
        $('.overlay-menu ul').append(li_element)
    } else {
        $('#userName').text(userName)
        var li_element = '<li><a id="exit">退出</a></li>';
        $('.overlay-menu ul').append(li_element);
        $('#exit').click(function () {
            setCookie("userName", '')
            self.location.reload()
        });
    }
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        url: url_pre + "Movie/get-movies",

        success: function (result) {

            for (var i = 0; i < result.length; i++) {
                var movie = result[i];
                // var urlAddr = (pic_pre + movie.coverUrl)
                var urlAddr = movie.coverUrl
                if (i == 0) {
                    var element_1 =
                        '<li role="presentation" class="active">' +
                        '<a href="#section' + (i + 1) + '">' +
                        '<span class="nav__counter">' + movie.releaseYear + '</span>' +
                        '<h3 class="nav__title">' + movie.chName + '</h3>' +
                        '<p class="nav__body">' +
                        '<i class="fa fa-film" aria-hidden="true"></i>上映日期：' + movie.releaseDate + '<br>' +
                        '<i class="fa fa-tag" aria-hidden="true"></i>' + movie.slogan +
                        '</p></a></li>';
                } else {
                    var element_1 =
                        '<li role="presentation">' +
                        '<a href="#section' + (i + 1) + '">' +
                        '<span class="nav__counter">' + movie.releaseYear + '</span>' +
                        '<h3 class="nav__title">' + movie.chName + '</h3>' +
                        '<p class="nav__body">' +
                        '<i class="fa fa-film" aria-hidden="true"></i>上映日期：' + movie.releaseDate + '<br>' +
                        '<i class="fa fa-tag" aria-hidden="true"></i>' + movie.slogan +
                        '</p></a></li>';
                }
                var element_2 = '<section class="section section' + (i + 1) + '" id="section' + (i + 1) + '">' +
                    '<div class="movie-card"><div class="container">' +
                    '<img src="' + (movie.posterUrl) + '" alt="cover" class="cover" />' +
                    '<div class="hero" id="hero' + (i + 1) + '">' +
                    '<div class="details"><div class="title1">' + movie.chName + '<span>' + movie.runtime + "分钟</span></div>" +
                    '<div class="title2">' + movie.jpName + '</div></div></div>' +
                    '<div class="description"><div class="column1"><span class="tag">动画</span><span class="tag">奇幻</span><span class="tag">冒险</span></div>' +
                    '<div class="column2"><p>' + movie.intro + '</p><div class="btn-contain">' +
                    '<a class="btn" movie_id="' + movie.id + '">Show More</a>' +
                    '<div class="btn-particles"></div></div></div></div></div></div></section>';
                $("ul.nav:first").append(element_1)
                $("div.wrapper:first").append(element_2)

                var hero = document.getElementById("hero" + (i + 1).toString())
                hero.style.backgroundImage = "url('" + urlAddr + "')";
                if (i != 0) hero.style.backgroundPosition = "center";
            }
            $("a[href*=#]:not([href=#])").click(function () {
                if (
                    location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") ||
                    location.hostname == this.hostname
                ) {
                    var target = $(this.hash);
                    target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
                    if (target.length) {
                        $("html,body").animate({
                                scrollTop: target.offset().top,
                            },
                            1000
                        );
                        return false;
                    }
                }
            });
            $(document).on("click", ".btn", function (e) {
                $(this).boom(e);
                console.log(this.getAttribute("movie_id"));
                window.location.href = '../page/details.html?movieId=' + this.getAttribute("movie_id");

            });
            $("#toggle").click(function () {
                $(this).toggleClass("active");
                $("#overlay").toggleClass("open");
            });
            var img_length = $("img").length
            var img_start = 1;
            $("img").load(function () {
                img_start++;
                if (img_start == img_length) {
                    completeLoading();
                }
            })
        },
        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        },
    });
});


$.fn.boom = function (e) {
    var colors = [
        "#ffb3f6",
        "#7aa0ff",
        "#333",
        // '#FFD100',
        // '#FF9300',
        // '#FF7FA4'
    ];
    var shapes = [
        '<polygon class="star" points="21,0,28.053423027509677,11.29179606750063,40.97218684219823,14.510643118126104,32.412678195541844,24.70820393249937,33.34349029814194,37.989356881873896,21,33,8.656509701858067,37.989356881873896,9.587321804458158,24.70820393249937,1.0278131578017735,14.510643118126108,13.94657697249032,11.291796067500632"></polygon>',
        // '<path class="circle" d="m 20 1 a 1 1 0 0 0 0 25 a 1 1 0 0 0 0 -25"></path>',
        '<polygon class="other-star" points="18,0,22.242640687119284,13.757359312880714,36,18,22.242640687119284,22.242640687119284,18.000000000000004,36,13.757359312880716,22.242640687119284,0,18.000000000000004,13.757359312880714,13.757359312880716"></polygon>',
        '<polygon class="diamond" points="18,0,27.192388155425117,8.80761184457488,36,18,27.19238815542512,27.192388155425117,18.000000000000004,36,8.807611844574883,27.19238815542512,0,18.000000000000004,8.80761184457488,8.807611844574884"></polygon>',
    ];

    var btn = $(this);
    var group = [];
    var num = Math.floor(Math.random() * 20) + 15;

    for (i = 0; i < num; i++) {
        var randBG = Math.floor(Math.random() * colors.length);
        var getShape = Math.floor(Math.random() * shapes.length);
        var c = Math.floor(Math.random() * 10) + 5;
        var scale = Math.floor(Math.random() * (8 - 4 + 1)) + 4;
        var x = Math.floor(Math.random() * (150 + 100)) - 100;
        var y = Math.floor(Math.random() * (150 + 100)) - 100;
        var sec = Math.floor(Math.random() * 1700) + 1000;
        var cir = $('<div class="cir"></div>');
        var shape = $('<svg class="shape">' + shapes[getShape] + "</svg>");

        shape.css({
            top: e.pageY - btn.offset().top + 20,
            left: e.pageX - btn.offset().left + 40,
            transform: "scale(0." + scale + ")",
            transition: sec + "ms",
            fill: colors[randBG],
        });

        btn.siblings(".btn-particles").append(shape);

        group.push({
            shape: shape,
            x: x,
            y: y,
        });
    }

    for (var a = 0; a < group.length; a++) {
        var shape = group[a].shape;
        var x = group[a].x,
            y = group[a].y;
        shape.css({
            left: x,
            top: y,
            transform: "scale(0)",
        });
    }

    setTimeout(function () {
        for (var b = 0; b < group.length; b++) {
            var shape = group[b].shape;
            shape.remove();
        }
        group = [];
    }, 2000);
};


// 等待所有加载
function completeLoading() {
    var loadingMask = document.getElementById("loadingMask");
    loadingMask.parentNode.removeChild(loadingMask);
}

var shareModel = {

    /**
     * 分享QQ好友
     * @param  {[type]} title [分享标题]
     * @param  {[type]} url   [分享url链接，默认当前页面链接]
     * @param  {[type]} pic   [分享图片]
     * @return {[type]}       [description]
     */
    shareQQ: function (url, title, pic) {
        var param = {
            url: url || window.location.href,
            desc: '', /*分享理由*/
            title : title || '', /*分享标题(可选)*/
            summary : '',/*分享描述(可选)*/
            pics : pic || '',/*分享图片(可选)*/
            flash : '', /*视频地址(可选)*/
            site: '' /*分享来源 (可选) */
        };
        var s = [];
        for (var i in param) {
            s.push(i + '=' + encodeURIComponent(param[i] || ''));
        }
        var targetUrl = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join('&') ;
        window.open(targetUrl, 'qq', 'height=520, width=720');
    },

    /**
     * 微信分享
     * @return {[type]} [description]
     */
    weixin: function () {
        var url = window.location.href,
            encodePath = encodeURIComponent(url),
            targetUrl = 'http://qr.liantu.com/api.php?text=' + encodePath;
        window.open(targetUrl, 'weixin', 'height=320, width=320');
    },

    /**
     * 分享新浪微博
     * @param  {[type]} title [分享标题]
     * @param  {[type]} url   [分享url链接，默认当前页面]
     * @param  {[type]} pic   [分享图片]
     * @return {[type]}       [description]
     */
    sinaWeiBo: function (title, url, pic) {
        var param = {
            url: url || window.location.href,
            type: '3',
            count: '1', /** 是否显示分享数，1显示(可选)*/
            appkey: '', /** 您申请的应用appkey,显示分享来源(可选)*/
            title: '', /** 分享的文字内容(可选，默认为所在页面的title)*/
            pic: pic || '', /**分享图片的路径(可选)*/
            ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
            rnd: new Date().valueOf()
        }
        var temp = [];
        for( var p in param ) {
            temp.push(p + '=' +encodeURIComponent( param[p ] || '' ) )
        }
        var targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
        window.open(targetUrl, 'sinaweibo', 'height=430, width=400');
    }
};