export class Announcement implements AnnouncementInterface {
  public title: string;
  public message: string;
  public priority: number;

  constructor(title: string, message: string, priority: number) {
    this.title = title;
    this.message = message;
    this.priority = priority;
  }

  public static create(obj) {
    return new Announcement(obj.title || '', obj.message || '', obj.priority || -1);
  }
}

// tslint:disable-next-line:interface-name
interface AnnouncementInterface {
  title: string;
  message: string;
  priority: number;
}