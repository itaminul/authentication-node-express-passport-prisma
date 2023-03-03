const prisma = require('../../prisma/dbConnection')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');
const {
generateHashedPassword,
generateServerErrorCode,
registerValidation,
loginValidation
} = require('../store/utils')

const {
SOME_THING_WENT_WRONG,
USER_EXISTS_ALREADY,
WRONG_PASSWORD,
USER_DOES_NOT_EXIST
} = require('../store/constant')
// const { config } = require('../store/config')
// const { user } = require('../../prisma/dbConnection')

function createUser(email, password) {
    const data = {
        email,
        hashedPassword: generateHashedPassword(password)
    }
    return new user(data)
}
const expiresInCount = "120s";
exports.register = async(req, res, next) => {
    try {
        // console.log("req ",req)
      
        const errorsAfterValidation = validationResult(req);
        const {userName, email, password, roles } = req.body;
        console.log("errorsAfterValidation". errorsAfterValidation)
        if (!errorsAfterValidation.isEmpty()) {
          res.status(400).json({
            code: 400,
            errors: errorsAfterValidation.mapped(),
          });
        } else {     

            try {
                const {userName, email, password, orgId, roles } = req.body;
                 //Encrypt user password
                encryptedPassword = await bcrypt.hash(password, 10);
                const user = await prisma.user.findFirst({ where: {email:email} });
                if (!user) {
                    const result = await prisma.user.create({
                        data: {
                            userName,
                            email,
                            password:encryptedPassword,
                            roles,
                            orgId
                        }
                    })
                  // Sign token
                  const newUser = await prisma.user.findFirst({ where: {email:email} });
                 
                  const token = jwt.sign(
                    { email: email },
                     process.env.SC_TOKEN, 
                     {
                    expiresIn: expiresInCount,
                  });

                  
                //   console.log("token", token)
                //   const userToReturn = { ...newUser.toJSON(), ...{ token } };
                //   delete userToReturn.hashedPassword;
                  res.json({ success: true, "message": "show successfully", token: 'bearer ' + token})
                //   res.status(200).json(userToReturn);
                } else {
                  generateServerErrorCode(res, 403, 'register email error', USER_EXISTS_ALREADY, 'email');
                }
              } catch (e) {
                generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG);
              }
         
    }
        
    } catch (error) {
        next(error)
        
    }   


}

exports.login = async(req, res, next) => {
    const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    res.status(400).json({
      code: 400,
      errors: errorsAfterValidation.mapped(),
    });
  } else {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where:{ email: email} });
    //   console.log("user user", user.email)
      if (user && user.email) {
        // console.log("user user", user.email)
        const isPasswordMatched = await bcrypt.compare(password,user.password);
       
        if (isPasswordMatched) {
          // Sign token
          const token = jwt.sign(
            { email: email },
            process.env.SC_TOKEN,         
          {
            expiresIn: expiresInCount,
          });
        //   console.log("isPasswordMatched user", token)
        //   const userToReturn = { ...user.toJSON(), ...{ token } };
          res.json({ success: true, "message": "show successfully", token})
        //   delete userToReturn.hashedPassword;
        //   res.status(200).json(userToReturn);
        } else {
          generateServerErrorCode(res, 403, 'login password error', WRONG_PASSWORD, 'password');
        }
      } else {
        generateServerErrorCode(res, 404, 'login email error', USER_DOES_NOT_EXIST, 'email');
      }
    } catch (e) {
       next(e)
    //   generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG);
    }
  }


}
