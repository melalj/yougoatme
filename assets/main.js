var illoPos = document.querySelectorAll('[data-hover]');
var illoContainer = document.querySelector('.illo-container');
var lastPos = null;
var playedIllo = false;
var meehIllo = false;
var timeoutOpen;

for (var i = 0; i < illoPos.length; i++) {
  illoPos[i].addEventListener('mouseover', function() {
    illoContainer.setAttribute('data-pos', this.getAttribute('class'));
    lastPos = this.getAttribute('class');
    if (!playedIllo) {
      gtag('event', 'illo-over', { 'event_category': this.getAttribute('class') });
      playedIllo = true;
    }
  });
  illoPos[i].addEventListener('mouseout', function() {
    illoContainer.removeAttribute('data-pos');
    lastPos = null;
  });
}
illoContainer.addEventListener('mousedown', function() {
  var self = this;
  document.getElementById('scream').currentTime = 0;
  document.getElementById('scream').play();
  clearTimeout(timeoutOpen);
  timeoutOpen = window.setTimeout(function() {
    self.setAttribute('data-pos', 'illo-open');
    if (!meehIllo) {
      gtag('event', 'illo-meeh');
      meehIllo = true;
    }
  }, 50);
});

illoContainer.addEventListener('mouseup', function() {
  clearTimeout(timeoutOpen);
  this.setAttribute('data-pos', lastPos);
  document.getElementById('scream').pause();
  
});

var enableScroll = document.querySelector('section.hero') ? document.querySelector('section.hero').getBoundingClientRect().height : 0;
var fixedHeader = false;
var timeoutFixedEnd;
document.addEventListener('scroll', () => {
  if (!fixedHeader && window.scrollY > enableScroll) {
    document.querySelector('body').setAttribute('class', 'fixed-header');
    fixedHeader = true;
  } else if (fixedHeader && window.scrollY <= 100) {
    clearTimeout(timeoutFixedEnd);
    document.querySelector('body').removeAttribute('class');
    fixedHeader = false;
  } else if (fixedHeader && window.scrollY <= enableScroll) {
    document.querySelector('body').setAttribute('class', 'fixed-header fixed-header-end');
    timeoutFixedEnd = window.setTimeout(function() {
      document.querySelector('body').removeAttribute('class');
      fixedHeader = false;
      timeoutFixedEnd = null;
    }, 300);
  } 
});

document.getElementById('nav-toggle').addEventListener('click', function() {
  if (document.getElementById('navbar').getAttribute('class') === 'navbar-collapse collapse') {
    document.getElementById('navbar').setAttribute('class', 'navbar-collapse')
  } else {
    document.getElementById('navbar').setAttribute('class', 'navbar-collapse collapse')
  }
});

document.querySelector('.actions .btn').addEventListener('click', function () {
  gtag('event', 'cta-click', { 'event_category' : 'hero' });
});

window.setTimeout(function() {
  illoContainer.setAttribute('data-pos', 'illo-left');
    window.setTimeout(function() {
      illoContainer.removeAttribute('data-pos');
    }, 500);
}, 3000);

// FULL GOAT
var audioScream = document.getElementById('scream');
var fullGoat = document.querySelector('#goat-action');
var fullGoatHadLoggedEvent = false;

var fullGoatFirstSqueeze = 0;
var fullGoatTimeoutSqueeze;
var fullGoatTimeoutRelease;
var fullGoatTimeoutReset;

function fullGoatOnSqueeze() {
  clearTimeout(fullGoatTimeoutSqueeze);
  clearTimeout(fullGoatTimeoutRelease);

  var dateDiffTriggerScream = Date.now() - fullGoatFirstSqueeze 
  var deltaTriggerScream = (dateDiffTriggerScream > 300) ? 300 : 0;
  if (fullGoatFirstSqueeze) fullGoatFirstSqueeze = Date.now();  

  fullGoat.parentNode.setAttribute('class', 'fulltoy-section squeezed');
  fullGoatTimeoutSqueeze = window.setTimeout(function() {
    fullGoat.setAttribute('class', 'goat squeezed');
    audioScream.currentTime = 0;
    audioScream.play();
    fullGoatFirstSqueeze = Date.now();  

    fullGoatTimeoutRelease = window.setTimeout(fullGoatOnRelease, 1500);
    if (!fullGoatHadLoggedEvent) {
      gtag('event', 'fullGoat-squeeze');
      fullGoatHadLoggedEvent = true;
    }
  }, deltaTriggerScream);
}

function fullGoatOnRelease() {
  clearTimeout(fullGoatTimeoutSqueeze);
  clearTimeout(fullGoatTimeoutReset);
  fullGoatTimeoutReset = window.setTimeout(function() {
    fullGoatFirstSqueeze = null;
  }, 600);
  fullGoat.setAttribute('class', 'goat');
  fullGoat.parentNode.setAttribute('class', 'fulltoy-section');
  audioScream.pause();
}

fullGoat.addEventListener('mousedown', fullGoatOnSqueeze);
fullGoat.addEventListener('touchstart', fullGoatOnSqueeze);
fullGoat.addEventListener('mouseup', fullGoatOnRelease);
fullGoat.addEventListener('touchend', fullGoatOnRelease);