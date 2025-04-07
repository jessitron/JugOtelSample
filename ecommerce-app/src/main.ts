console.log(`env vars ${import.meta.env.NG_APP_OTLP_ENDPOINT} ${import.meta.env.NG_APP_CHAT_ENDPOINT} ${import.meta.env.NG_APP_COMMERCE_ENDPOINT}`)
import './instrumentation';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log(`env vars ${import.meta.env.NG_APP_COMMERCE_ENDPOINT}`)
console.log(`env vars ${import.meta.env.NG_APP_CHAT_ENDPOINT}`)
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
