import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, fromEvent } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'

export const LOCALE_KEY = 'user-locale'

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  get languageChange$() {
    return this._languageChange$.asObservable().pipe(distinctUntilChanged())
  }

  private _languageChange$: BehaviorSubject<string>
  private _browserLanguageChange$: Observable<string>
  private getFromLocalStorage() {
    return localStorage.getItem(LOCALE_KEY)
  }

  private getFromBrowser() {
    return navigator.languages && navigator.languages.length > 0
      ? navigator.languages[0]
      : navigator.language
        ? navigator.language
        : 'en-US'
  }

  constructor() {
    this._languageChange$ = new BehaviorSubject(this.locale)

    this._browserLanguageChange$ = fromEvent(window, 'languagechange').pipe(
      map(() => this.getFromBrowser()),
    )

    this._browserLanguageChange$.subscribe(locale => {
      if (!this.getFromLocalStorage()) {
        this._languageChange$.next(locale)
      }
    })
  }

  get locale() {
    return this.getFromLocalStorage() || this.getFromBrowser()
  }

  set locale(locale: string) {
    if (locale === '') {
      this.clearLocale()
    } else {
      localStorage.setItem(LOCALE_KEY, locale)
      this._languageChange$.next(locale)
    }
  }

  clearLocale() {
    localStorage.removeItem(LOCALE_KEY)
    this._languageChange$.next(this.getFromBrowser())
  }

  browserLanguages() {
    return navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : ['en-US']
  }
}
