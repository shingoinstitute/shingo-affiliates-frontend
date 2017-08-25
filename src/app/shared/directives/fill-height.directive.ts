// Angular modules
import { Directive, ElementRef, HostListener } from '@angular/core';

// RxJS Moduels
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Directive({
    selector: '[fill-height]'
})
export class FillViewHeightDirective {

    private windowResizeListenerSource: Subject<void> = new Subject<void>();
    private windowResizeListener: Observable<void> = this.windowResizeListenerSource.asObservable();

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        this.fillHeightOnElement();
        this.windowResizeListener
            .debounceTime(100)
            .subscribe(() => {
                this.fillHeightOnElement();
            });
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() { this.windowResizeListenerSource.next(); }

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

        let margin = $(this.el.nativeElement).css('margin') || '';
        let margins = margin.split(' ').join('').split('px').filter(value => { return value.length > 0; });
        if (margins.length > 1)
            marginOffset += +margins[0] + +margins[2];
        else if (margins.length == 1)
            marginOffset += (+margins[0] * 2);
        const offset = marginOffset + toolbarOffset;
        $(this.el.nativeElement).css('min-height', `${window.innerHeight - offset}px`);
    }

}