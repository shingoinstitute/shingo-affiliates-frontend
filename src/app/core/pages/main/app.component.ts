import { map } from 'rxjs/operators'
// Angular Modules
import {
  Component,
  ViewChild,
  OnDestroy,
  LOCALE_ID,
  Inject,
  OnInit,
} from '@angular/core'
import {
  MatIconRegistry,
  MatSidenav,
  MatDialog,
  DateAdapter,
} from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'

// App Modules
import { MaterialsDialog } from '~app/ui-components/materials/materials-dialog/materials-dialog.component'

// RxJS Modules
import { Subscription, Observable } from 'rxjs'

// RxJS operators

import { SupportPage } from '~app/services/support/support.model'
import { MediaObserver } from '@angular/flex-layout'
import { LocaleService } from '~app/services/locale/locale.service'

import { User } from '~app/user/services/user.service'
import * as fromRoot from '~app/reducers'
import * as fromAuth from '~app/auth/reducers'
import * as fromUser from '~app/user/reducers'
import { Store, select } from '@ngrx/store'
import { AuthService } from '~app/auth/services/auth.service'
import { AuthActions } from '~app/auth/actions'
import { SupportService } from '~app/services/support/support.service'
import { property } from '~app/util/functional'
import { UserRenew } from '~app/user/actions/user-api.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  supportCategories: string[] = []
  supportCategoryPages: { [key: string]: SupportPage[] } = {}

  @ViewChild('sidenav')
  sidenav!: MatSidenav

  isLoading = true
  loggedIn$: Observable<boolean>
  isAdmin$: Observable<boolean>
  user$: Observable<User | null>
  private routeToLoginSubscription?: Subscription
  private loggedInSub?: Subscription

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private auth: AuthService,
    private supportService: SupportService,
    private dialog: MatDialog,
    public media: MediaObserver,
    private localeService: LocaleService,
    @Inject(LOCALE_ID) public locale: string,
    private dateAdapter: DateAdapter<any>,
    private store: Store<fromRoot.State>,
  ) {
    this.initIconRegistry()
    this.loggedIn$ = this.store.pipe(select(fromAuth.getLoggedIn))
    this.isAdmin$ = this.store.pipe(select(fromUser.isAdmin))
    this.user$ = this.store.pipe(select(fromUser.getUser))

    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        this.isLoading = true
      } else if (route instanceof NavigationEnd) {
        this.isLoading = false
      }
    })

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

  ngOnDestroy() {
    if (this.routeToLoginSubscription)
      this.routeToLoginSubscription.unsubscribe()
    if (this.loggedInSub) this.loggedInSub.unsubscribe()
  }

  /**
   * Handles logging out... yeah.
   */
  logoutHandler() {
    this.store.dispatch(new AuthActions.Logout())
  }

  openMaterials(folder: 'workshops' | 'forms' | 'marketing') {
    const folders = { workshops: false, marketing: false, forms: false }
    folders[folder] = true
    this.dialog.open(MaterialsDialog, {
      width: '80%',
      data: folders,
    })
  }

  initIconRegistry() {
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

  getSupportCategories() {
    this.supportService.getCategories().subscribe(categories => {
      this.supportCategories = []
      this.supportCategoryPages = {}
      for (const c of categories) {
        this.getSupportCategoryPages(c)
      }
    })
  }

  getSupportCategoryPages(category: string) {
    this.supportService.getCategory(category).subscribe(
      pages => {
        if (pages.length) {
          this.supportCategories.push(category)
          this.supportCategoryPages[category] = pages
        }
      },
      err => console.error(err),
    )
  }

  isLoggedInAs(): boolean {
    return false
    // return !!(this.auth.user && this.auth.user.state === UserState.LoggedInAs)
  }

  getLoggedInInfo(): Observable<string> {
    return this.user$.pipe(
      map(
        user =>
          user
            ? `${user.sfContact.Name} (${(user.roles || [])
                .map(property('name'))
                .join(', ') || 'unknown'})`
            : 'unknown user',
      ),
    )
  }
}
