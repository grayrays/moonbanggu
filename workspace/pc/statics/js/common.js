

$(function(){
  var minWidth = 1320;
  $('a').each(function(){
    $(this).click(function(e){
      if ($(this).attr('href') === '#none' ) e.preventDefault();
    }) 
  }); 

  var $navDrawer = $('.nav-drawer');
  var navgation = $navDrawer.find('.nav-inner');
  var navgationDimd = $navDrawer.find('.nav-dimd');
  $('.gnb .bt-menu').click(function(){
    $navDrawer.addClass('show');
    navgation.css({'right': -navgation.width()}).animate({'right' : '0'}, 300);
    navgationDimd.css({'opacity': '0'}).animate({'opacity' : '1'},200);
    scrollDisable();
  });

  var $btClose = $('.bt-close');
  $btClose.each(function(){
    $(this).click(function(){
      navClose();
    });
  });
  $navDrawer.click(function(e){
    var target = e.target;
    if ($navDrawer.hasClass('show') && !$('.nav-inner').has(target).length) navClose();
  });
  function navClose() {
    var $navDrawer = $('.nav-drawer');
    var navgation = $navDrawer.find('.nav-inner');
    navgation.animate({'right' : -navgation.width()}, 300);
    navgationDimd.stop().delay(200).animate({'opacity' : '0'},200);
    setTimeout(function() {
      $navDrawer.removeClass('show');
      navgation.removeAttr('style');
      navgationDimd.removeAttr('style');
    }, 500)
    scrollAble();
  }

  var $select = $('.select-box');
  $select.each(function(){
    var select = $(this);
    var selected = select.find('.select-text button');
    var options = select.find('.options li button, .options li a');
    var optionsBox = select.find('.options');
    if (optionsBox.height() <= optionsBox.find('ul').height()) optionsBox.addClass('overflow');
    $('body').click(function(e){
      var target = e.target;
      if (select.hasClass('show') && !select.has(target).length) select.removeClass('show');

    });
    selected.click(function(){
      select.hasClass('show') ? select.removeClass('show') : select.addClass('show');
    });
    options.click(function(){
      var target = $(this);
      var selectText = target.text();
      if (target.parent('li').hasClass('disabled')){
        select.removeClass('show');
      } else {
        target.parent('li').siblings().removeClass('selected')
        target.parent('li').addClass('selected')
        select.removeClass('show');
        selected.removeAttr('class');
        if (!target.parents('.item-buy').length) {
          selected.text(selectText);
        }
      }
    });
  });
  /* detail */
  var $viewTab = $('.view-tab');
  var viewTabList = $viewTab.find('li');
  var $viewContent = $('.view-content');
  /* cart */
  var $wrapper = $('.moonbanggu-wrapper');
  var $cart = $('.cart-wrapper');
  var fixedNavH = $('.moonbanggu-header').outerHeight();
  var $payment = $('.payment-area');
  var paymentTop = $payment.length ? $payment.offset().top - fixedNavH : undefined;
  tabFixed();
  $(window).on('scroll load resize', function(){
    var thisScroll = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var $fixedNav = $('.moonbanggu-header');
    if (thisScroll > 0) {
      $fixedNav.addClass('fixed underline');
    } else {
      $fixedNav.removeClass('fixed underline');
    }
    /*
    if ($fixedNav.hasClass('fixed') && $(window).width() <= minWidth && scrollLeft >= 0) {
      $fixedNav.css({ 'margin-left' : -scrollLeft });
    } else {
      $fixedNav.removeAttr('style');
    }
    */
    tabFixed();

    if (thisScroll >= paymentTop) {
      var paymentEnd = $cart.offset().top + $cart.outerHeight() - $payment.outerHeight() - $fixedNav.height();
      if (thisScroll >= paymentEnd) {
        $payment.removeClass('fixed').addClass('end');
      } else {
        $payment.removeClass('end').addClass('fixed');
      }
    } else {
      $payment.removeClass('fixed');
    }

    if ($(window).width() <= minWidth && thisScroll >= paymentTop && thisScroll <= paymentEnd) {
      $payment.css({
        'left' : '0',
        'margin-left' : $cart.offset().left + $cart.outerWidth() - $payment.outerWidth() - scrollLeft
      });
    } else {
      $payment.removeAttr('style');
    }
  });
  function tabFixed() {
    var thisScroll = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var $fixedNav = $('.moonbanggu-header');
    var $viewTab = $('.view-tab');
    var $viewContent = $('.view-content');
    if ($viewContent.length) {
      var tabPos = $viewContent.offset().top;
      thisScroll >= tabPos ? $viewTab.addClass('fixed') : $viewTab.removeClass('fixed');
      if (thisScroll >= (tabPos - $fixedNav.outerHeight())) {
        $fixedNav.css({ 'transform' : 'translateY('+ ((tabPos - $fixedNav.outerHeight()) - thisScroll) +'px)' })
      } else {
        $fixedNav.removeAttr('style');
      }
      /*
      if ($viewTab.hasClass('fixed') && $(window).width() <= minWidth && scrollLeft >= 0) {
        $viewTab.css({ 'margin-left' : - (scrollLeft - ((minWidth-$viewTab.find('ul').width())/2)) });
      } else {
        $viewTab.removeAttr('style');
      }
      */
    }
  }

  var loadIndex = $viewTab.find('ul').children('.active').index();
  tabContent(loadIndex);
  viewTabList.each(function(){
    $(this).find('a').click(function(){
      var index = $(this).parent('li').index();
      tabContent(index);
      if ($viewContent.length) {
        var tabPos = $viewContent.offset().top;
        $(window).scrollTop(tabPos);
      }
    });
  });
  function tabContent(index){
    var $viewBox = $('.view-box');
    viewTabList.removeClass('active');
    viewTabList.eq(index).addClass('active');
    $viewBox.not(':eq('+ index +')').removeClass('show');
    $viewBox.eq(index).addClass('show');
  }

  /* swiper */
  var $viewSlide = $('.item-preview');
  if ($viewSlide.length) {
    var swiper = new Swiper('.item-preview', {
      loop: true,
      effect: 'fade',
      //wrapperClass: 'item-preview',
      //slideClass: 'preview-slide',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        bulletActiveClass: 'active',
        clickable: true,
      },
      navigation: {
        nextEl: '.item-preview .swiper-button-next',
        prevEl: '.item-preview .swiper-button-prev',
      }
    });
  }
  var $recommend = $('.item-recommend');
  if ($recommend.length) {
    var swiper2 = new Swiper('.item-recommend-content', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 20,
      loop: true,
      wrapperClass: 'b-list',
      slideClass: 'list-box',
      navigation: {
        nextEl: '.item-recommend .swiper-button-next',
        prevEl: '.item-recommend .swiper-button-prev',
      }
    });
  }

  var $mainBanner = $('.main-visual');
  if ($mainBanner.length) {
    $mainBanner.find('ul').addClass('swiper-wrapper');
    $mainBanner.find('li').each(function(){
      $(this).addClass('swiper-slide');
    });
    if ($mainBanner.find('li').length > 1) {
      var swiper3 = new Swiper('.main-visual', {
        slidesPerView: 1,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        centeredSlides: true,
        pagination: {
          el: '.visual-pagination',
          bulletActiveClass: 'active',
          clickable: true,
        },
        navigation: {
          nextEl: '.bt-visual-next',
          prevEl: '.bt-visual-prev',
        },
      });
    }
  }

  var $mainTheme = $('.main-theme');
  if ($mainTheme.length) {
    $mainTheme.find('.b-list').addClass('swiper-wrapper');
    $mainTheme.find('.list-box').each(function(){
      $(this).addClass('swiper-slide');
    });
    var swiper3 = new Swiper('.main-swiper', {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 40,
      loop: true,
      loopAdditionalSlides: 1,
      navigation: {
        nextEl: '.main-theme .bt-nav.next',
        prevEl: '.main-theme .bt-nav.prev',
      }
    });
  }
  var $popupBanner = $('.popup-banner');
  if ($popupBanner.length) {
    $popupBanner.find('.banner-list').addClass('swiper-wrapper');
    $popupBanner.find('.banner-box').each(function(){
      $(this).addClass('swiper-slide');
    });
    var swiper4 = new Swiper('.banner-content', {
      slidesPerView: 'auto',
      loop: true,
      loopAdditionalSlides: 1,
      pagination: {
        el: '.pagination',
        bulletActiveClass: 'active',
        clickable: true,
      },
      navigation: {
        nextEl: '.bt-popup-next',
        prevEl: '.bt-popup-prev',
      }
    });
  }

  var $searchList = $('.search-list');
  if ($searchList.length && $searchList.find('.list-box').length > 4) {
    $searchList.addClass('swiper');
    $searchList.find('.b-list').addClass('swiper-wrapper');
    $searchList.find('.list-box').each(function(){
      $(this).addClass('swiper-slide');
    });
    var swiper3 = new Swiper('.search-list', {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 16,
      wrapperClass: 'b-list',
      slideClass: 'list-box',
      navigation: {
        nextEl: '.search-list .bt-next',
        prevEl: '.search-list .bt-prev',
      },
      pagination: {
        el : '.search-list .pagination',
        type: 'fraction',
        totalClass : 'total',
        currentClass: 'current'
      }
    });
  }

  var $inputs = $('.input-box');
  $inputs.each(function(){
    if (!$(this).hasClass('no-script') && !$(this).hasClass('small')) inputBox($(this));
  });

  var $textbox = $('.text-box');
  $textbox.each(function(){
    var box = $(this).find('textarea');
    box.on('focus', function(){
      box.parent('.text-box').addClass('focus');
    }).on('blur', function(){
      box.parent('.text-box').removeClass('focus');
    });
  });

  var $agreeBtn = $('.agree-list .bt-more');
  $agreeBtn.each(function(){
    var agreeContent = $(this).next();
    $(this).click(function(){
      !$(this).hasClass('close') ? $(this).addClass('close') : $(this).removeClass('close');
      !agreeContent.hasClass('show') ? agreeContent.addClass('show') : agreeContent.removeClass('show');
    });
  });

  var orderMore = $('.my-header .bt-more');
  if (orderMore.length) {
    orderMore.each(function(){
      var contents = $(this).parent().siblings();
      var contentH = contents.outerHeight();
      var timer = contentH/2 >= 500 ? 300 : contentH/2;
      $(this).click(function(e){
        var text = $(this).hasClass('hide') ? '상세 보기' : '닫기';
        $(this).toggleClass('hide');
        contents.slideToggle(timer);
        $(this).html(text);
        e.preventDefault();
      });
    });
  }

  var $inquiryBox = $('.inquiry-box');
  if ($inquiryBox.length) {
    $inquiryBox.each(function() {
      var _this = $(this);
      var list = _this.find('.inquiry-header');
      var contents = _this.find('.inquiry-content');
      var contentH = contents.outerHeight();
      var timer = contentH/2 <= 300 ? 200 : contentH/2;
      list.click(function(){
        contents.slideToggle(timer);
      });
    })
  }

  var $viewer = $('.viewer');
  if ( $viewer.length ) {
    var list = $viewer.find('.viewer-list');
    var loadIndex = list.find('li.active').length ? list.find('li.active').index() : 0;
    viewer(loadIndex);
    list.find('li').each(function(){
      $(this).find('a').click(function(){
        var index = $(this).parent('li').index();
        viewer(index)
      });
    });
    var last = list.find('li').length - 1;
    var nav = $viewer.find('.bt-nav');
    nav.click(function(){
      var index = list.find('li.active').index();
      if ($(this).hasClass('prev')) {
        index = index <= 0 ? last : index - 1;
      } else {
        index = index >= last ? 0 : index + 1;
      }
      viewer(index);
    });
  }
  function viewer(index) {
    var list = $viewer.find('.viewer-list');
    var preivew = $viewer.find('.viewer-preview');
    list.find('li').not(':eq(' + index + ')').removeAttr('class');
    list.find('li').eq(index).addClass('active');

    var images = list.find('li').eq(index).find('a').html();
    preivew.html(images);
    /*
    if(imagesH >= preivew.height()) {
      preivew.addClass('max');
    } else {
      preivew.removeClass('max');
    }
    */
  }

  $('.popup-content .agree-list .bt-more').click(function(){
    var _this = $(this);
    setTimeout(function() {
      var height = _this.parents('.agree-list').find('.agree-inner').outerHeight();
      var top = _this.parents('.popup-content').outerHeight();
      _this.parents('.popup-content').animate({
        scrollTop : top + height
      }, 200);
    }, 100)
  });
});

