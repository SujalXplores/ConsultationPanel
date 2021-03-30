import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import IdleTimer from "./IdleTimer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FrontEndTest';
  timer: any;
  constructor(private _router: Router, private authService: SocialAuthService) {}
  ngOnInit() {
    this.timer = new IdleTimer({
      timeout: 600,
      onTimeout: () => {
        localStorage.clear();
        this._router.navigate(['']);
        this.authService.signOut();
      }
    });
  }

  ngOnDestroy() {
    this.timer.clear();
  }
}
