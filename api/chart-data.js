const { kisGet } = require('./_kis');

function fmt(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padLeft(2, '0')}${String(d.getDate()).padLeft(2, '0')}`;
}
// padLeft polyfill
String.prototype.padLeft = function(n, c) { return this.padStart(n, c); };

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { symbol } = req.query;

  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 45);

  try {
    const data = await kisGet(
      `/uapi/domestic-stock/v1/quotations/inquire-daily-price`
      + `?fid_cond_mrkt_div_code=J`
      + `&fid_input_iscd=${symbol}`
      + `&fid_period_div_code=D`
      + `&fid_org_adj_prc=0`
      + `&fid_input_date_1=${fmt(from)}`
      + `&fid_input_date_2=${fmt(today)}`,
      'FHKST01010400'
    );
    const list = (data.output2 || [])
      .map(e => parseFloat(e.stck_clpr || '0'))
      .filter(v => v > 0)
      .reverse();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ data: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
