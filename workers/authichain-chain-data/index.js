/**
 * authichain-chain-data — v2.1 (Apr 9 2026)
 * Migrated from deprecated PolygonScan v1 → Etherscan API v2
 * Uses: https://api.etherscan.io/v2/api?chainid=137
 */

const ETHERSCAN_V2 = 'https://api.etherscan.io/v2/api';
const POLYGON_CHAIN = 137;

const QRON_CONTRACT  = '0xAebfA6b08fb25b59748c93273aB8880e20FfE437';
const NFT_CONTRACT   = '0x4da4D2675e52374639C9c954f4f653887A9972BE';

async function esV2(apiKey, module, action, extra = '') {
  const url = `${ETHERSCAN_V2}?chainid=${POLYGON_CHAIN}&module=${module}&action=${action}&apikey=${apiKey}${extra}`;
  const r = await fetch(url);
  return r.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const apiKey = env.ETHERSCAN_KEY_QRON;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    try {
      if (path === '/token-supply') {
        const d = await esV2(apiKey, 'stats', 'tokensupply', `&contractaddress=${QRON_CONTRACT}`);
        return Response.json({ supply: d.result, raw: d }, { headers });
      }

      if (path === '/nft-supply') {
        const d = await esV2(env.ETHERSCAN_KEY_AUTHICHAIN, 'stats', 'tokensupply', `&contractaddress=${NFT_CONTRACT}`);
        return Response.json({ minted: d.result, raw: d }, { headers });
      }

      if (path === '/token-transfers') {
        const address = url.searchParams.get('address') || QRON_CONTRACT;
        const d = await esV2(apiKey, 'account', 'tokentx', `&contractaddress=${QRON_CONTRACT}&address=${address}&sort=desc&page=1&offset=25`);
        return Response.json({ transfers: d.result?.slice(0, 25), count: d.result?.length }, { headers });
      }

      if (path === '/gas') {
        const d = await esV2(apiKey, 'gastracker', 'gasoracle', '');
        return Response.json(d.result, { headers });
      }

      if (path === '/health') {
        const d = await esV2(apiKey, 'stats', 'tokensupply', `&contractaddress=${QRON_CONTRACT}`);
        return Response.json({
          status: d.status === '1' ? 'ok' : 'degraded',
          api: 'etherscan-v2',
          chainid: POLYGON_CHAIN,
          qron_supply: d.result,
          ts: new Date().toISOString()
        }, { headers });
      }

      return Response.json({ error: 'Unknown route', paths: ['/health','/token-supply','/nft-supply','/token-transfers','/gas'] }, { status: 404, headers });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500, headers });
    }
  }
};
