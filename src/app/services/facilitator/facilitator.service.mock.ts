import { when, mock, instance, anyOfClass, anyString, anything } from 'ts-mockito';

import { FacilitatorService } from './facilitator.service';
import { Facilitator } from '../../facilitators/facilitator.model';
import { CourseManager } from '../../workshops/course-manager.model';
import { ISFSuccessResult } from '../api/base-api.abstract.service';

import { Observable } from 'rxjs';


const mockedService: FacilitatorService = mock(FacilitatorService);

export const EXPECTED_FACILITATORS: Facilitator[] = [new Facilitator({ Id: 'some sf id' }), new Facilitator({ Id: 'some other sf id' })];
export const EXPECTED_SF_SUCCESS: ISFSuccessResult = { id: 'some sf id', success: true, errors: [] };
export const EXPECTED_DESCRIBE: any = { fields: ['some', 'fields', 'go', 'here'] };

when(mockedService.getAll()).thenReturn(Observable.of(EXPECTED_FACILITATORS));
when(mockedService.getById('some sf id')).thenReturn(Observable.of(EXPECTED_FACILITATORS[0]));
when(mockedService.create(anyOfClass(Facilitator))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.update(anyOfClass(Facilitator))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.delete(anyOfClass(Facilitator))).thenReturn(Observable.of(EXPECTED_SF_SUCCESS));
when(mockedService.search(anyString(), anything(), anything())).thenReturn(Observable.of(EXPECTED_FACILITATORS));
when(mockedService.describe()).thenReturn(Observable.of(EXPECTED_DESCRIBE));

export { mockedService as MockFacilitatorService };