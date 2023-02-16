import jwt from 'jsonwebtoken'

export default async function Auth (req, res, next) {    
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).send({
        message: "auth failed",
        Status: false,
      });
    }
    const [, token] = authHeader.split(" ");
    jwt.verify(
      token,
      process.env.SECRET_TOKEN,
      (err, decoded) => {
        if (err) {                    
          return res.send({
            message: "auth failed",
            Status: false,
          });
        } else {
          const { id } = decoded ;
          req.body.userId = id;
          next();
        }
      }
      
    );
  } catch (error) {
    return res.status(401).send({
      message: "auth failed",
      success: false,
    });
  }
};