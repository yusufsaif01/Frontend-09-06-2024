import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageAbilityTableConfig } from './manage-ability-table.conf';
import { AddpopupComponent } from './addpopup/addpopup.component';
@Component({
  selector: 'app-manage-ability',
  templateUrl: './manage-ability.component.html',
  styleUrls: ['./manage-ability.component.scss']
})
export class ManageAbilityComponent implements OnInit {
  // table config
  public tableConfig: ManageAbilityTableConfig = new ManageAbilityTableConfig();
  public dataSource = new MatTableDataSource([]);

  // sidebar
  public sideBarToggle: boolean = true;
  updateSidebar($event: any) {
    this.sideBarToggle = $event;
  }
  // Add Popup
  constructor(public dialog: MatDialog) {}
  openDialog(): void {
    const dialogRef = this.dialog.open(AddpopupComponent, {
      width: '40%'
    });
  }

  ngOnInit() {}
}
