const errorCont = {}

errorCont.triggerErr = async function (req, res, next) {
  throw new Error('Intentional 500 Error triggered.');
}

module.exports = errorCont;