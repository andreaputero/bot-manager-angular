import { Component, HostListener, Inject, OnInit } from "@angular/core";

// ANGULAR
import { ActivatedRoute, Router } from "@angular/router";

// CUSTOM

import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { TokenStorage } from "src/app/models/token-storage";
import { AuthService } from "src/app/services/auth/auth.service";
import { environment } from "src/enviroment/enviroment.prod";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  mail: string;
  password: string;
  loggedUser: User;
  loggedIn: boolean = false;
  private API_URL: string = environment.API_BASE_URL + environment.APP_CONTEXT;

  constructor(
    @Inject(Router) private router: Router,
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserService) private userService: UserService,
    @Inject(TokenStorage) private token: TokenStorage,
    @Inject(HttpClient) public http: HttpClient,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {}

  login(): void {
    this.token.signOut();
    this.authService.attemptAuth(this.mail, this.password).subscribe((data) => {
      this.token.saveToken(
        data.access_token,
        data.expires_in,
        data.refresh_time_before_expire_in
      );
      this.authService.getUserInfo().subscribe((user) => {
        console.log("SUBSCRIPTED");
        this.userService.setLoggedUser(user);
        console.log(user);
        this.loggedIn = true;
        this.router.navigate(["home"]);
      });
    });

    console.log(Date.now());
  }

  @HostListener("document:keypress", ["$event"])
  onSomeAction(event) {
    //console.log("Push key n°", event.keyCode);
    if (event.keyCode === 13) {
      this.login();
    }
  }
  open_signup() {
    this.router.navigate(["signup"]);
  }
}
