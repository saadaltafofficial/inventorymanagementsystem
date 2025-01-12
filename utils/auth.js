function loggerMiddleware(req, res, next){
    console.log(`${req.method} request recived to endpoint ${req.originalUrl}.`)
    next()
}

module.exports = {
    loggerMiddleware
}