import { Inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error.component";

@Injectable()
export class ErrorService {
  constructor(@Inject(MatDialog) public dialog: MatDialog) {}
  openDialog(data): void {
    const dialogRef = this.dialog.open(ErrorComponent, {
      data: data,
      disableClose: true,
      panelClass: "error-modal",
    });
  }
}
