import { when, mock, instance, anyOfClass, anyString, anything } from 'ts-mockito';

import { AffiliateService } from './affiliate.service';
import { Affiliate } from '../../affiliates/affiliate.model';
import { CourseManager } from '../../workshops/course-manager.model';
import { ISFSuccessResult } from '../api/base-api.abstract.service';

import { Observable } from 'rxjs';


const mockedService: AffiliateService = mock(AffiliateService);

export const EXPECTED_AFFILIATES: Affiliate[] = [new Affiliate({ Id: 'some sf id' }), new Affiliate({ Id: 'some other sf id' })];
export const EXPECTED_SF_SUCCESS: ISFSuccessResult = { id: 'some sf id', success: true, errors: [] };
export const EXPECTED_DESCRIBE: any = { fields: ['some', 'fields', 'go', 'here'] };
export const EXPECTED_COURSE_MANAGERS: CourseManager[] = [new CourseManager({ Id: 'some sf id' }), new CourseManager({ Id: 'some other sf id' })];

when(mockedService.getAll()).thenReturn(Observable.of(EXPECTED_AFFILIATES));
when(mockedService.getById('some sf id')).thenReturn(Observable.of(EXPECTED_AFFILIATES[0]));
when(mockedService.create(anyOfClass(Affiliate))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.update(anyOfClass(Affiliate))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.delete(anyOfClass(Affiliate))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.search(anyString())).thenReturn(Observable.of(EXPECTED_AFFILIATES));
when(mockedService.describe()).thenReturn(Observable.of(EXPECTED_DESCRIBE));
when(mockedService.searchCMS(anyString(), anyString())).thenReturn(Observable.of(EXPECTED_COURSE_MANAGERS));
when(mockedService.map(anyOfClass(Affiliate))).thenReturn(Observable.of({ mapped: true }));

export { mockedService as MockAffiliateService };