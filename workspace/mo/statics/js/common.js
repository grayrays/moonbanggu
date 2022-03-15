$(function(){
  $('a').each(function(){
    $(this).click(function(e){
      if ($(this).attr('href') === '#none' ) e.preventDefault();
    })
  });
  $('.gnb .bt-menu').click(function(){
    if (!$(this).parents('.guide-wrapper').length) {
      $('.nav-drawer').addClass('show');
      scrollDisable();
    }
  });

  var $btClose = $('.bt-close');
  $btClose.each(function(){
    $(this).click(function(){
      $(this).parents('.nav-drawer').removeClass('show');
      scrollAble();
    });
  });

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

  var $itemBuy = $('.item-buy');
  var itemSelect = $itemBuy.find('.select-box');
  if ($itemBuy.length) {
    $('.moonbanggu-wrapper').addClass('type-detail');
  }
  var buyContent = $itemBuy.find('.item-buy-content');
  var buyButton = $itemBuy.find('.btn-group .bt-base');
  buyButton.click(function(){
    if (!buyContent.hasClass('show')) {
      $itemBuy.after('<div class="layer-dimd"></div>');
      $('.layer-dimd').addClass('show');
      buyContent.addClass('show');
    } else {
      alert('옵션이 열린 상태에선 결제로 넘어갑니다.');
    }

    $('.layer-dimd').click(function(e){
      var target = e.target;
      if (buyContent.hasClass('show') && !buyContent.has(target).length) {
        $(this).removeClass('show');
        $(this).remove();
        buyContent.removeAttr('style');
        buyContent.removeClass('show');
      }
    });
  });

  itemSelect.each(function(){
    var _this = $(this);
    _this.find('.select-text').click(function(e){
      var target = e.target;
      var height = itemSelect.length > 1 ? _this.find('.select-options').outerHeight() + $(this).height() * itemSelect.length : _this.find('.select-options').outerHeight();
      if (buyContent.outerHeight() <= height) {
        buyContent.outerHeight(_this.find('.select-options').outerHeight() + _this.find('.select-text').height() + 20);
      } else {
        buyContent.removeAttr('style');
      }
    });
    $(this).find('.select-options .options li').click(function(){
      var name = $(this).find('button, a').text();
      buyContent.removeAttr('style');
      $('.buy-list').append(`
        <div class="buy-list-box">
          <h4>${name}</h4>
          <div class="buy-options">
            <div class="quantity">
              <input type="number" value="1" />
              <button class="bt-minus">빼기</button>
              <button class="bt-plus">더하기</button>
            </div>
            <p class="price"><span>3,500</span>원</p>
          </div>
          <a href="#none" class="bt-delete">삭제</a>
        </div>`);

        $('.buy-list').on('scroll', function(){
          if ( $(this).scrollTop() >= 1 ) {
            $(this).addClass('scroll');
          } else {
            $(this).removeClass('scroll');
          }
        })
    });
  });

  var $viewTab = $('.view-tab');
  var viewTabList = $viewTab.find('li');
  var $viewContent = $('.view-content');
  var $fixedNav = $('.nav-global');
  tabFixed();
  $(window).on('scroll load resize', function(){
    var thisScroll = $(this).scrollTop();
    var $fixedNav = $('.nav-global');
    //var tabMargin = parseInt($viewContent.css('margin-top'));
    if (thisScroll > 0) {
      $fixedNav.addClass('underline');
    } else {
      $fixedNav.removeClass('underline');
    }
    tabFixed();
  });
  function tabFixed() {
    var thisScroll = $(this).scrollTop();
    var $fixedNav = $('.nav-global');
    var $viewTab = $('.view-tab');
    var $viewContent = $('.view-content');
    if ($viewContent.length) {
      var tabPos = $viewContent.offset().top;
      thisScroll >= tabPos ? $viewTab.addClass('fixed') : $viewTab.removeClass('fixed');
      if (thisScroll >= (tabPos - $fixedNav.outerHeight())) {
        $fixedNav.css({ 'margin-top' : (tabPos - $fixedNav.outerHeight()) - thisScroll })
      } else {
        $fixedNav.removeAttr('style');
      }
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

  var $footerBtn = $('.moonbanggu-footer h2');
  $footerBtn.click(function(){
    $(this).toggleClass('show');
  });

  /* swiper */
  var $viewSlide = $('.item-preview');
  if ($viewSlide.length) {
    var swiper = new Swiper(".item-preview", {
      slidesPerView: 1,
      loop: true,
      //wrapperClass: 'item-preview',
      //slideClass: 'preview-slide',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        bulletActiveClass: 'active',
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  var $recommend = $('.item-recommend');
  if ($recommend.length) {
    var swiper2 = new Swiper('.item-recommend-content', {
      slidesPerView: 'auto',
      //loop: true,
      wrapperClass: 'b-list',
      slideClass: 'list-box',
    });
  }

  var $mainBanner = $('.main-visual');
  if ($mainBanner.length) {
    $mainBanner.find('ul').addClass('swiper-wrapper');
    $mainBanner.find('li').each(function(){
      $(this).addClass('swiper-slide');
    });
    if ($mainBanner.find('li').length >= 2) {
      var swiper3 = new Swiper('.main-visual', {
        slidesPerView: 'auto',
        loop: true,
        loopAdditionalSlides: 1,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        pagination: {
          el: '.visual-pagination',
          currentClass: 'active',
          clickable: true,
        },
        on: {
          slideChange: function () {
            mainPagination()
          }
        }
      });
      mainPagination();
    } else {
      var pagination = $('.visual-pagination');
      pagination.remove();
    }
    function mainPagination() {
      var pagination = $('.visual-pagination');
      var length = pagination.find('.swiper-pagination-bullet').length;
      var index = pagination.find('.swiper-pagination-bullet-active').index();
      if (!pagination.find('.active').length) pagination.append('<span class="active"></span>');
      var paginationActive = pagination.find('.active');
      paginationActive.css({
        'width' : 100 / length + '%',
        'left' : ((100 / length) * index) + '%'
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
      slidesPerView: 'auto',
      loop: true,
      loopAdditionalSlides: 1,
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

  var $search = $('.layer-search');
  var searchContent = $search.find('.search-content');
  var searchTop = searchContent.scrollTop();
  var searchInput = $search.find('.input-search');
  searchTop > 0 ? searchInput.addClass('fixed') : searchInput.removeClass('fixed');
  searchContent.on('scroll', function(){
    var searchTop = $(this).scrollTop();
    searchTop > 0 ? searchInput.addClass('fixed') : searchInput.removeClass('fixed');
  });

  $fixedNav.find('.bt-search').click(function(){
    $search.addClass('show');
    scrollDisable();
  });
  $search.find('.bt-close').click(function(){
    $search.removeClass('show');
    scrollAble();
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