import { Inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SessionErrorComponent } from "./session-error.component";

@Injectable()
export class SessionErrorService {
  constructor(@Inject(MatDialog) public dialog: MatDialog) {}

  openDialog(data): void {
    const dialogRef = this.dialog.open(SessionErrorComponent, {
      data: data.error,
      disableClose: true,
      panelClass: "error-modal",
      width: "500px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      window.location.replace("");
    });
  }
}
