import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./core/auth/login/login.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TokenStorage } from "./models/token-storage";
import { AuthService } from "./services/auth/auth.service";
import { UserService } from "./services/user/user.service";
import {
  ErrorInterceptor,
  JwtInterceptor,
} from "./services/interceptor/interceptor.service";
import { SignupComponent } from "./core/auth/signup/signup.component";
import { ErrorComponent } from "./core/modals/error/error.component";
import { SessionErrorComponent } from "./core/modals/session-error/session-error.component";
import { ErrorService } from "./core/modals/error/error.service";
import { SessionErrorService } from "./core/modals/session-error/session-error.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
  ],
  providers: [
    HttpClientModule,
    MatDialog,
    AuthService,
    UserService,
    TokenStorage,
    HttpClient,
    ErrorService,
    SessionErrorService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    SessionErrorComponent,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, SessionErrorComponent],
})
export class AppModule {}
