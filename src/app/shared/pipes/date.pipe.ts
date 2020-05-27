import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {
  transform(date: any): any {
    let created_at: any = new Date(date);
    let dateNow: any = new Date(Date.now());
    let diff = (dateNow - created_at.getTime()) / 1000;
    let second = Math.abs(Math.round(diff));
    diff = diff / 60;
    let minutes = Math.abs(Math.round(diff));
    diff = diff / 60;
    let hours = Math.abs(Math.round(diff));
    if (second < 60) {
      created_at = second + ' sec';
    }
    if (second >= 60 && minutes < 60) {
      created_at = minutes + ' min';
    }
    if (minutes >= 60 && hours < 24) {
      created_at = hours + ' hours';
    }
    if (hours >= 24) {
      created_at = created_at.toDateString();
    }
    return created_at;
  }
}
