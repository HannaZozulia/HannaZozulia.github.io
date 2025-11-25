(function ($) {
    "use strict";

    // ===== Sticky Header =====
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $("#sticky-header").removeClass("sticky");
        } else {
            $("#sticky-header").addClass("sticky");
        }
    });

    // ===== Document Ready =====
    $(document).ready(function () {

        // ===== Мобильное меню =====
        var menu = $('ul#navigation');
        if (menu.length && $.fn.slicknav) {
            menu.slicknav({
                prependTo: ".mobile_menu",
                label: '',
                allowParentLinks: true,
                closedSymbol: '+',
                openedSymbol: '-'
            });

            var langs = '<li class="mobile-langs"><a href="#">EN</a><a href="#">RU</a><a href="#">EE</a></li>';
            $('.slicknav_nav').append(langs);
        } else if (!$.fn.slicknav) {
            console.warn("⚠️ SlickNav не найден или не подключен");
        }

        // ===== Плавная прокрутка по якорям =====
        $('a[href*="#"]').on('click', function (e) {
            var target = $(this.hash);
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 600);
            }
        });

        // ===== Анимация прогресс-баров при скролле =====
        var progressAnimated = false;
        $(window).on('scroll', function () {
            var aboutTop = $('#about').offset().top - $(window).height() + 100;
            if (!progressAnimated && $(window).scrollTop() > aboutTop) {
                $('.progress-bar').each(function () {
                    var value = $(this).attr('aria-valuenow') || $(this).attr('style').match(/width:\s*(\d+)%/)[1];
                    $(this).css('width', '0%').animate({ width: value + '%' }, 1500);
                });
                progressAnimated = true;
            }
        });

    });

    // ===== SlickNav Plugin =====
    (function ($, document, window) {
        var SlickNav = function (element, options) {
            this.element = element;
            this.settings = $.extend({}, this.defaults, options);
            this._name = "slicknav";
            this.init();
        };

        SlickNav.prototype.defaults = {
            label: "MENU",
            duplicate: true,
            duration: 200,
            easingOpen: "swing",
            easingClose: "swing",
            closedSymbol: "+",
            openedSymbol: "-",
            prependTo: "body",
            parentTag: "a",
            allowParentLinks: false,
            removeIds: true,
            removeClasses: false,
            removeStyles: false,
            brand: ""
        };

        SlickNav.prototype.init = function () {
            var self = this;
            var $menu = $(this.element);
            this.mobileNav = this.settings.duplicate ? $menu.clone() : $menu;

            if (this.settings.removeIds) this.mobileNav.removeAttr("id").find("*").removeAttr("id");
            if (this.settings.removeClasses) this.mobileNav.removeAttr("class").find("*").removeAttr("class");
            if (this.settings.removeStyles) this.mobileNav.removeAttr("style").find("*").removeAttr("style");

            this.mobileNav.addClass("slicknav_nav");

            var $menuContainer = $('<div class="slicknav_menu"></div>');
            if (this.settings.brand) $menuContainer.append('<div class="slicknav_brand">' + this.settings.brand + "</div>");

            this.btn = $('<' + this.settings.parentTag + ' role="button" tabindex="0" class="slicknav_btn slicknav_collapsed">' +
                '<span class="slicknav_menutxt">' + this.settings.label + '</span>' +
                '<span class="slicknav_icon"><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span></span>' +
                '</' + this.settings.parentTag + '>');

            $menuContainer.append(this.btn).append(this.mobileNav);
            $(this.settings.prependTo).prepend($menuContainer);

            this.mobileNav.find("li").each(function () {
                var $li = $(this);
                var $children = $li.children("ul");
                if ($children.length > 0) {
                    $li.addClass("slicknav_parent slicknav_collapsed");
                    var $arrow = $('<span class="slicknav_arrow">' + self.settings.closedSymbol + "</span>");
                    $li.append($arrow);
                    $arrow.on("click", function (e) {
                        e.stopPropagation();
                        self._toggleItem($li);
                    });
                }
            });

            this.btn.on("click", function (e) {
                e.preventDefault();
                self._toggleMenu();
            });
        };

        SlickNav.prototype._toggleMenu = function () {
            this.btn.toggleClass("slicknav_open slicknav_collapsed");
            if (this.mobileNav.is(":visible")) this.mobileNav.slideUp(this.settings.duration, this.settings.easingClose);
            else this.mobileNav.slideDown(this.settings.duration, this.settings.easingOpen);
        };

        SlickNav.prototype._toggleItem = function ($li) {
            $li.toggleClass("slicknav_open slicknav_collapsed");
            var $submenu = $li.children("ul");
            if ($submenu.is(":visible")) {
                $submenu.slideUp(this.settings.duration, this.settings.easingClose);
                $li.children(".slicknav_arrow").html(this.settings.closedSymbol);
            } else {
                $submenu.slideDown(this.settings.duration, this.settings.easingOpen);
                $li.children(".slicknav_arrow").html(this.settings.openedSymbol);
            }
        };

        $.fn.slicknav = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_slicknav")) {
                    $.data(this, "plugin_slicknav", new SlickNav(this, options));
                }
            });
        };

    })(jQuery, document, window);

})(jQuery);