import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private datePipe: DatePipe
  ) { }

  /**
   * Create a ID from Title/Label by removing a whitespace
   * @author dsaini
   *
   * @param $title - title for ID
   */
  getId(idString: string) {
    return idString.replace(/[^a-zA-Z0-9_]/g, '');
  }

  /**
  * The download the file from Analytics
  * @author dsaini
  * @param url - Url : where file is located
  */
  fileDownload(url) {
    localStorage.setItem('_download', url);
    window.location.assign(url);
  }

  /**
   * Convert the epoc into Date
   * @author dsaini
   *
   * @param epoc - date integer value
   * @param format - date format. ex: 'yyyy/MM/dd HH:mm:ss'
   */
  epocToDate(epoc, format) {
    if (epoc) {
      switch (String(epoc).length) {
        // If the time is in epoch seconds, then convert it to milliseconds
        case 10:
          epoc = epoc * 1000;
          break;
        // If the time is in epoch microseconds, then convert it to milliseconds
        case 16:
          epoc = epoc / 1000;
          epoc = parseInt(epoc, 10);
          break;
        // If the dateinput is milliseconds and of string type
        case 13:
          epoc = parseInt(epoc, 10);
          break;
      }
      const date = new Date(epoc);
      return this.datePipe.transform(date, format);
    }
  }
}
