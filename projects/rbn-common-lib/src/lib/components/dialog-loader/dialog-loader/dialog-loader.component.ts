import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScreenReaderService } from '../../../services/screen-reader.service';
@Component({
  selector: 'rbn-dialog-loader',
  templateUrl: './dialog-loader.component.html',
  styleUrls: ['./dialog-loader.component.scss']
})
export class DialogLoaderComponent implements OnChanges {
  @Input() loading = false;

  translateResults: any = {};

  constructor(
    private translate: TranslateService,
    private screenReader: ScreenReaderService
  ) {
    this.translate.get('LOADER').subscribe(result => {
      this.translateResults = result;
    });
  };

  ngOnChanges() {
    if (this.loading) {
      setTimeout(() => {
        if (!this.screenReader.isAnnouncedLoading) {
          this.screenReader.customizedAnnouce(this.translateResults.LOADING);
          this.screenReader.isAnnouncedLoading = true;
        }
      }, 100);
    }
    if (!this.loading) {
      // prevent announce stop loading if loading after tha timmediately
      setTimeout(() => {
        if (!this.hasSpinnerOnUI() && this.screenReader.isAnnouncedLoading) {
          this.screenReader.customizedAnnouce(this.translateResults.STOP_LOADING);
          this.screenReader.isAnnouncedLoading = false;
        }
      }, 100);
    }
  }

  hasSpinnerOnUI() {
    return !!document.querySelector('.spinner');
  };
}
