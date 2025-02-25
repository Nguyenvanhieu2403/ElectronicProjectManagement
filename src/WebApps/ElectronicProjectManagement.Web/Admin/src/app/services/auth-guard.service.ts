import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'vnpost-shared';

@Injectable()
export class AuthGuardService {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  canActivate() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
