import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageAcademyTableConfig } from './manage-academy-table-conf';
import { FilterDialogAcademyComponent } from '../filter-dialog-academy/filter-dialog-academy.component';
import { AdminService } from '../admin.service';
import { DeleteConfirmationComponent } from '@app/shared/dialog-box/delete-confirmation/delete-confirmation.component';
import { StatusConfirmationComponent } from '@app/shared/dialog-box/status-confirmation/status-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from '@app/core';

interface FilterDialogContext {
  from: string;
  to: string;
  name: string;
  email: string;
  email_verified: string;
  profile_status: string;
}
@Component({
  selector: 'app-manage-academy',
  templateUrl: './manage-academy.component.html',
  styleUrls: ['./manage-academy.component.scss']
})
export class ManageAcademyComponent implements OnInit, OnDestroy {
  public sideBarToggle: boolean = true;
  showFiller = false;
  list: any;
  pageSize: number = 20;
  totalRecords = 10;
  selectedPage: number;
  acad_count: number;
  show_count: number;
  tzoffset = new Date().getTimezoneOffset() * 60000;
  dialogData: any = {};
  filterValues: any = {};
  searchText: string;

  public tableConfig: ManageAcademyTableConfig = new ManageAcademyTableConfig();
  public dataSource = new MatTableDataSource([]);

  constructor(
    public dialog: MatDialog,
    public adminService: AdminService,
    public toastrService: ToastrService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.filterValues = {};
    this.getAcademyList(this.pageSize, 1);
    this.refreshDialogData();
  }

  updateSidebar($event: any) {
    this.sideBarToggle = $event;
  }

  refreshDialogData() {
    this.dialogData = {
      from: '',
      to: '',
      email: '',
      name: '',
      email_verified: '',
      profile_status: ''
    };
  }

  updatePage(event: any) {
    this.filterValues.page_no = event.selectedPage;
    this.getAcademyList(this.pageSize, event.selectedPage);
  }

  getAcademyList(page_size: number, page_no: number) {
    this.adminService
      .getAcademyList({
        ...{
          page_no: page_no,
          page_size: page_size,
          search: this.searchText
        },
        ...this.filterValues
      })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.data.records);
        this.acad_count = response.data.total;
        this.show_count = response.data.records.length;
        this.selectedPage = page_no;
      });
  }

  recordsPerPage(event: any) {
    this.pageSize = event.target.value;
    this.filterValues.page_size = event.target.value;
    this.filterValues.page_no = 1;
    this.getAcademyList(this.pageSize, 1);
  }

  sampleModel() {
    const dialogRef = this.dialog.open(FilterDialogAcademyComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: this.dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogData = result;

        if (result['from']) {
          result['from'] = new Date(result['from']);
          result['from'] = new Date(
            result['from'] - this.tzoffset
          ).toISOString();
        }
        if (result['to']) {
          result['to'] = new Date(result['to']);
          result['to'] = new Date(result['to']).setHours(23, 59, 59);
          result['to'] = new Date(result['to'] - this.tzoffset).toISOString();
        }
        result.page_size = this.pageSize;
        result.page_no = 1;
        this.filterValues = result;
        this.adminService
          .getAcademyList(result)
          .pipe(untilDestroyed(this))
          .subscribe(response => {
            this.acad_count = response.data.total;
            this.show_count = response.data.records.length;
            this.dataSource = new MatTableDataSource(response.data.records);
            this.selectedPage = 1;
          });
      } else {
        this.filterValues = {};
      }
    });
  }

  deletePopup(user_id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: {
        header: 'Delete academy'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.adminService
          .deleteUser({ user_id: user_id })
          .pipe(untilDestroyed(this))
          .subscribe(
            response => {
              this.toastrService.success(
                `Success`,
                'User deleted successfully'
              );
            },
            error => {
              // log.debug(`Login error: ${error}`);
              this.toastrService.error(`${error.error.message}`, 'Delete User');
            }
          );
      }
    });
  }

  statusPopup(user_id: string, status: string) {
    if (status === 'pending') {
      return;
    }
    const dialogRef = this.dialog.open(StatusConfirmationComponent, {
      width: '50% ',
      panelClass: 'filterDialog',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // deactive user not implemented
      if (result === true) {
        if (status === 'active') {
          this.adminService
            .deactivateUser({ user_id: user_id })
            .pipe(untilDestroyed(this))
            .subscribe(
              response => {
                this.toastrService.success(
                  `Success`,
                  'Status updated successfully'
                );
                this.getAcademyList(this.pageSize, 1);
              },
              error => {
                // log.debug(`Login error: ${error}`);
                this.toastrService.error(
                  `${error.error.message}`,
                  'Status update'
                );
              }
            );
        } else if (status === 'blocked') {
          this.adminService
            .activeUser({ user_id: user_id })
            .pipe(untilDestroyed(this))
            .subscribe(
              response => {
                this.toastrService.success(
                  `Success`,
                  'Status updated successfully'
                );
                this.getAcademyList(this.pageSize, 1);
              },
              error => {
                // log.debug(`Login error: ${error}`);
                this.toastrService.error(
                  `${error.error.message}`,
                  'Status update'
                );
              }
            );
        }
      }
    });
  }

  getSearchText(value: string) {
    this.searchText = value;
    this.getAcademyList(this.pageSize, 1);
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
