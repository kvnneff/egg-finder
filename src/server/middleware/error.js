module.exports = function errorMiddleware (err, req, res, next) {
  console.log(err)
  return res
    .status(404)
    .send({
      error: { message: err.message }
    })
}
