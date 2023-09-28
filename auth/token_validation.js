const { verify } = require("jsonwebtoken");

module.exports = {
    checkTokenAdmin: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
          token = token.slice(7);
          verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
              res.status(401).json({
                success: 0,
                message: "Invalid token",
              });
            } else {
              // Check the user's role
              const userRole = decoded.role;
              if (userRole === "admin") {
                next();
              } else {
                res.status(403).json({
                  success: 0,
                  message: "Permission denied",
                });
              }
            }
          });
        } else {
          res.status(401).json({
            success: 0,
            message: "Unauthorized user",
          });
        }
      },

  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
          console.error(err);
          return res.status(401).json({
            success: 0,
            message: "Invalid token",
          });
        } else {
          console.log("Decoded JWT payload:", decoded);
          if (decoded && decoded.userId) {
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({
              success: 0,
              message: "Invalid token payload",
            });
          }
        }
      });
    } else {
      res.status(401).json({
        success: 0,
        message: "Unauthorized user",
      });
    }
  }
  
}