/* SystemJS module definition */
declare var module: NodeModule
interface NodeModule {
  id: string
}

// Declare `withoutTime` function to Date prototype (defined in main.ts)
interface Date {
  withoutTime(): Date
}
