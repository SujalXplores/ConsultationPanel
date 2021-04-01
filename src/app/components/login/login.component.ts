import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private unsubscribe = new Subject();
  is_exist: any;
  is_disabled: boolean = false;
  loginForm: FormGroup;
  hide: boolean = true;
  constructor(
    private titleService: Title,
    private _router: Router,
    private toast: HotToastService,
    private _http: HttpClient
  ) {
    this.titleService.setTitle("Login");
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      u_email_id: new FormControl("sujal@gmail.com", [Validators.required, Validators.email]),
      u_password: new FormControl("Sc@4234", [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onLogin() {
    const email = this.loginForm.get('u_email_id').value;
    const password = this.loginForm.get('u_password').value;
    this._http.get('http://localhost:3000/admin?password=' + password + '&email=' + email).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      if (res[0] && res[0] != undefined) {
        this._router.navigate(['/nav/consultee']);
        this.toast.show("Welcome Aboard", {
          theme: 'snackbar',
          id: 'welcome',
          icon: '😄',
          position: 'bottom-center'
        });
        localStorage.setItem('id', this.loginForm.get('u_email_id').value);
      } else {
        this.toast.warning('Please check your Email/Password !', {
          id: 'wrong',
          position: 'bottom-center',
          theme: 'snackbar'
        });
      }
    }, (error: { name: string; }) => {
      if (error.name == "HttpErrorResponse") {
        this.toast.error("Can't connect to server.", {
          id: 'error',
          position: 'bottom-center',
          theme: 'snackbar'
        });
      }
    });
  }
}
