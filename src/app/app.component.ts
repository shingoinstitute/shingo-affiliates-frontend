/* tslint:disable */
// Angular Modules
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MdIconRegistry, MdSidenav, MdDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd, RouteConfigLoadEnd, NavigationStart, RouteConfigLoadStart, RoutesRecognized } from '@angular/router';

// App Modules
import { AuthService } from './services/auth/auth.service';
import { WorkshopService } from './services/workshop/workshop.service';
import { SidenavService } from './services/sidenav/sidenav.service';
import { RouterService } from './services/router/router.service';
import { MaterialsDialog } from './interface/materials/materials-dialog/materials-dialog.component';

// RxJS Modules
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

// RxJS operators
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  private windowWidthChangeSource = new Subject<number>();
  private windowWidthChange = this.windowWidthChangeSource.asObservable();
  private isLoading: boolean = true;

  isAuthenticated: boolean = false;

  activeRoute: string;
  routeToLoginSubscription: Subscription;

  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private router: Router, private auth: AuthService, private ws: WorkshopService, public sidenavService: SidenavService, public routerService: RouterService, private dialog: MdDialog) {
    iconRegistry.addSvgIcon('search_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_search_grey_18px.svg'));
    iconRegistry.addSvgIcon('edit_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_edit_grey_18px.svg'));
    iconRegistry.addSvgIcon('edit_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_edit_white_18px.svg'));
    iconRegistry.addSvgIcon('expand_less', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_expand_less_black_18px.svg'));
    iconRegistry.addSvgIcon('expand_more', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_expand_more_black_18px.svg'));
    iconRegistry.addSvgIcon('folder_special_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_folder_special_white_18px.svg'));
    iconRegistry.addSvgIcon('cancel_red', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_cancel_red_18px.svg'));
    iconRegistry.addSvgIcon('cancel_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_cancel_grey_18px.svg'));
    iconRegistry.addSvgIcon('cancel_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_cancel_white_18px.svg'));
    iconRegistry.addSvgIcon('checkmark_green', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_check_circle_green_18px.svg'));
    iconRegistry.addSvgIcon('save_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_save_white_18px.svg'));
    iconRegistry.addSvgIcon('save_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_save_grey_18px.svg'));
    iconRegistry.addSvgIcon('x_red', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_x_red_18px.svg'));
    iconRegistry.addSvgIcon('account_box_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_account_box_white_24px.svg'));
    iconRegistry.addSvgIcon('support_black', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_help_black_24px.svg'));
    iconRegistry.addSvgIcon('logout_black', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_exit_to_app_black_24px.svg'));
    iconRegistry.addSvgIcon('person_black', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_person_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('label_outline', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_label_outline_black_24px.svg'));
    iconRegistry.addSvgIcon('edit_mode_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_mode_edit_grey_24px.svg'));
    iconRegistry.addSvgIcon('block_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_block_grey_24px.svg'));
    iconRegistry.addSvgIcon('delete_forever_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_delete_forever_grey_24px.svg'));
    iconRegistry.addSvgIcon('delete_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_delete_grey_24px.svg'));
    iconRegistry.addSvgIcon('renew_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_autorenew_grey_18px.svg'));
    iconRegistry.addSvgIcon('file_upload', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_file_upload_black_18px.svg'));
    iconRegistry.addSvgIcon('description_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_description_grey_24px.svg'));
    iconRegistry.addSvgIcon('description_white', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_description_white_24px.svg'));
    iconRegistry.addSvgIcon('refresh_grey', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_refresh_grey_18px.svg'));
    iconRegistry.addSvgIcon('folder', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_folder_grey_18px.svg'));
    iconRegistry.addSvgIcon('link', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_link_grey_18px.svg'));
    iconRegistry.addSvgIcon('insert_drive_file', sanitizer.bypassSecurityTrustResourceUrl('assets/imgs/icons/ic_insert_drive_file_grey_18px.svg'));

    this.routeToLoginSubscription = this.router.events.subscribe((route) => {
      // Subscribe to router event stream 
      if (route instanceof NavigationEnd) {
        // On `NavigationEnd`, capture current route so we can re-redirect the user (if they aren't authenticated)
        // to the route they originally intended to visit, *after* a successful log in.
        this.activeRoute = route.url;

        // Now that the route has been captured, check to see if the user is authenticated, and redirect them to `/login` if they aren't
        if (!this.activeRoute.match(/.*password.*/gi)) {
          this.authenticateOnLoad();
        }
      }
    });

    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) this.isLoading = true;
      else if (route instanceof NavigationEnd) this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    this.sidenavService.sidenav = this.sidenav;
    this.winResizeHandler();
    this.windowWidthChangeSource.next(window.innerWidth);
  }

  ngOnDestroy() {
    this.routeToLoginSubscription && this.routeToLoginSubscription.unsubscribe();
  }

  /**
   * @description authenticateOnLoad starts listening to an event stream
   * then calls a function on authService that emits an event to the event stream.
   * The event stream subscription continues listening to changes that may be
   * emitted by other parts of the app.
   */
  authenticateOnLoad() {
    // Subscribe to event stream of authentication change events
    this.auth.authenticationChange$
      .distinctUntilChanged()
      .subscribe(isValid => {
        this.isAuthenticated = isValid;
        if (!this.isAuthenticated) {
          this.routerService.navigateRoutes(['/login', this.activeRoute]);
        }
      }, error => {
        this.isAuthenticated = false;
        this.routerService.navigateRoutes(['/login', this.activeRoute]);
      });

    // Check to see if the current user is authenticated, firing an event that is captured by the above subscription.
    this.auth.userIsValid();
  }

  /**
   * Handles logging out... yeah.
   */
  logoutHandler() {
    this.auth.logout().subscribe(() => {
      this.auth.authenticationChange$.next(false);
    }, err => {
      console.error(err);
      this.auth.authenticationChange$.next(false);
    });
  }

  /**
   * Creates a subscription that listens to events emitted by `this.onResize()`
   * and opens or closes the sidenav depending on the screen size. Also closes
   * the sidenav if the user is not logged in.
   */
  winResizeHandler() {
    this.windowWidthChange
      .debounceTime(100)
      .subscribe((width: number) => {
        if (!this.sidenavService.sidenav) {
          return setTimeout(() => {
            this.sidenavService.sidenav = this.sidenav;
            this.windowWidthChangeSource.next(width);
          });
        } else if (width < 960 && this.sidenavService.canToggle) {
          this.sidenavService.close();
        } else if (this.sidenavService.canToggle) {
          this.sidenavService.open();
        }
      });
  }

  /**
   * Emits an event whenever the window is resized.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidthChangeSource.next(event.target.innerWidth);
  }

  openMaterials(folder: string) {
    const folders = { workshops: false, marketing: false, forms: false };
    folders[folder] = true;
    this.dialog.open(MaterialsDialog, { width: '80%', height: '100%', data: folders })
  }
}