function inputBox(inputTarget) {
  var _this = inputTarget;
  var box = _this.find('input');
  var valid = _this.next('.text-valid');
  var error = valid.text();
  var complete = valid.attr('data-complete');
  if (!_this.hasClass('disabled')) {
    box.click(function(){
      _this.addClass('focus');
      if (_this.hasClass('active')) _this.removeClass('active');
    });
    box.on('keypress keyup', function(){
      if (box.val().length >= 2) {
        _this.removeClass('error');
        if (complete) valid.text(complete);
      } else {
        _this.addClass('error');
        if (complete) valid.text(error);
      }
    });
    $('body').click(function(e){
      var target = e.target;
      if (_this.hasClass('input-box') && !_this.has(target).length) {
        _this.removeClass('focus')
        if (!box.val() == '') {
          _this.addClass('active');
          if (valid.length) valid.addClass('show');
          if (box.val().length < 2) {
            _this.addClass('error');
            if (complete) valid.text(error);
          } else {
            _this.removeClass('error');
            if (complete) valid.text(complete);
          }
        } else {
          _this.removeClass('active');
        }
      }
    })
  } else {
    box.attr('disabled', true);
    if (!box.val() == '') _this.addClass('active');
  }
}
function scrollDisable(){
	$('body').addClass('hidden');
	window.addEventListener('scroll touchmove mousewheel', function (event) { event.preventDefault (); }, {passive: false});
}
function scrollAble(){
	$('body').removeClass('hidden').off('scroll touchmove mousewheel');
}