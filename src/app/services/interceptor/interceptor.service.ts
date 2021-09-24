import { Inject, Injectable } from "@angular/core";

// ANGULAR
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse,
  HttpEvent,
} from "@angular/common/http";
import { Router } from "@angular/router";

// LIBRARY
import { Observable, throwError } from "rxjs";
import { retry, catchError, timestamp } from "rxjs/operators";
import { TokenStorage } from "src/app/models/token-storage";
import { environment } from "src/enviroment/enviroment.prod";
import { AuthService } from "../auth/auth.service";
import { SessionErrorService } from "src/app/core/modals/session-error/session-error.service";
import { ErrorService } from "src/app/core/modals/error/error.service";

const TOKEN_HEADER_KEY = "Authorization";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private errorMessage: any;
  private API_URL: string = environment.API_BASE_URL + environment.APP_CONTEXT;
  private Auth_type: string = environment.Auth_type;
  private unauthorized = false;

  private blackList = [
    {
      url: this.API_URL + "store/uploadFile",
    },
    {
      url: this.API_URL + "store/downloadFile",
    },
  ];

  checkBlacklist(blackList: Array<any>, req: HttpRequest<any>): boolean {
    let found: boolean;
    for (let i = 0; i < blackList.length && !found; i++) {
      //console.log("Value i: " + i + " - " + blackList[i].url);
      //console.log("Req:" + req.url);
      if (req.url == this.blackList[i].url) {
        found = true;
        console.log("FOUND IN BLACKLIST");
      } else found = false;
    }
    return found;
  }

  constructor(
    @Inject(TokenStorage) private token: TokenStorage,
    @Inject(Router) private router: Router,
    @Inject(AuthService) private authService: AuthService
  ) {
    console.log("JWT INTERCEPTOR: Sono nel costruttore di jwt intercepror");
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    console.log("JWT INTERCEPTOR: Sono nell'interceptor di jwt interceptor");
    const idToken = this.token.getToken();

    console.log(
      "Tempo rimanente: " +
        (Number(this.token.getExpireIn()) * 1000 +
          Number(this.token.getSaveIstant()) -
          Date.now())
    );

    if (
      idToken &&
      Number(this.token.getExpireIn()) * 1000 +
        Number(this.token.getSaveIstant()) -
        Date.now() >
        0 &&
      Number(this.token.getExpireIn()) * 1000 +
        Number(this.token.getSaveIstant()) -
        Date.now() <
        Number(this.token.getTokenRefreshTimeBeforeExpiration()) * 1000 &&
      req.url != this.API_URL + "auth/refresh" &&
      req.url != this.API_URL + "auth/jwtlogin"
    ) {
      console.log("Token Expired - Refresh");
      this.authService.refreshToken(idToken).subscribe((data) => {
        this.token.saveRefreshedToken(data.access_token);
      });
    }

    if (idToken) {
      if (this.checkBlacklist(this.blackList, req)) {
        req = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + idToken),
        });
      } else {
        req = req.clone({
          headers: req.headers
            .set("Authorization", "Bearer " + idToken)
            .set("Content-Type", "application/json"),
        });
      }
    } else {
      req = req;
    }

    return next.handle(req);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorMessage: any;
  private unauthorized = false;
  constructor(
    @Inject(TokenStorage) private token: TokenStorage,
    @Inject(Router) private router: Router,
    @Inject(ErrorService) public errorDialogService: ErrorService,
    @Inject(SessionErrorService)
    public errorDialogSessionService: SessionErrorService
  ) {
    console.log("ERROR INTERCEPTOR: Sono nel costruttore di error intercepror");
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(
      "ERROR INTERCEPTOR: Sono nell'interceptor di error interceptor"
    );
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("trovato errore");
        //let errorMessage = {};

        if (
          error.error.error != undefined &&
          error.error.message != undefined
        ) {
          this.errorMessage = {
            title: error.name,
            status: error.status,
            message: error.message,
            call: error.url,
            detail: {
              description: error.error.error,
              message: error.error.message,
              timestamp: error.error.timestamp,
            },
            // reason:
            //   "Reason: " +
            //   error.error.message +
            //   " Details: " +
            //   error.error.error,
            // status: error.status
          };
        } else {
          this.errorMessage = {
            reason: "Reason: " + error.message + " Details: " + error.error,
            status: error.status,
          };
        }

        //if (!this.unauthorized) {
        if (this.token.getToken() && this.errorMessage.status == "401") {
          this.token.signOut();
          this.errorMessage = {
            reason: "Unauthorized",
            detail: "The token is expired.",
            status: "401",
          };
          // this.errorMessage.reason = "Unauthorized";
          // this.errorMessage.status = "401";
          this.errorDialogSessionService.openDialog({
            error: this.errorMessage,
          });
          if (error.error.error == "Unauthorized" && !this.unauthorized) {
            this.unauthorized = true;
          }
          return throwError(this.errorMessage);
        } else {
          this.errorDialogService.openDialog(this.errorMessage);
          if (error.error.error == "Unauthorized" && !this.unauthorized) {
            this.unauthorized = true;
            this.router.navigate(["login"]);
          }
          return throwError(this.errorMessage);
        }
        //   } else {
        //   console.log("URL :", this.router.url);
        // if (this.router.url != "login") {
        //   this.router.navigate(["login"]);
        // }
        //  return throwError("erroorr");
        //  }
      })
    );
  }
}
