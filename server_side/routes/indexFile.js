'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};

fs
    .readdirSync(`${__dirname}/group_model`)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        db[file] = file;
    });

module.exports = db;