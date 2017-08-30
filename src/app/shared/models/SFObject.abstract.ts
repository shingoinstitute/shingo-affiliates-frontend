export abstract class SFObject {
  public abstract get name(): string;
  public abstract get sfId(): string;

  public abstract toJSON(): object;
}
