import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRouterModule } from './router.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouterModule,
    SharedModule
  ],
  providers: [
              {
                provide:HTTP_INTERCEPTORS,
                useClass:AuthInterceptorService,
                multi:true
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
