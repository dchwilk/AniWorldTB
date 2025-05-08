// uBlock Origin Blocklist
const { StaticNetFilteringEngine } = require('@gorhill/ubo-core');

async function setupNetFilter() {
  const blocklistText = `
    ||video-edge-*.ttvnw.net/v1/segment/*$media
    ||video-edge-d55370.ams02.abs.hls.ttvnw.net/v1/segment/*$media
    ||gql.twitch.tv/gql$xmlhttprequest,domain=twitch.tv,important
    ||countess.twitch.tv/countess/batch^$domain=twitch.tv,important
    ||imasdk.googleapis.com/js/sdkloader/ima3.js$domain=twitch.tv,important
  `;
// Apply the filter list as needed in your application
  
  const snfe = await StaticNetFilteringEngine.create();
  await snfe.useLists([{ raw: blocklistText }]);
  
  return snfe;
}
