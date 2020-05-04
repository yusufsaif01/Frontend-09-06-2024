import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/core';

const routes = {
  getPositionList: () => '/master/player-specialization/position/list'
};

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {
  constructor(
    private httpClient: HttpClient,
    private credentialsService: CredentialsService
  ) {}

  getPositionList(): Observable<any> {
    let token = this.credentialsService.isAuthenticated()
      ? this.credentialsService.credentials['data']['token']
      : '';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.httpClient.get<any>(routes.getPositionList(), httpOptions);
  }
}
