// netlify/functions/delta-proxy.js
// Generic proxy to Delta Exchange's public v2 API so the browser never has to
// call api.india.delta.exchange directly (avoids CORS).
//
// Deploy: put this file at  netlify/functions/delta-proxy.js  in your site repo
// (same repo where strategy-builder.html is hosted), then redeploy on Netlify.
// The page calls it as: /.netlify/functions/delta-proxy?_path=tickers&contract_types=...
// or: /.netlify/functions/delta-proxy?_path=history/candles&symbol=BTCUSD&resolution=15m&start=...&end=...

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery || '');
  const path = params.get('_path') || 'tickers';
  params.delete('_path');
  const url = `https://api.india.delta.exchange/v2/${path}?${params.toString()}`;

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
