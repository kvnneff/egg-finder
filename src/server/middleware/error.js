module.exports = function errorMiddleware (err, req, res, next) {
  return res
    .status(404)
    .send({
      error: { message: err.message }
    })
}
