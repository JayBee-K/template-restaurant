var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
    windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
    let $childUl = $parent.find('> li > ul');
    if ($childUl.length === 0) {
        return;
    }

    if ($callFunction) {
        $parent.find('> li a').each(function () {
            $(this).attr('data-href', $(this).attr('href'))
        });
    }

    if (windowWidth <= 1536) {
        let $objParentAttr = {};
        let $objChildrenAttr = {
            'data-bs-parent': '#' + $parent.attr('id')
        }

        if ($firstItem) {
            let $parentID = 'menu-' + Math.random().toString(36).substring(7);
            $parent.attr('id', $parentID);
            $objParentAttr = {
                'data-bs-parent': '#' + $parentID
            }

            $objChildrenAttr = {};
        }

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');
            let $parentListItemAnchor = $parentListItem.children('a');

            let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

            $parentUl.addClass('collapse').attr({
                'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
            });

            $parentListItemAnchor.replaceWith(function () {
                return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
            })

            handleApplyCollapse($parentUl, false);

            $parentUl.on('show.bs.collapse', function () {
                $parent.find('.collapse.show').not($parentUl).collapse('hide');
            });
        });
    } else {
        $parent.removeAttr('id');

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');

            $parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
            $parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

            $parentListItem.children('button').replaceWith(function () {
                return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
            })

            handleApplyCollapse($parentUl);
        });
    }
}

let handleCallMenu = function () {
    const $body = $('body');
    const handleBody = function ($toggle = false) {
        if ($body.hasClass('is-navigation')) {
            $body.removeClass('is-navigation');
            if ($body.hasClass('is-overflow')) {
                $body.removeClass('is-overflow');
            }

            $('#header-navigation ul').collapse('hide');
        } else {
            if ($toggle) {
                $body.addClass('is-navigation is-overflow')
            }
        }
    }

    if (windowWidth <= 1536) {
        const $hamburger = $('#hamburger-button');
        if ($hamburger.length) {
            $hamburger.click(function () {
                handleBody(true)
            });
        }

        const $overlay = $('#header-overlay');
        if ($overlay.length) {
            $overlay.click(function () {
                handleBody();
            });
        }
    } else {
        handleBody();
    }
}

const handleStickHeader = function () {
    $(window).scroll(function (e) {
        if ($(document).scrollTop() > $('#header').innerHeight()) {
            $('#header').addClass('is-scroll');
        } else {
            $('#header').removeClass('is-scroll');
        }
    });
}

const handleSlideHeader = function () {
    if ($('#slider-header').length > 0) {
        new Swiper('#slider-header .swiper', {
            slidesPerView: 1,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            speed: 800,
            loop: true,
        });
    }
}

const handleSlideTestimonials = function () {
    if ($('#slider-testimonials').length > 0) {
        new Swiper('#slider-testimonials .swiper', {
            speed: 500,
            slidesPerView: 6,
            preloadImages: false,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: "#slider-testimonials .slider-pagination",
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            },
        });
    }
}

const handleFancybox = function () {
    if ($('#fancyHero').length) {
        Fancybox.bind(`#fancyHero`);
    }

    if ($('.fancyGallery').length) {
        $('.fancyGallery').each(function () {
            let elm = $(this);
            Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
                thumbs: {
                    autoStart: true,
                },
            });
        });
    }
}

const handleSubmitFormValid = function () {
    if ($('#contactForm').length) {
        $('#contactForm').submit(function (event) {
            let form = $(this);
            if (!form[0].checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.addClass('was-validated');
            }
            return false;
        });
    }
}

const handleScrollElm = function () {
    if ($('.handleScrollElm').length && $('.elmTargetScroll').length) {
        $('.handleScrollElm').click(function (event) {
            let elmClick = $(this);
            let elmTarget = elmClick.attr('data-target');
            if ($(elmTarget).length) {
                $('.handleScrollElm').removeClass('active');
                elmClick.addClass('active');
                let offsetElm = $(elmTarget).offset().top;
                if (offsetElm > 0) {
                    offsetElm -= $('#header .header-bottom').outerHeight() - 1;
                }
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: offsetElm
                });
            }
            return false;
        });

        let elmTargetScroll = $('.elmTargetScroll');
        $(window).on('scroll', function () {
            let scrollTop = $(this).scrollTop();

            for (let i = 0; i < elmTargetScroll.length; i++) {
                let divOffset = $(elmTargetScroll[i]).offset().top;
                let divInner = $(elmTargetScroll[i]).innerHeight();

                if (scrollTop > 0) {
                    if (scrollTop >= (divOffset - $('#header .header-bottom').outerHeight()) && scrollTop < (divOffset - $('#header .header-bottom').outerHeight()) + divInner) {
                        $('.handleScrollElm').removeClass('active');
                        $('.handleScrollElm[data-target="#' + $(elmTargetScroll[i]).attr('id') + '"]').addClass('active');
                        break; // Kết thúc vòng lặp khi đã tìm được div
                    }
                } else {
                    $('.handleScrollElm').removeClass('active');
                    $('.handleScrollElm[data-target="#body"]').addClass('active');
                }
            }


        });
    }
}

$(function () {
    // Preloader
    $(window).on('load', function () {
        if ($('#preloader').length) {
            $('#preloader').delay(100).fadeOut('slow', function () {
                $('body').removeClass('is-preloader');
                $(this).remove();
            });
        }
    });

    AOS.init({
        once: true,
        duration: 800,
    });

    handleApplyCollapse($('#header-navigation > ul'), true, true);
    handleCallMenu();
    $(window).resize(function () {
        handleApplyCollapse($('#header-navigation > ul'));
        handleCallMenu();
    });

    handleStickHeader();

    handleSlideHeader();
    handleSlideTestimonials();

    handleFancybox();

    handleSubmitFormValid();

    handleScrollElm();
});
