// netlify/functions/delta-proxy.js
// Proxies requests to Delta Exchange's public tickers API so the browser
// never has to call api.india.delta.exchange directly (avoids CORS).
//
// Deploy: put this file at  netlify/functions/delta-proxy.js  in your site repo
// (same repo where strategy-builder.html is hosted), then redeploy on Netlify.
// The page calls it as: /.netlify/functions/delta-proxy?contract_types=...&underlying_asset_symbols=...

exports.handler = async (event) => {
  const qs = event.rawQuery || '';
  const url = `https://api.india.delta.exchange/v2/tickers?${qs}`;

  try {
    const resp = await fetch(url, { headers: { Accept: 'application/json' } });
    const body = await resp.text();
    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
