import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: SocialUser;
  private unsubscribe = new Subject();
  is_exist: any;
  is_disabled: boolean = false;
  constructor(
    private titleService: Title,
    private _router: Router,
    private toast: HotToastService,
    private auth: SocialAuthService
  ) {
    this.titleService.setTitle("Login");
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onGoogleSignIn(): void {
    this.is_disabled = true;
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => {
      this.auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((user) => {
        if (user != null) {
          localStorage.setItem('id', user.authToken);
          this._router.navigate(['/nav/dashboard']);
          this.toast.show("Welcome Aboard " + user.firstName, {
            theme: 'snackbar',
            id: 'welcome',
            icon: '😄',
            position: 'bottom-center'
          });
        }
      });
    }, () => {
      this.is_disabled = false;
      this.toast.warning("Can't connect to Google !", {
        id: 'closed',
        theme: 'snackbar',
        position: 'bottom-center'
      });
    });
  }
}
