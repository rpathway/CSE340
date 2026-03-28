const utilities = require('.');
const { body, validationResult } = require('express-validator')
const validate = {};



/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* **********************************
 *  Check classification data
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Model is required."),

    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .isLength({ min: 4, max: 4 })
      .withMessage("A valid 4 digit year is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("A description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .isDecimal()
      .isFloat({ min: 0 })
      .withMessage("A valid price is required."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("classification_id")
      .notEmpty()
      .isInt()
      .withMessage("A classification must be selected."),
  ]
}

/* **********************************
 *  Check inventory data — return errors to add-inventory view
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id,
    })
    return

  }
  next()
}

module.exports = validate