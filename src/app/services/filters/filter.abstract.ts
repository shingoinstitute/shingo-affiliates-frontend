import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export abstract class Filter {
    protected dataChangeSource: BehaviorSubject<any>;

    public get dataChange(): BehaviorSubject<any> { return this.dataChangeSource; }

    public abstract applyFilter(data: any[]): any[];
}