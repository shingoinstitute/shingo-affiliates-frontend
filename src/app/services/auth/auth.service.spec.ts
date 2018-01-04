// tslint:disable:prefer-const
// tslint:disable:no-var-keyword
import { AuthService } from './auth.service';
import { HttpServiceMock } from '../http/http-service-mock';
import { User } from '../../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    service = new AuthService(new HttpServiceMock({ body: { jwt: 'some jwt', user: {id: 'id', name: 'name'} } }));
  });

  it('should be created', () => {
    expect(service).not.toBeUndefined();
    expect(service.authenticationChange$).not.toBeUndefined();
  });

  it('expects authenticationChange$ to immediately return a boolean value upon subscribing', () => {
    expect(service.authenticationChange$.subscribe).not.toBeUndefined();
    service.authenticationChange$.subscribe((value) => {
      expect(value).not.toBeUndefined();
    });
  });

  it(`expects #login and #logout to return an observable`, () => {
    let spy = spyOn(service.authenticationChange$, 'next');

    expect(service.authenticationChange$.next).not.toHaveBeenCalled();
    
    service.login({
      email: 'email',
      password: 'password'
    }).subscribe((data: any) => {
      expect(data).not.toBeUndefined();
      expect(service.user).not.toBeUndefined();
      expect(service.authenticationChange$.next).toHaveBeenCalled();
      service.logout().subscribe((data) => {
        expect(data).not.toBeUndefined();
        expect(service.user).toBeNull();
        expect(service.authenticationChange$.next).toHaveBeenCalled();
      });
    });

  });

  it(`expects #getUser to get a user`, () => {
    service = new AuthService(new HttpServiceMock({body: {}}));

    service.login({
      email: 'email',
      password: 'password'
    }).subscribe((data: any) => {
      service.getUser().subscribe((user: User) => {
        expect(user).toBeTruthy();
        expect(user instanceof User).toBe(true);
      });
    });
  });

});
