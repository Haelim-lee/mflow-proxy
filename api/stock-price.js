const { kisGet, corsHeaders } = require('./_kis');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  try {
    const data = await kisGet(
      `/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${symbol}`,
      'FHKST01010100'
    );
    const o = data.output;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      price: parseFloat(o.stck_prpr || '0'),
      change: parseFloat(o.prdy_vrss || '0'),
      changePercent: parseFloat(o.prdy_ctrt || '0'),
      volume: parseFloat(o.acml_vol || '0'),
      isUp: o.prdy_vrss_sign === '2',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
