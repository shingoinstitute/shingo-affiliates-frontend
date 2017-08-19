import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export abstract class Filter {
    protected dataChangeSource: BehaviorSubject<any>;

    public get name(): string { return this._name; }
    public get dataChange(): BehaviorSubject<any> { return this.dataChangeSource; }

    constructor(protected _name: string) { }

    public abstract applyFilter(data: any[]): any[];
}