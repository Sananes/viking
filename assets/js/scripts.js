/*********************
 Site Name:  Heimdallr
 Company:    NorthernFolks
 Author:     Aaron Sananes & Daniel Sandvik
 Website:    http://www.northernfolks.com

**********************
 Bones Scripts File
 Author: Eddie Machado

 */

(function ($) {
    "use strict";

    function get_feature_image() {
        var articles_links = $(".post-title a"),
            featured_parts = $(".featured"),
            list_links = [];

        /* -- Feature Images and Video per Post -- */
        if (articles_links.length > 0) {
            
//            if ( Modernizr.localstorage ) {
//                localStorage.clear();
//            }
            
            articles_links.each(function (index) {
                //Process script                 
                list_links.push(articles_links[index].href);
                /* -- Next and Prev Post -- */
                if ( Modernizr.localstorage ) {
                localStorage.setItem(articles_links[index].href,
                    JSON.stringify({"prev": (articles_links[index - 1] != null ? articles_links[index - 1].href : "none"),
                                    "next": (articles_links[index + 1] != null ? articles_links[index + 1].href : "none")}));
                }
            });
        }

        if (list_links.length > 0) {
            list_links.forEach(function (element, index, array) {
                $.get(list_links[index], function (data) {
                    var html = $(data),
                        article = html.find("article"),
                        img = article.find("img:first"),
                        video = article.find("iframe:first"),
                        featured = featured_parts[index];

                    if (img.length > 0 && video.length > 0) {
                        $(featured).html(img[0]);
                    } else {
                        if (img.length > 0) {
                            $(featured).html(img[0]);
                        } else if (video.length > 0) {
                            $(featured).html(video[0].outerHTML);
                        }
                    }
                    $(".post").fitVids();
                });
            });
        }
    }

    

    //Function check menu opened
    function move_scroll_icon() {
        if (menu_open()) {
            $(".scrollup").removeClass("scroll-right");
            $(".scrollup").addClass("scroll-left");
        } else {
            $(".scrollup").removeClass("scroll-left");
            $(".scrollup").addClass("scroll-right");
        }
    }

    //Function generate background

    function getbg() {
        var d = new Date(),
            today = parseInt(d.getDate(), 10),
            bg = "1.png";

        if (today <= 5) {
            bg = "6.png";
        } else if (today <= 10) {
            bg = "5.png";
        } else if (today <= 15) {
            bg = "4.png";
        } else if (today <= 20) {
            bg = "3.png";
        } else if (today <= 25) {
            bg = "2.png";
        } else {
            bg = "1.png";
        }
        return bg;
    }

    function menu_open() {
        return ($("#menu").css("right") == "0px");
    }

    function detect_browser() {
        var browser = {
            chrome: false,
            mozilla: false,
            opera: false,
            msie: false,
            safari: false
        },
            sBrowser, sUsrAg = navigator.userAgent;

        if (sUsrAg.indexOf("Chrome") > -1) {
            browser.chrome = true;
        } else if (sUsrAg.indexOf("Safari") > -1) {
            browser.safari = true;
        } else if (sUsrAg.indexOf("Opera") > -1) {
            browser.opera = true;
        } else if (sUsrAg.indexOf("Firefox") > -1) {
            browser.mozilla = true;
        } else if (sUsrAg.indexOf("MSIE") > -1 || sUsrAg.indexOf("Trident") > -1) {
            browser.msie = true;
        }
        return browser;
    }

    function prev_next() {
        if ( Modernizr.localstorage ) {
            if (localStorage.getItem(window.location.href) != null && window.location.href != (window.location.origin + "/")) {
                var relations = localStorage.getItem(window.location.href);
                return JSON.parse(relations);
            }
        } else {
            return false;
        }
    }
    
    function enable_infinite() {
        if ( Modernizr.localstorage ) {
            if (localStorage.getItem("enable_infinite_scrolling") == null) {
                localStorage.setItem("enable_infinite_scrolling", "true");
                return true;
            } else if (localStorage.getItem("enable_infinite_scrolling") == "true") {
                return true;
            } else if (localStorage.getItem("enable_infinite_scrolling") == "false") {
                $("#infinite_enable").removeProp("checked");
                return false;
            }
        } else {
            return false;
        }
    }
        

    $(document).ready(function () {
        
        /* -- Detect IE -- */
        var browser = detect_browser(),
            logo_text = $("#flash").text() + " " + $("#light").text(),
            is_many_page = $(".pagination a.older-posts").length,
            is_infinite = enable_infinite(),
            rel_links = prev_next();
        
        /* -- Fallback text logo for IE -- */
        if (browser.msie == true) {
            $("#box").html(logo_text);
        }
        
        /* -- Hide pagination for infinite scrolling  -- */        
        if (is_infinite || is_many_page == 0)
        {
            $(".pagination").css("display", "none" );
        } else {
            $(".pagination").css("display", "block");
        }
        
        /* -- Catch checkbox event -- */
        $("input#infinite_enable").change( function() {
            localStorage.setItem("enable_infinite_scrolling", $(this).is(":checked"));
            location.reload();
        });
        
        /* -- Code Highlight -- */
        $("pre").addClass("prettyprint");



        /* -- Handle menu event -- */
        $(".toggle-icon").click(function () {
            if (menu_open()) {
                $("#menu").css("right", "-280px");
                $(".scrollup").removeClass("scroll-left");
                $(".scrollup").addClass("scroll-right");
            } else {
                $("#menu").css("right", "0");
                $(".scrollup").removeClass("scroll-right");
                $(".scrollup").addClass("scroll-left");
            }
        });

        $(document).click(function (event) {
            if ($(event.target).parents().index($("#menu")) == -1) {
                if (menu_open()) {
                    $("#menu").css("right", "-280px");
                    $(".scrollup").removeClass("scroll-left");
                    $(".scrollup").addClass("scroll-right");
                }
            }
        });

        /* -- Change Background -- */
        $("body").css("background", "url(\"/assets/imgs/bg/" + getbg() + "\")");
//        
//        if (Modernizr.localstorage)
//        {
//            $(".pagination").css("display", "none");
//        } else {
//            //Using jQuery Cookie
//        }
//        
        $(window).scroll(function () {
            /* -- Scroll to Top -- */
            if ($(this).scrollTop() > 100) {
                //Display it
                $(".scrollup").fadeIn();
            } else {
                $(".scrollup").fadeOut();
            }
            
            if (localStorage.getItem("enable_infinite_scrolling") == "true") {
                /* -- Endless Scrolling -- */
                var next_page = $(".pagination a.older-posts");
                if (next_page.length > 0) {
                    next_page = next_page.attr("href");
                    if ($(window).scrollTop() == ($(document).height() - $(window).height())) {
                        $(".endless").show();
                        $.ajax({
                            url: next_page,
                            success: function (html) {
                                if (html) {
                                    var content = $(html),
                                        posts = content.find("article.post"),
                                        pagination = content.find(".pagination"),
                                        endless = content.find(".endless");
    
                               
                                    $(".pagination").remove();
    
                                    $(".endless").remove();
                                    posts.each(function (index) {
                                        $(posts[index]).appendTo("#main").addClass('animate fadeIn');
                                    });
    
                                    //Callback when create new article
                                    //get_feature_image();
                                    //add_weather_emo();
    
                                    $("#main").append(endless);
                                    $("#main").append(pagination);
                                    $(".pagination").css("display", "none");
                                    $(".endless").hide(300);
                                }
                            }
                        });
                    } else {
                        if ($(".pagination").css("display") == "block") {
                            $(".no-more").removeClass("animate wobble");
                            $(".no-more").addClass("animate wobble");
                        }
        
                    }
                } else {
                    $(".pagination").css("display", "block");
                    $(".pagination").html("<span class=\"button no-more\" style=\"opacity:1\">''-_-</span>");
                    $(".no-more").removeClass("animate wobble");
                    $(".no-more").addClass("animate wobble");
                }
            }
        });

        //get_feature_image();
                    
        if (rel_links != null && Modernizr.localstorage && rel_links != false) {
            $(document).keydown(function (event) {
                if (event.which == 37 && rel_links.prev != "none") {
                    event.preventDefault();
                    window.location.href = rel_links.prev;
                }
                if (event.which == 39 && rel_links.next != "none") {
                    event.preventDefault();
                    window.location.href = rel_links.next;
                }
            });
        }
    });

}(jQuery));

