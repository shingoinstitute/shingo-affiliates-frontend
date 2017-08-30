// Angular modules
import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

// RxJS Moduels
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fill-height]'
})
export class FillViewHeightDirective implements AfterViewInit {

  private windowResizeListenerSource: Subject<void> = new Subject<void>();
  private windowResizeListener: Observable<void> = this.windowResizeListenerSource.asObservable();

  constructor(private el: ElementRef) { }

  public ngAfterViewInit() {
    this.fillHeightOnElement();
    this.windowResizeListener
      .debounceTime(100)
      .subscribe(() => {
        this.fillHeightOnElement();
      });
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize() { this.windowResizeListenerSource.next(); }

  public fillHeightOnElement(obj?: ElementRef | JQuery<HTMLElement>) {
    if (obj instanceof HTMLElement) {
      this.el = new ElementRef(obj);
    }

    let toolbarOffset = 0;
    let marginOffset = 0;

    let toolbar = $('md-toolbar');
    if (Array.isArray(toolbar))
      toolbar = toolbar.pop();
    if (toolbar)
      toolbarOffset = +$(toolbar).css('height').split('px')[0];
    if (isNaN(toolbarOffset))
      toolbarOffset = 0;

    const margin = $(this.el.nativeElement).css('margin') || '';
    const margins = margin.split(' ').join('').split('px').filter(value => value.length > 0);
    if (margins.length > 1)
      marginOffset += +margins[0] + +margins[2];
    else if (margins.length === 1)
      marginOffset += (+margins[0] * 2);
    const offset = marginOffset + toolbarOffset;
    console.log(`setting height to calc(100vh - ${offset}px)`);
    $(this.el.nativeElement).css('min-height', `calc(100vh - ${offset}px)`);
  }

}