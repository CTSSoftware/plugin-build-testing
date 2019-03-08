import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// keytool -genkey -v -keystore plugin-testing.keystore -alias plugin-testing -keyalg RSA -keysize 2048 -validity 10000
// cordova plugin add cordova-plugin-ionic --save --variable APP_ID="2f648503" --variable CHANNEL_NAME="Master" /
//                                         --variable UPDATE_METHOD="background" 
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
