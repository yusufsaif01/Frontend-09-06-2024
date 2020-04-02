import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: any;
  numbers: any;
  constructor(
    private _authenticationService: AuthenticationService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.populateView();
    this.numbers = [1, 2, 3, 4, 5];
  }

  populateView() {
    this._authenticationService.getProfileDetails().subscribe(
      response => {
        console.log('data', response);
        this.profile = response.data;
        this._toastrService.success(
          'Successful',
          'Data retrieved successfully'
        );
      },
      error => {
        console.log('error', error);
        this._toastrService.error(
          `${error.error.message}`,
          'Failed to load data'
        );
      }
    );
  }
}