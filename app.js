const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const ErrorHandler = require("./src/middleware/ErrorHandler")
const app = express();
const authRouter = require('./src/route/AuthRoutes');
const applyPassportStrategy = require('./src/store/passport')
const passport = require('passport');
const prisma = require('./prisma/dbConnection');
const  authenticatea  = require('./src/middleware/Authenticate');
const indexRoute = require('./src/route/IndexRoute')
const multer = require('multer')
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 5000
applyPassportStrategy(passport)
app.use(express.urlencoded({ extended: false}))
app.use(express.json()); //for handling json data

//start imgae upload
//important
//https://codevoweb.com/node-postgresql-upload-resize-multiple-images/
//important
//https://www.tutsmake.com/file-upload-in-mongodb-using-node-js/
//https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088

  //set storage 
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./upload')
    },

    filename: function (req, file, cb) {
      cb(null, file.originalname) + '-' + Date.now()
    }
  })

  const upload = multer({ storage: storage})
  app.post('/api/pup', upload.single('myImage'), (req, res, next) => {
    const{productName} = req.body
    const imgPath = req.file.path
    var encode_img = imgPath.toString('base64');
    var final_img = {
        contentType:req.file.mimetype,
        image: Buffer.from(encode_img, 'base64')
    };

    //insert image
    console.log("final_img", req.file.originalname)
    console.log("productName", productName)
    try {
      
      const result = prisma.products.create({
        data: {
          productName: productName,
           productImage: final_img.image
        }
      })
      res.send({ success: true, "message": "insert", result})
    } catch (error) {
      next(error)
    }

    // console.log(imgPath)

  })


//end image upload

require('./src/config/passport')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())
// require('./src/store/passport')
require('./src/middleware/Jwt')(passport)


app.get('/hel',authenticatea,
  async(req, res) => {
    const newUser = await prisma.user.findMany();
    res.json({ success: true, "message": "show successfully", newUser})
  }
);

const categoryRoute = require('./src/route/CategoryRoues')
const productRouter = require('./src/route/ProductRoutes')
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRoute)
app.use('/api/product', productRouter)


app.use(ErrorHandler)
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});

