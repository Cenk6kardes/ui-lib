import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';


/**
 * @description
 *
 * A service to dynamically set the page title based on router config
 *
 * @usageNotes
 * * In each of the router path add `title` property to `data`
 * ### Example
 * ```
 *    {
 *       path: 'templates', component: ReportTemplatesComponent,
 *       data: { title: 'Report Templates' },
 *    },
 * ```
 * * In the bootstrap component of the application
 * ```
 *  import { TitleService } from 'rbn-common-lib';
 * ```
 * * then in constructor, call the init
 * ```
 *  constructor(
 *    private titleService: TitleService
 *  ) {
 *    this.titleService.init('PM - Ribbon EMS');
 *  }
 * ```
 * * When this route is activated, title will be set automatically
 *
 * * Set title will remain even if route is deactivated, must use title in all route config
 *
 *  @publicApi
 */
@Injectable({
  providedIn: 'root'
})
export class TitleService {
  defaultTitle = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title
  ) { }

  init(defaultTitle: string) {
    this.defaultTitle = defaultTitle || '';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child.firstChild) {
          child = child.firstChild;
        }
        if (child.snapshot.data.title) {
          return child.snapshot.data.title + ' - ' + this.defaultTitle;
        }
        return this.defaultTitle;
      })
    ).subscribe((currentTitle) => this.title.setTitle(currentTitle));
  }
}
