const { body, validationResult } = require('express-validator')
const validate = {}

/* **********************************
 *  Wishlist item validation rules
 * ******************************** */
validate.wishlistRules = () => {
  return [
    body('inv_id')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('A valid vehicle must be selected.'),
  ]
}

/* **********************************
 *  Check wishlist data
 * ******************************** */
validate.checkWishlistData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('notice', errors.array()[0].msg)
    return res.redirect('back')
  }
  next()
}

module.exports = validate
