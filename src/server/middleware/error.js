module.exports = function errorMiddleware (err, req, res, next) {
  req.session.message = { type: 'error', text: err.message }
  if (err.type === 'StatusError') {
    console.log(req.url)
    return res.redirect(req.url)
  }

  if (err.type === 'DatabaseError') {
    return res.status(500)
      .send({
        error: {
          message: 'There was a problem on our end.  Please try again later.'
        }
      })
  }

  return res.send({
    error: { message: err.message }
  })
}
