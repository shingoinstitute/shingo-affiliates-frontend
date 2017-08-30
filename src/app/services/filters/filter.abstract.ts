import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export abstract class Filter {

  public get name(): string { return this._name; }
  public get dataChange(): BehaviorSubject<any> { return this.dataChangeSource; }

  protected dataChangeSource: BehaviorSubject<any>;

  constructor(protected _name: string) { }

  public abstract applyFilter(data: any[]): any[];
}