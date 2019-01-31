import { TemplateRef, Directive } from '@angular/core'

// tslint:disable: max-classes-per-file

@Directive({
  selector: '[focusRight]',
})
export class FocusRightDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[focusLeft]',
})
export class FocusLeftDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
