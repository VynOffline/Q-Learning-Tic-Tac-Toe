/*
* @Author: Vyn
* @Date:   2018-12-27 15:28:26
* @Last Modified by:   Vyn
* @Last Modified time: 2018-12-27 15:34:01
*/

const util = require('util')

var debug = false;

module.exports.EnableDebug = function(value)
{
	debug = value;
}

module.exports.PrintDebug = function(text)
{
	if (debug)
		console.log(text);
}

module.exports.InspectDebug = function(object)
{
	if (debug)
		console.log(util.inspect(object, false, null, true /* enable colors */));
}