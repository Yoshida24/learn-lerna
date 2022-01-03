'use strict';

module.exports = cli;
const lemonSour = require("lemon-sour");

function cli() {
    console.log('executed by cli')
    lemonSour()
}

(function () {
    console.log('--------')
    cli();
    console.log('--------')
})();