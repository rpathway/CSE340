const pool = require('../database');


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function checkLoginCredentials(account_email, account_password) {
  try {
    const sql = "SELECT account_email, account_password FROM public.account WHERE account_email = $1"
    const credentials = await pool.query(sql, [account_email]);
    if (credentials.rowCount === 0) return false;
    const user = credentials.rows[0];

    return user.account_email === account_password && user.account_password === account_password;
  } catch (error) {
    return false
  }
}

module.exports = {registerAccount, checkExistingEmail, checkLoginCredentials};