// IE8 ployfill for GetComputed Style (for Responsive Script below)
if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}

// as the page loads, call these scripts
jQuery(document).ready(function($) {

    /*
     Responsive jQuery is a tricky thing.
     There's a bunch of different ways to handle
     it, so be sure to research and find the one
     that works for you best.
     */

    /* getting viewport width */
    var responsive_viewport = $(window).width();

    /* if is below 481px */
    if (responsive_viewport < 481) {

    } /* end smallest screen */

    /* if is larger than 481px */
    if (responsive_viewport > 481) {

    } /* end larger than 481px */

    /* if is above or equal to 768px */
    if (responsive_viewport >= 768) {

        /* load gravatars */
        $('.comment img[data-gravatar]').each(function(){
            $(this).attr('src',$(this).attr('data-gravatar'));
        });

    }

    /* off the bat large screen actions */
    if (responsive_viewport > 1030) {

    }


    // add all your scripts here
    if($('body').hasClass('home-template')) {
        $('#logo').addClass('animate bounceIn')
    }
    function navToggle() {
        var menuIcon = $('.menu-toggle a'), bodyClick = false
            navHeader = $('.nav'),
            close = navHeader.find('.close'),
            overlay = $('.overlay').hide();

        // Menu icon toggle
        menuIcon.on('click', function(e) {
            e.preventDefault();
            navHeader.toggleClass('show');
            if(bodyClick == true) {
                overlay.show();
            }
        });

        // Close icon toggle
        close.on('click', function(e) {
            e.preventDefault();
            navHeader.removeClass('show');
        });

        // Body click hide menu
        if(bodyClick == true) {
            overlay.on('click', function(e) {
                e.preventDefault();
                navHeader.removeClass('show');
                overlay.hide();
            })
        }
    };

    navToggle();

    // var src = document.querySelector('.post img:first-of-type').getAttribute('src');
    // $('.post').prepend('<img src="' + src +'">');
    // Scroll to Top

    // $(window).scroll(function () {
    //   if ($(this).scrollTop() > 100) {
    //       $('.scrollup').fadeIn();
    //   } else {
    //       $('.scrollup').fadeOut();
    //   }
    // });



    $('.back-to-top').click(function () {
      $("html, body").animate({
          scrollTop: 0
      }, 600);
      return false;
    });



}); /* end of as page load scripts */
    

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
 */
(function(w){
    // This fix addresses an iOS bug, so return early if the UA claims it's something else.
    if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ){ return; }
    var doc = w.document;
    if( !doc.querySelector ){ return; }
    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
        x, y, z, aig;
    if( !meta ){ return; }
    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true; }
    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false; }
    function checkTilt( e ){
        aig = e.accelerationIncludingGravity;
        x = Math.abs( aig.x );
        y = Math.abs( aig.y );
        z = Math.abs( aig.z );
        // If portrait orientation and in one of the danger zones
        if( !w.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
            if( enabled ){ disableZoom(); } }
        else if( !enabled ){ restoreZoom(); } }
    w.addEventListener( "orientationchange", restoreZoom, false );
    w.addEventListener( "devicemotion", checkTilt, false );
})( this );