
const path = require('path')
var uuid = require('uuid').v4;
const sequelize = require('sequelize')
const bcrypt = require('bcrypt');
const fs = require('fs');
const db = require('../models');
module.exports = {


    bcryptHash: (myPlaintextPassword, saltRounds = 10) => {
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(myPlaintextPassword, salt);
        hash = hash.replace('$2b$', '$2y$');
        return hash;
    },
    vaildObject: async function (required, non_required, res) {
        let message = '';
        let empty = [];
        let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';


        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) {
                message += " fields are required"
            } else {
                message += " field is required"
            }
            res.status(400).json({
                'success': false,
                'message': message,
                'code': 400,
                'body': {}
            });
            return;
        } else {
            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != "") {
                    message = "Invalid security key";
                    res.status(403).json({
                        'success': false,
                        'message': message,
                        'code': 403,
                        'body': []
                    });
                    res.end();
                    return false;
                }
            }
            if (required.hasOwnProperty('password')) {
                function validate(password) {
                    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[A-Za-z0-9]{6,}$/.test(password);
                }


            }


            const marge_object = Object.assign(required, non_required);
            delete marge_object.checkexit;

            for (let data in marge_object) {
                if (marge_object[data] == undefined) {
                    delete marge_object[data];
                } else {
                    if (typeof marge_object[data] == 'string') {
                        marge_object[data] = marge_object[data].trim();
                    }
                }
            }

            return marge_object;
        }
    },

    imageUpload: (file, folder = 'users') => {

        let image = file;

        var extension = path.extname(image.name);
        var fileimage = uuid() + extension;
        image.mv(process.cwd() + '/public/images/' + folder + '/' + fileimage, function (err) {
            if (err)
                console.log(err);
        });
        const filename = `/images/${folder}/` + fileimage
        if(extension != '.jpeg' && extension != '.jpg' && extension != '.png' ){
             var data = {};
             data.extensions = extension;
             data.filenames = filename
            return data;
        }else{
            return filename;
        }
    },

    success: function (res, message, body = {}) {
        return res.status(200).json({
            'success': 1,
            'code': 200,
            'message': message,
            'body': body
        });
    },
   
  
    error401: function (res, err, body = {}) {

        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        let code = 401;
        res.status(code).json({
            'success': 0,
            'code': code,
            'message': message,
            'body': body
        });
    },
    error501: function (res, err, body = {}) {
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        let code = 501;
        res.status(code).json({
            'success': 0,
            'code': code,
            'message': message,
            'body': body
        });

    },




}