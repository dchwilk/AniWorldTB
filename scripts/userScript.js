// == AniWorldTV Enhancements für TizenTV & Desktop mit Tastatur/Remote ==
import './navigation.js';
import './adblock.js';
// import './debug.js';

(function() {
    'use strict';

    // Erzeuge ein <style>-Tag mit höchster Priorität
    const style = document.createElement('style');
    style.textContent = `
        html, body {
            background: red !important;
            background-image: none !important;
        }

        * {
            background: transparent !important;
            background-image: none !important;
        }
    `;

    // Warten, bis <head> verfügbar ist
    const injectStyle = () => {
        if (document.head) {
            document.head.appendChild(style);
        } else {
            new MutationObserver((_, obs) => {
                if (document.head) {
                    document.head.appendChild(style);
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true, subtree: true });
        }
    };

    injectStyle();

    document.head.appendChild(style);

    // Optional: auch direkt per Inline-Style (als letzte Absicherung)
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.setProperty('background', 'red', 'important');
        document.body.style.setProperty('background-image', 'none', 'important');
    });
})();

(function setupInputDebugger() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.width = '400px';
  overlay.style.maxHeight = '100vh';
  overlay.style.overflowY = 'auto';
  overlay.style.zIndex = '999999';
  overlay.style.background = 'rgba(0, 0, 0, 0.8)';
  overlay.style.color = '#00FF00';
  overlay.style.fontSize = '12px';
  overlay.style.fontFamily = 'monospace';
  overlay.style.padding = '10px';
  overlay.style.pointerEvents = 'none'; // lässt das Overlay klickdurchlässig

  document.body.appendChild(overlay);

  function log(msg) {
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    overlay.appendChild(line);
    overlay.scrollTop = overlay.scrollHeight; // Auto-Scroll
  }

  // Keyboards
  window.addEventListener('keydown', (e) => {
    log(`KeyDown: code=${e.code}, key="${e.key}"`);
  });

  window.addEventListener('keyup', (e) => {
    log(`KeyUp: code=${e.code}, key="${e.key}"`);
  });

  // Gamepads (Polling)
  let lastGamepadStates = {};

  function pollGamepads() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];

    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      if (!pad) continue;

      pad.buttons.forEach((btn, idx) => {
        const prev = (lastGamepadStates[pad.index] || {})[idx] || false;
        if (btn.pressed && !prev) {
          log(`Gamepad[${pad.index}] Button ${idx} pressed`);
        }
        (lastGamepadStates[pad.index] = lastGamepadStates[pad.index] || {})[idx] = btn.pressed;
      });

      pad.axes.forEach((val, idx) => {
        if (Math.abs(val) > 0.1) {
          log(`Gamepad[${pad.index}] Axis ${idx}: ${val.toFixed(2)}`);
        }
      });
    }

    requestAnimationFrame(pollGamepads);
  }
  pollGamepads();

  // Tizen-Fernbedienung (KeyEvent)
  document.addEventListener('keydown', (e) => {
    if (typeof tizen !== 'undefined') {
      log(`Tizen key event: ${e.keyCode}`);
    }
  });

  // Fehler-Logging
  window.addEventListener('error', (e) => {
    log(`❌ Error: ${e.message} @ ${e.filename}:${e.lineno}`);
  });

  window.addEventListener('unhandledrejection', (e) => {
    log(`❌ Unhandled Promise rejection: ${e.reason}`);
  });

  log('✅ Input Debugger gestartet');
})();
