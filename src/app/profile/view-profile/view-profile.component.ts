import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, untilDestroyed } from '@app/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { PanelOptions } from '@app/shared/models/panel-options.model';
import { MatTableDataSource } from '@angular/material/table';
import { ContractListTableConfig } from './../edit-profile/contract-listing-table-conf';
import { EditProfileService } from '../edit-profile/edit-profile.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  public tableConfig: ContractListTableConfig = new ContractListTableConfig();
  public dataSource = new MatTableDataSource([]);

  environment = environment;
  profile: any;
  numbers: any;
  aadhar_url: string;
  aadhar_number: string;
  aadhar_front_url: string;
  aadhar_back_url: string;
  player_photo_url: string;
  // employment_contract_url: string;
  document_url: string;
  document_type: string;
  panelOptions: Partial<PanelOptions> = {
    player_type: false,
    logout_link: true,
    achievements: true,
    footplayers: true,
    is_public: false
  };
  docNumber: string;
  isPublic: boolean = false;
  userId: string;

  constructor(
    private _authenticationService: AuthenticationService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _editProfileService: EditProfileService
  ) {
    this._activatedRoute.params.subscribe(params => {
      if (params['handle']) {
        this.panelOptions.is_public = true;
        this.isPublic = true;
        this.userId = params['handle'];
      }
    });
  }
  ngOnDestroy() {}

  ngOnInit() {
    this.numbers = [1, 2, 3, 4, 5];
    this.getProfile({});
    this.getEmploymentContractList();
  }

  logout() {
    this._authenticationService.logout();
  }

  getProfile(data: object) {
    this.profile = data;
    if (!this.isPublic && this.profile) this.setDocuments();
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getEmploymentContractList() {
    this._editProfileService
      .getEmploymentContractList()
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          let records = response.data.records;
          this.dataSource = new MatTableDataSource(records);
        },
        error => {
          this._toastrService.error(error.error.message, 'Error');
        }
      );
  }

  setDocuments() {
    if (this.profile.documents && this.profile.documents.length !== 0) {
      this.profile.documents.forEach((element: any) => {
        let fileLink: any = this.environment.mediaUrl;
        let rootMedia: any = element.media;

        if (element.type === 'aadhar') {
          this.aadhar_number = element.document_number;
          if (element.media.attachment_type === 'pdf') {
            this.aadhar_url = fileLink + rootMedia.document;
          } else if (element.media.attachment_type === 'image') {
            this.aadhar_front_url = fileLink + rootMedia.doc_front;
            this.aadhar_back_url = fileLink + rootMedia.doc_back;
          }
          this.player_photo_url = fileLink + rootMedia.user_photo;
        }
        // if (element.type === 'employment_contract') {
        //   this.employment_contract_url = fileLink + rootMedia.document;
        // }
        if (
          element.type !== 'employment_contract' &&
          element.type !== 'aadhar'
        ) {
          this.document_url = fileLink + rootMedia.document;
          this.docNumber = element.document_number;
          this.document_type = element.type;
        }
      });
    }
  }
}
