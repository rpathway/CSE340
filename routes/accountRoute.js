// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
)
// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;