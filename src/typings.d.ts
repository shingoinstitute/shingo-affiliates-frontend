/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

type DateRange = [Date, Date] & { 2?: void };

// Declare `withoutTime` function to Date prototype (defined in main.ts)
interface Date {
  withoutTime(): Date;
}