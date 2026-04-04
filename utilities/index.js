require("dotenv").config()

const jwt = require("jsonwebtoken")
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    let name = row.classification_name;
    let id = row.classification_id;
    list += `<li><a href="/inv/type/${id}" title="See our inventory of ${name} vehicles">${name}</a></li>`;
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      let id = vehicle.inv_id
      let make = vehicle.inv_make
      let model = vehicle.inv_model
      grid += `
        <li>
          <a href="../../inv/detail/${id}" title="View ${make} ${model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${make} ${model} on CSE Motors">
          </a>
          <div class="namePrice">
            <hr>
            <h2>
              <a href="../../inv/detail/${id}" title="View ${make} ${model} details">
                ${make} ${model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>
      `;
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the model view HTML
* ************************************ */
Util.buildItemDetails = async function (data) {
  let page
  if(data.length > 0) {
    const model = data[0];
    let name = model.inv_make;
    let year = model.inv_year;
    let desc = model.inv_description;
    let image = model.inv_image;
    let price = model.inv_price;
    let color = model.inv_color
    let miles = model.inv_miles;
    page = `
      <div class="modelDetails">
        <figure>
          <img src="${image}" alt="Image of ${name} ${model.inv_model} on CSE Motors">
          <figcaption>Image of ${name} ${model.inv_model} on CSE Motors</figcaption>
        </figure>
        <ul class="modelDetailSpecs">
          <h2>${name} Details</h2>
          <li><h3>Price:</h3> <span>$${new Intl.NumberFormat('en-US').format(price)}</span></li>
          <li><h3>Description:</h3> <span>${desc}</span></li>
          <li><h3>Color:</h3> <span>${color}</span></li>
          <li><h3>Mileage:</h3> <span>${new Intl.NumberFormat('en-US').format(miles)}</span></li>
          <li><h3>Year:</h3> <span>${year}</span></li>
        </ul>
      </div>
    `
  } else {
    page = '<p class="notice">Sorry, the selected vehicle could not be found.</p>'
  }

  return page;
}

/* **************************************
* Build classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util