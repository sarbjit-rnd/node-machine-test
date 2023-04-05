var express = require('express');
var router = express.Router();
const middleware = require('.././middleware/Auth')
var api = require("../controllers/api/apiController")

router.post("/signup_user", api.signup_user)    
router.post("/login", api.login)
router.post("/forgotPassword", api.forgotPassword)

router.use(middleware.Auth)

//user auth route
// router.get("/user_list", api.user_list)
router.post("/edit_profile", api.edit_profile)
router.get("/get_profile", api.get_profile)
router.put("/change_password", api.change_password)



router.post("/logout", api.logout)



module.exports = router;
