/*
 * Angular Extended Select component.
 * Copyright (c) 2016-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

const path = require('path');

module.exports = {
    resolve: {
        modules: [
            path.join(process.cwd(), 'dist'),
            'node_modules'
        ],
        alias: {
            'angular-bootstrap4-extended-select': 'dist/fesm2015/angular-bootstrap4-extended-select.js'
        },
    }
}
