// Needed Resources
const express = require('express')
const router = new express.Router()
const wishlistController = require('../controllers/wishlistController')
const wishlistValidate = require('../utilities/wishlist-validation')
const utilities = require('../utilities')



// View wishlist
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.buildWishlist)
)

// Add to wishlist
router.post(
  "/add",
  utilities.checkLogin,
  wishlistValidate.wishlistRules(),
  wishlistValidate.checkWishlistData,
  utilities.handleErrors(wishlistController.addItem)
)

// Remove from wishlist
router.post(
  "/remove",
  utilities.checkLogin,
  wishlistValidate.wishlistRules(),
  wishlistValidate.checkWishlistData,
  utilities.handleErrors(wishlistController.removeItem)
)

module.exports = router