import {
  Component,
  ViewChild,
  OnDestroy,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core'
import {
  MatSidenav,
  MatIconRegistry,
  MatDialog,
  DateAdapter,
} from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { ObservableMedia } from '@angular/flex-layout'
import { Subscription, Observable } from 'rxjs'
import { Store, select } from '@ngrx/store'
import * as fromRoot from '../../../reducers'
import * as fromAuth from '../../../auth/reducers'
import * as fromUser from '../../../user/reducers'
import { AuthActions } from '../../../auth/actions'
import { LocaleService } from '../../../shared/services/locale/locale.service'
import { AuthService } from '../../../auth/services/auth.service'
import { UserRenew } from '../../../user/actions/user-api.actions'
import { map } from 'rxjs/operators'
import { getProperty } from '../../../util/functional'
import { User } from '../../../user/services/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  public supportCategories: string[] = []
  // public supportCategoryPages: { [key: string]: SupportPage[] } = {}

  @ViewChild('sidenav')
  public sidenav!: MatSidenav

  public isLoading = false
  public activeRoute = '/'
  public loggedIn$: Observable<boolean>
  public isAdmin$: Observable<boolean>
  public user$: Observable<User | null>
  private loggedInSub: Subscription | undefined
  // public routeToLoginSubscription: Subscription

  constructor(
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public router: Router,
    // public auth: AuthService,
    // public ws: WorkshopService,
    // public routerService: RouterService,
    // public supportService: SupportService,
    public dialog: MatDialog,
    public media: ObservableMedia,
    public localeService: LocaleService,
    @Inject(LOCALE_ID) public locale: string,
    private dateAdapter: DateAdapter<any>,
    private store: Store<fromRoot.State>,
    private auth: AuthService,
  ) {
    this.initIconRegistry()
    this.loggedIn$ = this.store.pipe(select(fromAuth.getLoggedIn))
    this.isAdmin$ = this.store.pipe(select(fromUser.isAdmin))
    this.user$ = this.store.pipe(select(fromUser.getUser))

    this.localeService.languageChange$.subscribe(lang => {
      this.dateAdapter.setLocale(lang)
    })
  }

  ngOnInit() {
    this.loggedInSub = this.loggedIn$.subscribe(v => {
      // have valid jwt token, but no user
      if (this.auth.authenticated && !v) {
        this.store.dispatch(new UserRenew())
      }
    })
  }

  public ngOnDestroy() {
    if (this.loggedInSub) {
      this.loggedInSub.unsubscribe()
    }
  }

  /**
   * @description authenticateOnLoad starts listening to an event stream
   * then calls a function on authService that emits an event to the event stream.
   * The event stream subscription continues listening to changes that may be
   * emitted by other parts of the app.
   */
  // public authenticateOnLoad() {
  // Subscribe to event stream of authentication change events
  // this.auth.authenticationChange$.pipe(distinctUntilChanged()).subscribe(
  //   isValid => {
  //     this.isAuthenticated = isValid
  //     if (!this.isAuthenticated && this.activeRoute !== '/login') {
  //       this.routerService.navigateRoutes(['/login', this.activeRoute])
  //     }
  //   },
  //   error => {
  //     this.isAuthenticated = false
  //     this.routerService.navigateRoutes(['/login', this.activeRoute])
  //   },
  // )

  // Check to see if the current user is authenticated, firing an event that is captured by the above subscription.
  // this.auth.updateUserAuthStatus()
  // }

  /**
   * Handles logging out... yeah.
   */
  public logoutHandler() {
    this.store.dispatch(new AuthActions.Logout())
    // this.auth.logout().subscribe(
    //   state => {
    //     if (state === UserState.LoggedInAs) {
    //       this.routerService.navigateRoutes(['/admin/facilitators'])
    //     }
    //   },
    //   err => {
    //     console.error(err)
    //     this.auth.authenticationChange$.next(false)
    //   },
    // )
  }

  public openMaterials(folder: 'workshops' | 'forms' | 'marketing') {
    // const folders = { workshops: false, marketing: false, forms: false }
    // folders[folder] = true
    // this.dialog.open(MaterialsDialog, {
    //   width: '80%',
    //   data: folders,
    // })
  }

  public initIconRegistry() {
    this.iconRegistry.addSvgIcon(
      'search_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_search_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'edit_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_edit_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'edit_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_edit_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'expand_less',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_expand_less_black_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'expand_more',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_expand_more_black_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'folder_special_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_folder_special_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'cancel_red',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_cancel_red_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'cancel_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_cancel_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'cancel_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_cancel_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'checkmark_green',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_check_circle_green_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'save_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_save_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'save_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_save_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'x_red',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_x_red_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'account_circle_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_account_circle_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'support_black',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_help_black_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'label_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_label_outline_black_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'edit_mode_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_mode_edit_grey_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'edit_mode_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_mode_edit_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'block_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_block_grey_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'block_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_block_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'delete_forever_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_delete_forever_grey_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'delete_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_delete_grey_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'delete_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_delete_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'renew_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_autorenew_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'renew_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_autorenew_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'file_upload',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_file_upload_black_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'description_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_description_grey_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'description_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_description_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'refresh_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_refresh_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'refresh_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_refresh_white_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'folder',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_folder_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'link',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_link_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'insert_drive_file',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_insert_drive_file_grey_18px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'supervisor_account_white',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_supervisor_account_white_24px.svg',
      ),
    )
    this.iconRegistry.addSvgIcon(
      'supervisor_account_grey',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/imgs/icons/ic_supervisor_account_grey_18px.svg',
      ),
    )
  }

  public getSupportCategories() {
    // this.supportService.getCategories().subscribe(categories => {
    //   this.supportCategories = []
    //   this.supportCategoryPages = {}
    //   for (const c of categories) {
    //     this.getSupportCategoryPages(c)
    //   }
    // })
  }

  public getSupportCategoryPages(category: string) {
    // this.supportService.getCategory(category).subscribe(
    //   pages => {
    //     if (pages.length) {
    //       this.supportCategories.push(category)
    //       this.supportCategoryPages[category] = pages
    //     }
    //   },
    //   err => console.error(err),
    // )
  }

  public isLoggedInAs(): boolean {
    return false
    // return !!(this.auth.user && this.auth.user.state === UserState.LoggedInAs)
  }

  public get loggedInInfo$(): Observable<string> {
    return this.user$.pipe(
      map(
        user =>
          user
            ? `${user.sfContact.Name} (${(user.roles || [])
                .map(getProperty('name'))
                .join(', ') || 'unknown'})`
            : 'unknown',
      ),
    )
  }
}
