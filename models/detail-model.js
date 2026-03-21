const pool = require('../database');

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getItemByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [inv_id]
    )

    return data.rows;
  } catch (error) {
    console.error(`getItemByInventoryId error ${error}`);
  }  
}

module.exports = {getItemByInventoryId}