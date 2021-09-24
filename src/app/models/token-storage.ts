import { Injectable } from "@angular/core";

const TOKEN_KEY = "AuthToken";
const TOKEN_EXPIRE_IN_KEY = "TokenExpireIn";
const TOKEN_REFRESH_BEFORE_EXPIRE_IN_KEY = "TokenRefreshTimeBeforeExpiration";
const TOKEN_LATEST_SAVE_ISTANT_KEY = "TokenLatestSaveIstant";

@Injectable()
export class TokenStorage {
  constructor() {}

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(
    token: string,
    expire_in: string,
    refresh_before_expire_in: string
  ) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_EXPIRE_IN_KEY);
    window.sessionStorage.removeItem(TOKEN_REFRESH_BEFORE_EXPIRE_IN_KEY);
    window.sessionStorage.removeItem(TOKEN_LATEST_SAVE_ISTANT_KEY);

    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.setItem(TOKEN_EXPIRE_IN_KEY, expire_in);
    window.sessionStorage.setItem(
      TOKEN_REFRESH_BEFORE_EXPIRE_IN_KEY,
      refresh_before_expire_in
    );
    window.sessionStorage.setItem(
      TOKEN_LATEST_SAVE_ISTANT_KEY,
      Date.now().toString()
    );
  }

  public saveRefreshedToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

    window.sessionStorage.removeItem(TOKEN_LATEST_SAVE_ISTANT_KEY);
    window.sessionStorage.setItem(
      TOKEN_LATEST_SAVE_ISTANT_KEY,
      Date.now().toString()
    );
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getSaveIstant(): string {
    return sessionStorage.getItem(TOKEN_LATEST_SAVE_ISTANT_KEY);
  }

  public getExpireIn(): string {
    return sessionStorage.getItem(TOKEN_EXPIRE_IN_KEY);
  }

  public getTokenRefreshTimeBeforeExpiration(): string {
    return sessionStorage.getItem(TOKEN_REFRESH_BEFORE_EXPIRE_IN_KEY);
  }
}
