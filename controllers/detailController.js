const modelDetails = require('../models/detail-model')
const utilities = require('../utilities')

const modelCont = {};

modelCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await modelDetails.getItemByInventoryId(inv_id);
  const details = await utilities.buildItemDetails(data);
  let nav = await utilities.getNav()
  const className = `${data[0].inv_year} ${data[0].inv_make}`;
  res.render('./inventory/details', {
    title: className,
    nav,
    details,
    inv_id: data[0].inv_id
  })
}

module.exports = modelCont;