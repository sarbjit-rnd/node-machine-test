var db = require('../../models');
const uuid = require('uuid').v4;
const path = require('path')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
const helper = require("../../config/helper")
const {
    Op,
    where
} = require("sequelize")
const crypto = require('crypto');
const {
    raw
} = require('mysql');
const {
    Console
} = require('console');
const users = db.users


module.exports = {
    signup_user: async (req, res) => {
        try {
            const required = {
                name: req.body.name,
                email: req.body.email,
                country_code: req.body.country_code,
                phone: req.body.phone,
                password: req.body.password,
            }
            const non_required = {
                device_type: req.body.device_type,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: req.body.image

            }
            let requestData = await helper.vaildObject(required, non_required, res)
            let mobile = req.body.country_code.concat(req.body.phone);
            requestData.mobile = mobile

            var findEmail = await db.users.findOne({
                where: {
                    email: req.body.email
                }
            })

            var findPhoneno = await db.users.findOne({
                where: {
                    mobile: mobile
                }
            })
            if (findEmail) {
                return helper.error501(res, "This Email is All Ready Exits")
            }
            if (findPhoneno) {
                return helper.error501(res, "This mobile no is All Ready Exits")
            }

            const password = bcrypt.hashSync(req.body.password, 10);
            requestData.password = password
            // var uid = "";
            // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            // for (var i = 0; i < 13; i++)
            // uid += possible.charAt(Math.floor(Math.random() * possible.length));
            // requestData.uid = uid

            // const otp = Math.floor(1000 + Math.random() * 9000);
            // requestData.otp = otp

            if (req.files && req.files.image) {
                // image = helper.imageUpload(req.files.image, 'user');
                requestData.image = helper.imageUpload(req.files.image, 'profiles');

            }
            const signup_user = await db.users.create(requestData)




            const token = jwt.sign({
                id: signup_user.id,
                email: req.body.email,
            }, 'my_secret_key');
            await db.users.update({
                device_token: token
            }, {
                where: {
                    id: signup_user.id
                }
            })

            var findUser = await db.users.findOne({
                where: {
                    id: signup_user.id
                },
                raw: true
            })
            findUser.token = token
            return helper.success(res, "Account successfully created", findUser)
        } catch (error) {
            console.log(error);

        }
    },

    login: async (req, res) => {
        try {
            const required = {}
            const non_required = {
                country_code: req.body.country_code,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password
            }
            let requestData = await helper.vaildObject(required, non_required, res)
            // let mobile = req.body.country_code.concat(req.body.phone);
            // requestData.mobile = mobile
            if (requestData.email == undefined && requestData.mobile == undefined) {
                return helper.error501(res, "Email and password is incorrect")
            }
            if (requestData.email) {
                var userCred = req.body.email
            } else if (requestData.mobile) {
                var userCred = req.body.mobile
            }
            const userlogin = await db.users.findOne({
                where: {
                    [Op.or]: [{
                        email: userCred
                    }, {
                        mobile: userCred
                    }]
                },

                raw: true
            })
            if (!userlogin) {
                return helper.error501(res, "Email ,password and Role is incorrect")
            }

            const token = jwt.sign({
                id: userlogin.id,
                email: userlogin.email
            }, "Stack", {
                expiresIn: '30d'
            }, 'my_secret_key');

            if (userlogin == null) {
                return helper.error501(res, "Email and password is incorrect")
            } else {
                const isMatch = await bcrypt.compare(requestData.password, userlogin.password)
                if (isMatch == true) {
                    const updatessss = await db.users.update({
                        device_type: req.body.device_type,
                        device_token: token
                    }, {
                        where: {
                            id: userlogin.id,
                        }
                    })
                    const userDetail = await db.users.findOne({
                        where: {
                            id: userlogin.id,
                        },
                        raw: true
                    })
                    userDetail.token = token
                    return helper.success(res, "Logged in successfull", userDetail)
                } else {
                    return helper.error501(res, "Email and password is incorrect")
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

  

    forgotPassword: async (req, res) => {
        try {
            const findEmail = await db.users.findOne({
                where: {
                    email: req.body.email,
                }
            })
            if (findEmail) {
                const otp = Math.floor(1000 + Math.random() * 9000);
                const otpSend = await db.users.update({
                    otp: otp
                }, {
                    where: {
                        id: findEmail.id
                    }
                });

                const otpVerify = await db.users.findOne({
                    attributes: [`id`, `name`, `email`, `mobile`, `location`, `otp`, ],

                    where: {
                        id: findEmail.id
                    }
                });

                return helper.success(res, "Otp Send Successfully ", otpVerify)
            } else {
                return helper.success(res, "Email Not Exits ")
            }

        } catch (error) {
            return helper.error401(res, error)
        }
    },

  

    get_profile: async (req, res) => {
        try {
            const required = {}
            const non_required = {
            }
            let requestData = await helper.vaildObject(required, non_required, res)
        
            const get_profile = await db.users.findOne({
                attributes: [`id`, `name`, `email`, `mobile`, `country_code`, `phone`, `image`, ],

                where: {
                    id: req.user.id,
                }
            })
            return helper.success(res, "Profile Get Succesfully", get_profile)
        } catch (error) {
            return helper.error401(res, error)
        }
    },
    edit_profile: async (req, res) => {
        try {
            const required = {}
            const non_required = {
                name: (req.body.name == '' || req.body.name == undefined) ? req.user.name : req.body.name,

                email: (req.body.email == '' || req.body.email == undefined) ? req.user.email : req.body.email,
                country_code: (req.body.country_code == '' || req.body.country_code == undefined) ? req.user.country_code : req.body.country_code,
                phone: (req.body.phone == '' || req.body.phone == undefined) ? req.user.phone : req.body.phone,
                latitude: (req.body.latitude == '' || req.body.latitude == undefined) ? req.user.latitude : req.body.latitude,
                longitude: (req.body.longitude == '' || req.body.longitude == undefined) ? req.user.longitude : req.body.longitude,
                // image: (req.body.image == '' || req.body.image == undefined) ? req.user.image : req.body.image,
            }
            let requestData = await helper.vaildObject(required, non_required, res)
            let mobile = req.body.country_code.concat(req.body.phone);
            requestData.mobile = mobile

            // if (req.files && req.files.image) {
            //     // image = helper.imageUpload(req.files.image, 'user');
            //     requestData.image = helper.imageUpload(req.files.image, 'profiles');

            // }
        
            const updatessss = await db.users.update(requestData, {
                where: {
                    id: req.user.id,
                }
            })
            return helper.success(res, "Update succesfully done", {})
        } catch (error) {
            return helper.error401(res, error)
        }
    },
    
    change_password: async (req, res) => {
        try {
            const required = {
                newPassword: req.body.newPassword,
                oldPassword: req.body.oldPassword,
            }
            const changepass = await db.users.findOne({
                attributes: [`id`, `password`, `email`, ],

                where: {
                    id: req.user.id
                },
                raw: true
            })

            const hash = await bcrypt.hash(req.body.newPassword, 10)
            console.log(hash)
            const compare = await bcrypt.compare(req.body.oldPassword, changepass.password)
            if (!compare) {
                return helper.error401(res, "Old password does not match")
            }
            else {
                console.log("success");
                await db.users.update({
                    password: hash,
                }, {
                    where: {
                        id: req.user.id
                    }
                })
                return helper.success(res, "Password changed successfully", changepass)

            }
        } catch (error) {
            return helper.error401(res, error)
        }
    },
 
    logout: async (req, res) => {
        try {
            const required = {
                //  security_key: req.headers.security_key,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);
            // const authorization = req.headers.authorization.replace("Bearer", "").trim();

            const update_token = await db.users.update({
                device_token: '',
                otp: 0
            }, {
                where: {
                    id: req.user.id
                }
            });
            const token = jwt.sign({
                    id: req.user.id,
                    email: req.user.email
                },
                '');
                console.log(token)
                return
            return helper.success(res, 'User logged out successfully.', {});
        } catch (error) {
            return helper.error501(res, error);
        }
    },


   




}