const { kisGet } = require('./_kis');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { index } = req.query; // '0001'=KOSPI, '1001'=KOSDAQ

  try {
    const data = await kisGet(
      `/uapi/domestic-stock/v1/quotations/inquire-index-price?fid_cond_mrkt_div_code=U&fid_input_iscd=${index}`,
      'FHPUP02100000'
    );
    const o = data.output;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      value: parseFloat(o.bstp_nmix_prpr || '0'),
      change: parseFloat(o.bstp_nmix_prdy_vrss || '0'),
      changePercent: parseFloat(o.bstp_nmix_prdy_ctrt || '0'),
      isUp: o.prdy_vrss_sign === '2',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
