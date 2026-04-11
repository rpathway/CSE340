const wishlistModel = require('../models/wishlist-model')
const utilities = require('../utilities/')

const wishlistCont = {}


/* ***************************
 *  Build wishlist view
 * ************************** */
wishlistCont.buildWishlist = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const result = await wishlistModel.getWishlistByAccountId(account_id)
  let nav = await utilities.getNav()

  if (typeof result === 'string') {
    req.flash('notice', 'Sorry, there was a problem loading your wishlist.')
    return res.redirect('/account/')
  }

  res.render('account/wishlist', {
    title: 'My Wishlist',
    nav,
    errors: null,
    wishlist: result.rows,
  })
}

/* ***************************
 *  Add item to wishlist
 * ************************** */
wishlistCont.addItem = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  const result = await wishlistModel.addToWishlist(account_id, inv_id)

  if (result.duplicate) {
    req.flash('notice', 'This vehicle is already in your wishlist.')
  } else if (result.rowCount) {
    req.flash('notice', 'Vehicle added to your wishlist.')
  } else {
    req.flash('notice', 'Sorry, there was a problem adding the vehicle.')
  }

  return res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 *  Remove item from wishlist
 * ************************** */
wishlistCont.removeItem = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  const result = await wishlistModel.removeFromWishlist(account_id, inv_id)

  if (result.rowCount) {
    req.flash('notice', 'Vehicle removed from your wishlist.')
  } else {
    req.flash('notice', 'Sorry, there was a problem removing the vehicle.')
  }

  return res.redirect('/account/wishlist')
}

module.exports = wishlistCont