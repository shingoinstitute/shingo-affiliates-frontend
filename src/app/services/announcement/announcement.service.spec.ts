import { AnnouncementService } from './announcement.service'

describe('AnnouncementService', () => {
  let service: AnnouncementService
  beforeEach(() => {
    service = new AnnouncementService()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
    expect(service.getAnnouncements).not.toBeUndefined()
  })

  it('should get announcements', () => {
    service.getAnnouncements().subscribe(data => {
      expect(data).toBeTruthy()
      expect(Array.isArray(data)).toBe(true)
      expect(data[0].message).toBeTruthy()
      expect(data[0].title).toBeTruthy()
      expect(typeof data[0].priority === 'number').toBe(true)
    })
  })
})
