import { Inject, Injectable } from "@angular/core";

// CUSTOM IMPORT
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/enviroment/enviroment.prod";
import { TokenStorage } from "src/app/models/token-storage";
import { User } from "src/app/models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private API_URL: string = environment.API_BASE_URL + environment.APP_CONTEXT;

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    @Inject(TokenStorage) private tokenStorage: TokenStorage
  ) {}

  attemptAuth(username: string, password: string): Observable<any> {
    const credentials = {
      email: username,
      password: password,
      rememberMe: true,
    };

    console.log("Password: " + credentials.password);

    return this.http.post<any>(this.API_URL + "auth/jwtlogin", credentials);
  }

  getUserInfo() {
    console.log("CALLED URL:", this.API_URL + "auth/get-logged-user-info");
    console.log(
      "OBJ Passed:",
      this.http.get<User>(this.API_URL + "auth/get-logged-user-info")
    );
    return this.http.get<User>(this.API_URL + "auth/get-logged-user-info");
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post<{ token: string }>(this.API_URL + "auth/refresh", {
      token: token,
    });
  }

  signOut() {
    this.tokenStorage.signOut();
  }
}
