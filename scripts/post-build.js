module.exports = function(ctx) {
    console.log('Post Build Script Begins');
    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }
    const fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    const platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
    const apkCrosswalkFileLocation = path.join(platformRoot, 'app/build/outputs/apk/armv7/release/app-armv7-release.apk');
    //const apkReleasePath = path.join(platformRoot, 'app/build/outputs/apk/release');
    const apkReleasePath = path.join(platformRoot, 'build/outputs/apk/release');
    const apkFileLocation = path.join(apkReleasePath, '/android-release.apk');

    fs.stat(apkCrosswalkFileLocation, function(err,stats) {
        if (err) {
            console.log('Post Build  - Stat Failure');
            deferral.reject(err);
        } else {
            console.log('Size of APK is ' + stats.size +' bytes');
            fs.mkdir(apkReleasePath, { recursive: true }, (err) => {
                if (err) {
                    console.log('Post Build - Directory Create Failure');
                    deferral.reject(err);
                } else {
                    console.log(`'Post Build - ${apkReleasePath} was created`);
                    fs.copyFile(apkCrosswalkFileLocation, apkFileLocation, (err) => {
                        if (err) {
                            console.log('Post Build - Copy Failure');
                            deferral.reject(err);
                        } else {
                            console.log(`'Post Build - ${apkCrosswalkFileLocation} was copied to ${apkFileLocation}`);
                            deferral.resolve();
                        }
                    });
                }
            });
        }
    });



    console.log('Post Build  - Returning Promise');
    return deferral.promise;
};
