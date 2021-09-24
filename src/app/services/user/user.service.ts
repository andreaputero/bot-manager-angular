import { Inject, Injectable } from "@angular/core";

// ANGULAR IMPORT
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ReplaySubject, BehaviorSubject } from "rxjs";

// CUSTOM

import { AuthService } from "../auth/auth.service";
import { environment } from "src/enviroment/enviroment.prod";
import { User } from "src/app/models/user";

@Injectable()
export class UserService {
  private userSubject: BehaviorSubject<User>;
  private hasUser = false;
  private API_URL: string = environment.API_BASE_URL + environment.APP_CONTEXT;
  // private loggedUser: User;

  constructor(@Inject(HttpClient) private http: HttpClient) {}

  // public getLoggedUserInfo(): Observable<User> {
  //   if (!this.hasUser) {
  //     //this.fetchUser();
  //     this.userSubject = new BehaviorSubject<User>(this.loggedUser);
  //     this.hasUser = true;
  //   }
  //   return this.userSubject.asObservable();
  // }

  public fetchUser(): void {
    this.hasUser = true;
    this.http.get<User>(this.API_URL + "auth/getLoggedUserInfo").subscribe(
      (user) => {
        this.userSubject.next(user);
        this.userSubject.complete();
      },
      (error) => {
        this.hasUser = false;
        this.userSubject.error(error);
      }
    );
  }

  public setLoggedUser(user: User) {
    //this.loggedUser = user;
    localStorage.setItem("loggedUser", JSON.stringify(user));
    //this.hasUser = true;
  }

  // public getLoggedUser() {
  //   return this.loggedUser;
  // }
  public getLoggedUser(): User {
    return JSON.parse(localStorage.getItem("loggedUser"));
  }
  public logout() {
    this.hasUser = false;
    //this.loggedUser = undefined;
    localStorage.clear();
  }
}
