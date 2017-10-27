export enum State { Creating = 1, Mapping = 2, Updating = 3 }
export class AffiliateFormState {

  public get state(): State { return this._state; }

  public _state: State;

  constructor(state: State.Creating | State.Updating) { this._state = state; }

  public next() {
    switch (this._state) {
      case State.Creating: this._state = State.Mapping; break;
      default: break;
    }
  }
}