import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CredentialsService } from './credentials.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { untilDestroyed } from '@app/core';

const routes = {
  login: (c: LoginContext) => `/login`,
  logout: () => `/logout`,
  register: (c: RegisterContext) => '/register',
  resetPassword: (c: ResetPasswordContext) => '/reset-password',
  changePasssword: (c: ChangePasswordContext) => '/change-password',
  forgotPassword: (c: ForgotPasswordContext) => '/forgot-password',
  createPassword: (c: ResetPasswordContext) => '/create-password',
  emailVerification: () =>
    'http://yftchain.local/registration/in/activateemail',
  resetLinkStatus: () => '/link/status',
  accessTokenRequest: (c: AccessTokenRequestContext) => '/access-token/request',
  accessTokenVerification: (c: AccessTokenVerificationContext) =>
    '/access-token/verify'
};

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}
export interface RegisterContext {
  email: string;
  phone: string;
  country: string;
  state: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  member_type?: string;
}
export interface ForgotPasswordContext {
  email: string;
}

export interface ResetPasswordContext {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordContext {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AccessTokenRequestContext {
  email: string;
}

export interface AccessTokenVerificationContext {
  email: string;
  otp: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  register(context: RegisterContext): Observable<any> {
    return this.httpClient.post(routes.register(context), context);
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    // Replace by proper authentication call
    return this.httpClient.post(routes.login(context), context);
    // .pipe(
    //   map((body: any) => body.value),
    //   catchError(err => throwError(new Error(err.message)))
    // );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(status?: string): Observable<boolean> {
    // Customize credentials invalidation here
    let credentials: any = {};
    if (localStorage.getItem('credentials')) {
      credentials = JSON.parse(localStorage.getItem('credentials'));
    } else {
      credentials = JSON.parse(sessionStorage.getItem('credentials'));
    }
    if (this.credentialsService.isAuthenticated()) {
      this.httpClient
        .post(routes.logout(), credentials.data.token)
        .subscribe(data => {});
    }
    this.credentialsService.setCredentials();
    if (status === 'unauthorized') {
      this.router.navigate(['/login'], {
        queryParams: { redirect: this.router.routerState.snapshot.url },
        replaceUrl: true
      });
    } else {
      this.router.navigate(['/login']);
    }

    return of(true);
  }

  resetPassword(context: ResetPasswordContext, token: string): Observable<any> {
    const userId = localStorage.getItem('userId');

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.post(
      routes.resetPassword(context),
      context,
      httpOptions
    );
  }

  createPassword(
    context: ResetPasswordContext,
    token: string
  ): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.post(
      routes.createPassword(context),
      context,
      httpOptions
    );
  }

  changePassword(context: ChangePasswordContext): Observable<any> {
    return this.httpClient.post(routes.changePasssword(context), context);
  }

  forgotPassword(context: ForgotPasswordContext): Observable<any> {
    return this.httpClient.post(routes.forgotPassword(context), context);
  }

  emailVerification(token: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };

    return this.httpClient.put<any>(
      routes.emailVerification(),
      token,
      httpOptions
    );
  }

  resetLinkStatus(token: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };

    return this.httpClient.get(routes.resetLinkStatus(), httpOptions);
  }

  accessTokenRequest(context: AccessTokenRequestContext): Observable<any> {
    return this.httpClient.post(routes.accessTokenRequest(context), context);
  }

  accessTokenVerification(
    context: AccessTokenVerificationContext
  ): Observable<any> {
    return this.httpClient.post(
      routes.accessTokenVerification(context),
      context
    );
  }
  ngOnDestroy() {}
}
