// Install uBlock Origin core via npm

const { StaticNetFilteringEngine } = require('@gorhill/ubo-core');

const blocklistText = `
||video-edge-*.ttvnw.net/v1/segment/*$media
||video-edge-d55370.ams02.abs.hls.ttvnw.net/v1/segment/*$media
||gql.twitch.tv/gql$xmlhttprequest,domain=twitch.tv,important
||countess.twitch.tv/countess/batch^$domain=twitch.tv,important
||imasdk.googleapis.com/js/sdkloader/ima3.js$domain=twitch.tv,important
`;

const snfe = await StaticNetFilteringEngine.create();
await snfe.useLists([ { raw: blocklistText } ]);

// Apply the filter list as needed in your application

// ESC Key emualtion for back button
document.addEventListener('back', (event) => {
  if (event.key === 'Escape') {
    window.history.back();
  }
});

// Lautstärketasten, Home & Zurück
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'AudioVolumeUp':
    case 'VolumeUp':
      console.log('Volume Up');
      break;
    case 'AudioVolumeDown':
    case 'VolumeDown':
      console.log('Volume Down');
      break;
    case 'Home':
      console.log('Home gedrückt');
      openHomeMenu();
      break;
    case 'Backspace':
    case 'Back':
      if (document.querySelector('#homeMenu.visible')) {
        document.querySelector('#homeMenu')?.classList.remove('visible');
      } else {
        window.history.back();
      }
      break;
    case 'ArrowRight':
      focusNext();
      break;
    case 'ArrowLeft':
      focusPrev();
      break;
  }
});

function openHomeMenu() {
  document.querySelector('#homeMenu')?.classList.add('visible');
}

function focusNext() {
  const focusables = Array.from(document.querySelectorAll('[tabindex]'));
  const index = focusables.indexOf(document.activeElement);
  if (index >= 0 && index < focusables.length - 1) {
    focusables[index + 1].focus();
  }
}

function focusPrev() {
  const focusables = Array.from(document.querySelectorAll('[tabindex]'));
  const index = focusables.indexOf(document.activeElement);
  if (index > 0) {
    focusables[index - 1].focus();
  }
}
