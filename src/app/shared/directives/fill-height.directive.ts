import { Directive, ElementRef, HostListener } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Directive({
   selector: '[fill-height]'
})
export class FillViewHeightDirective {

   private windowResizeListenerSource: Subject<void> = new Subject<void>();
   private windowResizeListener: Observable<void> = this.windowResizeListenerSource.asObservable();

   constructor(private el: ElementRef) {}

   ngAfterViewInit() {
      this.setHeight();
      this.windowResizeListener
      .debounceTime(100)
      .subscribe(() => {
         this.setHeight();
      });
   }

   @HostListener('window:resize', ['$event'])
   onWindowResize() { this.windowResizeListenerSource.next(); }

   public setHeight(el?: ElementRef) {
      if (!el) { el = this.el; }
      let toolbarOffset = 0;
      let marginOffset = 0;

      let toolbar = $('md-toolbar');
      if (Array.isArray(toolbar))
         toolbar = toolbar.pop();
      if (toolbar)
         toolbarOffset = +$(toolbar).css('height').split('px')[0];
      if (isNaN(toolbarOffset))
         toolbarOffset = 0;

      let margin = $(el.nativeElement).css('margin');
      let margins = margin.split(' ').join('').split('px').filter(value => { return value.length > 0; });
      if (margins.length > 1)
         marginOffset += +margins[0] + +margins[2];
      else if (margins.length == 1)
         marginOffset += (+margins[0] * 2);
      const offset = marginOffset + toolbarOffset;
      $(el.nativeElement).css('min-height', `${window.innerHeight - offset}px`);
   }

}