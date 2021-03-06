interface AnnouncementInterface {
  title: string
  message: string
  priority: number
}

export class Announcement implements AnnouncementInterface {
  public title: string
  public message: string
  public priority: number

  constructor(title: string, message: string, priority: number) {
    this.title = title
    this.message = message
    this.priority = priority
  }

  public static create(obj: {
    title?: string
    message?: string
    priority?: number
  }) {
    return new Announcement(
      obj.title || '',
      obj.message || '',
      typeof obj.priority === 'number' ? obj.priority : -1,
    )
  }
}
