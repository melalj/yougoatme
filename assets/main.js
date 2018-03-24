function onReady() {
  // MATCH HEADER AND HEADER REPLACER HEIGHT
  var headerElement = document.querySelector('header');
  var headerReplacerElement = document.querySelector('.header-replacer');
  if (headerElement && headerReplacerElement) {
    headerReplacerElement.style.height = headerElement.getBoundingClientRect().height + "px";
  }  

  // STICKY HEADER
  var stickyHeaderEnabled = false;
  var stickyHeaderTimeout;

  function stickyHeaderOnScroll() {
    var stickyHeaderTrigger = document.querySelector('[data-sticky-trigger]');
    var rect = stickyHeaderTrigger.getBoundingClientRect();
    var stickyAttr = stickyHeaderTrigger.getAttribute('data-sticky-trigger');
    var stickyHeaderTriggerValue = stickyAttr === 'bottom' ? rect.bottom : rect.top;
    if (!stickyHeaderEnabled && stickyHeaderTriggerValue < 0) {
      document.querySelector('body').setAttribute('class', 'fixed-header');
      stickyHeaderEnabled = true;
    } else if (stickyHeaderEnabled && window.scrollY <= 100) {
      clearTimeout(stickyHeaderTimeout);
      document.querySelector('body').removeAttribute('class');
      stickyHeaderEnabled = false;
    } else if (stickyHeaderEnabled && stickyHeaderTriggerValue > 0) {
      document.querySelector('body').setAttribute('class', 'fixed-header fixed-header-end');
      stickyHeaderTimeout = window.setTimeout(function() {
        document.querySelector('body').removeAttribute('class');
        stickyHeaderEnabled = false;
        stickyHeaderTimeout = null;
      }, 300);
    }
  }
  document.addEventListener('scroll', stickyHeaderOnScroll);

  // MENU MOBILE
  var menuMobile = document.getElementById('navbar');
  function menuMobileOnClick() {
    if (menuMobile.getAttribute('class') === 'navbar-collapse collapse') {
      menuMobile.setAttribute('class', 'navbar-collapse')
    } else {
      menuMobile.setAttribute('class', 'navbar-collapse collapse')
    }
  }

  document.querySelector('.nav-toggle').addEventListener('click', menuMobileOnClick);

  // GA EVENT TRACKING
  var tagWithEventTracking = document.querySelectorAll('[data-event-click]');
  for (var i = 0; i < tagWithEventTracking.length; i++) {
    tagWithEventTracking[i].addEventListener('click', function () {
      var tagEventSplit = this.getAttribute('data-event-click').split(',');
      var eventData = {};
      if (tagEventSplit[1]) eventData.event_category = tagEventSplit[1];
      if (tagEventSplit[2]) eventData.event_label = tagEventSplit[2];
      gtag('event', tagEventSplit[0], eventData);
    });
  }

  // AUDIO
  var audioScream = document.getElementById('scream');

  // GOAT HEAD
  var goatHead = document.querySelector('.illo-container');
  var goatHeadDirections = document.querySelectorAll('[data-hover]');

  var goatHeadHadLoggedEvent = false;
  var goatHeadHadOver = false;

  var goatHeadLastPosition;

  var goatHeadTimeoutMouth;
  var goatHeadTimeoutRelease;

  if (goatHead) {
    function goatHeadOnSqueeze() {
      audioScream.currentTime = 0;
      audioScream.play();
      clearTimeout(goatHeadTimeoutMouth);
      goatHeadTimeoutMouth = window.setTimeout(function() {
        goatHead.setAttribute('data-pos', 'illo-open');
        goatHeadTimeoutRelease = window.setTimeout(goatHeadOnRelease, 1000);
        if (!goatHeadHadLoggedEvent) {
          gtag('event', 'goatHead-squeeze');
          goatHeadHadLoggedEvent = true;
        }
      }, 50);
    }
    
    function goatHeadOnRelease() {
      clearTimeout(goatHeadTimeoutMouth);
      clearTimeout(goatHeadTimeoutRelease);
      goatHead.setAttribute('data-pos', goatHeadLastPosition);
      audioScream.pause();
    }
    
    function goatHeadOnOver() {
      goatHead.setAttribute('data-pos', this.getAttribute('class'));
      goatHeadLastPosition = this.getAttribute('class');
      if (!goatHeadHadOver) {
        gtag('event', 'goatHead-over', { 'event_category': this.getAttribute('class') });
        goatHeadHadOver = true;
      }
    }
    
    function goatHeadOnOut() {
      goatHead.removeAttribute('data-pos');
      goatHeadLastPosition = null;
    }
    
    for (var i = 0; i < goatHeadDirections.length; i++) {
      goatHeadDirections[i].addEventListener('mouseover', goatHeadOnOver);
      goatHeadDirections[i].addEventListener('mouseout', goatHeadOnOut);
    }
    
    goatHead.addEventListener('mousedown', goatHeadOnSqueeze);
    goatHead.addEventListener('touchstart', goatHeadOnSqueeze);
    goatHead.addEventListener('mouseup', goatHeadOnRelease);
    goatHead.addEventListener('touchend', goatHeadOnRelease);  
  
    // MOVE GOAT HEAD
    window.setTimeout(function() {
      goatHead.setAttribute('data-pos', 'illo-left');
        window.setTimeout(function() {
          goatHead.removeAttribute('data-pos');
        }, 500);
    }, 3000);
  }

  // FULL GOAT
  var fullGoat = document.querySelector('#goat-action');
  var fullGoatBackground = document.querySelector('.fulltoy-section .goat');
  var fullGoatHadLoggedEvent = false;

  var fullGoatFirstSqueeze = 0;

  var fullGoatTimeoutSqueeze;
  var fullGoatTimeoutRelease;
  var fullGoatTimeoutReset;

  if (fullGoat) {
    function fullGoatOnSqueeze() {
      clearTimeout(fullGoatTimeoutSqueeze);
      clearTimeout(fullGoatTimeoutRelease);
    
      var dateDiffTriggerScream = Date.now() - fullGoatFirstSqueeze 
      var deltaTriggerScream = (dateDiffTriggerScream > 300) ? 300 : 0;
      if (fullGoatFirstSqueeze) fullGoatFirstSqueeze = Date.now();  
    
      fullGoat.parentNode.setAttribute('class', 'fulltoy-section noselect squeezed');
      fullGoatTimeoutSqueeze = window.setTimeout(function() {
        fullGoatBackground.setAttribute('class', 'goat squeezed');
        audioScream.currentTime = 0;
        audioScream.play();
        fullGoatFirstSqueeze = Date.now();  
    
        fullGoatTimeoutRelease = window.setTimeout(fullGoatOnRelease, 1000);
        if (!fullGoatHadLoggedEvent) {
          gtag('event', 'fullGoat-squeeze');
          fullGoatHadLoggedEvent = true;
        }
      }, deltaTriggerScream);
    }
    
    function fullGoatOnRelease() {
      clearTimeout(fullGoatTimeoutSqueeze);
      clearTimeout(fullGoatTimeoutReset);
      clearTimeout(fullGoatTimeoutRelease);  
      fullGoatTimeoutReset = window.setTimeout(function() {
        fullGoatFirstSqueeze = null;
      }, 600);
      fullGoatBackground.setAttribute('class', 'goat');
      fullGoat.parentNode.setAttribute('class', 'fulltoy-section noselect');
      audioScream.pause();
    }
    
    fullGoat.addEventListener('mousedown', fullGoatOnSqueeze);
    fullGoat.addEventListener('touchstart', fullGoatOnSqueeze);
    fullGoat.addEventListener('mouseup', fullGoatOnRelease);
    fullGoat.addEventListener('touchend', fullGoatOnRelease);  
  }

  // ATTACH LINK TO COLLAGE SHADOW
  if (document.querySelector('.collage-shadow')){
    document.querySelector('.collage-shadow').addEventListener('click', function() {
      this.querySelector('a').click();
    });
  }

  // ATTACH LINK TO ITEM
  if (document.querySelectorAll('.item').length){
    var items = document.querySelectorAll('.item');
    for (var i = 0; i < items.length; i += 1) {
      items[i].addEventListener('click', function() {
        this.querySelector('a').click();
      });
    } 
  }

  // CURSOR SCROLL
  if (document.querySelector('.hero-scroll')) {
    document.querySelector('.hero-scroll').addEventListener('click', function() {
      var scrollY = document.querySelector('.story').getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, scrollY);
    });
  }
}

document.addEventListener('DOMContentLoaded', onReady, false);
