const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util