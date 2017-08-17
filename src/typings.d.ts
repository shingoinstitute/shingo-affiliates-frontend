/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

type DateRange = [Date, Date] & { 2?: void };