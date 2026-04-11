const pool = require('../database/')


/* ***************************
 *  Add vehicle to wishlist
 * ************************** */
async function addToWishlist(account_id, inv_id) {
  try {
    const sql = `INSERT INTO public.wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *`
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    if (error.code === '23505') {
      return { duplicate: true }
    }
    return error.message
  }
}

/* ***************************
 *  Remove vehicle from wishlist
 * ************************** */
async function removeFromWishlist(account_id, inv_id) {
  try {
    const sql = `DELETE FROM public.wishlist WHERE account_id = $1 AND inv_id = $2 RETURNING *`
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all wishlist items for an account
 * ************************** */
async function getWishlistByAccountId(account_id) {
  try {
    const sql = `
      SELECT w.wishlist_id, i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail, i.inv_color FROM public.wishlist AS w
        JOIN public.inventory AS i ON w.inv_id = i.inv_id
        WHERE w.account_id = $1
        ORDER BY w.wishlist_id DESC`
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }
}

module.exports = { addToWishlist, removeFromWishlist, getWishlistByAccountId }