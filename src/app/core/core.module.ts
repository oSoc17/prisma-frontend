import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationInterceptor} from './interceptors/authentication.interceptor';
import {CommonHeadersInterceptor} from './interceptors/common-headers.interceptor';
import {UnauthorizedErrorInterceptor} from './interceptors/unauthorized-error.interceptor';

const IMPORTS = [
  HttpClientModule,
  HttpModule
];
const DECLARATIONS = [
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonHeadersInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedErrorInterceptor,
      multi: true,
    }
  ],
  exports: [
    ...IMPORTS
  ]
})
export class CoreModule {
}