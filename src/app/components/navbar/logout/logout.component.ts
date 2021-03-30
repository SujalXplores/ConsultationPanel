import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  delete: any;
  constructor(
    private dialogRef: MatDialogRef<LogoutComponent>,
    private _router: Router,
    private _auth: SocialAuthService,
    private _toast: HotToastService
  ) { }

  onConfirmExit(): void {
    this.dialogRef.close(true);
    this._auth.signOut().then(()=>{
      this._toast.show("Come back soon.", {
        icon: '👋',
        id: 'logout',
        position: 'bottom-center',
        theme: 'snackbar'
      });
    }).catch(()=>{
      this._toast.show("Come back soon.", {
        icon: '👋',
        id: 'logout',
        position: 'bottom-center',
        theme: 'snackbar'
      });
    });
    localStorage.clear();
    this._router.navigate(['']);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
