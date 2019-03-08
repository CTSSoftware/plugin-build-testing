#!/usr/bin/env node

// Save hook under `project-root/hooks/before_prepare/`
//
// Don't forget to install xml2js using npm
// `$ npm install xml2js`

var fs = require('fs');
var xml2js = require('xml2js');

console.log('-------------------------- Start Build number stuff --------------------------');

// Read config.xml
fs.readFile('config.xml', 'utf8', function(err, data) {
    if(err) {
        return console.log(err);
    }

    // Get XML
    var xml = data;

    // Parse XML to JS Obj
    xml2js.parseString(xml, function (err, result) {
        if(err) {
            return console.log(err);
        }

        // Get JS Obj
        var obj = result;

        //
        // currentVersion = result.widget.$.version;
        // splitVersion = currentVersion.split('.');
        //
        // // ensure that version has a patch version
        // while (splitVersion.length < 3) {
        //   splitVersion.push(0);
        // }
        //
        // // increment patch version
        // patchVersion = Number(splitVersion[2]) + 1;
        // splitVersion[2] = patchVersion.toString();
        //
        //
        // newVersion = splitVersion.join('.');


        var versionParts = (function() {
            var now = new Date();
            var utcNow = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
            var startOfYear = new Date(utcNow.getFullYear(), 0, 0);
            var dayOfYear = Math.floor((utcNow - startOfYear) / (/*oneDay*/1000 * 60 * 60 * 24));
            var minutesOfDay = (utcNow.getHours()*60 + utcNow.getMinutes());
            return [ ('' + utcNow.getFullYear()).substring(2), ('' + dayOfYear), ('' + minutesOfDay) ];
        })();

        var versionString = versionParts.join('.');
        var androidVersionString = versionParts[0] + versionParts[1].padStart(3, '0') + versionParts[2].padStart(4, '0');

        result.widget.$.version = versionString;
        result.widget.$['android-versionCode'] = androidVersionString;

        // Build XML from JS Obj
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(obj);

        // Write config.xml
        fs.writeFile('config.xml', xml, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log('Build number successfully updated - (' + versionString + ' / ' +  androidVersionString + ')');
        });

    });
});
