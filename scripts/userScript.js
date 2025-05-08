// == AniWorldTV Enhancements für TizenTV & Desktop mit Tastatur/Remote ==

// uBlock Origin Blocklist
const { StaticNetFilteringEngine } = require('@gorhill/ubo-core');

const blocklistText = `
||video-edge-*.ttvnw.net/v1/segment/*$media
||video-edge-d55370.ams02.abs.hls.ttvnw.net/v1/segment/*$media
||gql.twitch.tv/gql$xmlhttprequest,domain=twitch.tv,important
||countess.twitch.tv/countess/batch^$domain=twitch.tv,important
||imasdk.googleapis.com/js/sdkloader/ima3.js$domain=twitch.tv,important
`;

const snfe = await StaticNetFilteringEngine.create();
await snfe.useLists([{ raw: blocklistText }]);

// == Fokus-Navigation aktivieren ==
document.querySelectorAll('a, button').forEach(el => {
  el.setAttribute('tabindex', '0');
});

// == Tastatursteuerung ==
document.addEventListener('keydown', (event) => {
  const focusables = Array.from(document.querySelectorAll('a[tabindex], button[tabindex]'));
  const index = focusables.indexOf(document.activeElement);

  switch (event.code) {
    case 'ArrowRight':
    case 'ArrowDown':
      if (index >= 0 && index < focusables.length - 1) {
        focusables[index + 1].focus();
        event.preventDefault();
      }
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      if (index > 0) {
        focusables[index - 1].focus();
        event.preventDefault();
      }
      break;
    case 'Enter':
    case 'NumpadEnter':
      document.activeElement?.click();
      event.preventDefault();
      break;
    case 'AudioVolumeUp':
    case 'VolumeUp':
      console.log('Lauter gedrückt');
      break;
    case 'AudioVolumeDown':
    case 'VolumeDown':
      console.log('Leiser gedrückt');
      break;
    case 'Home':
      console.log('Home gedrückt');
      openHomeMenu();
      break;
    case 'Backspace':
    case 'Back':
    case 'Escape':
      if (document.querySelector('#homeMenu.visible')) {
        document.querySelector('#homeMenu')?.classList.remove('visible');
      } else {
        window.history.back();
      }
      break;
  }
});

// ESC-Event vom Tizen-TV
document.addEventListener('back', (event) => {
  if (event.key === 'Escape') {
    window.history.back();
  }
});

function openHomeMenu() {
  document.querySelector('#homeMenu')?.classList.add('visible');
}

// Fokus auf erstes Element setzen bei Start
window.addEventListener('load', () => {
  const first = document.querySelector('a[tabindex], button[tabindex]');
  if (first) first.focus();
});

// Mauszeiger und Fokus sichtbar lassen
document.body.style.cursor = 'default';
const style = document.createElement('style');
style.textContent = `
  a:focus, button:focus {
    outline: 3px solid #00aaff;
    outline-offset: 3px;
    border-radius: 4px;
    transition: outline 0.2s;
  }
`;
document.head.appendChild(style);
