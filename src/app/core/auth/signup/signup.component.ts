import { HttpClient } from "@angular/common/http";
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { TokenStorage } from "src/app/models/token-storage";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  mail: string;
  password: string;
  password_confirm: string;
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

  signup() {}

  @HostListener("document:keypress", ["$event"])
  onSomeAction(event) {
    //console.log("Push key n°", event.keyCode);
    if (event.keyCode === 13) {
      this.signup();
    }
  }
  open_login() {
    this.router.navigate(["login"]);
  }
}
