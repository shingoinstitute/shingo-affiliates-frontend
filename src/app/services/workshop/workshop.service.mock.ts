import { of as observableOf, Observable } from 'rxjs'
import {
  when,
  mock,
  instance,
  anyOfClass,
  anyString,
  anything,
} from 'ts-mockito'

import { WorkshopService } from './workshop.service'
import { Workshop } from '../../workshops/workshop.model'
import { SFSuccessResult } from '../api/base-api.abstract.service'

const mockedService: WorkshopService = mock(WorkshopService)

export const EXPECTED_WORKSHOPS: Workshop[] = [
  new Workshop({ Id: 'some sf id' }),
  new Workshop({ Id: 'some other sf id' }),
]
export const EXPECTED_SF_SUCCESS: SFSuccessResult = {
  id: 'some sf id',
  success: true,
  errors: [],
}
export const EXPECTED_DESCRIBE: any = {
  fields: ['some', 'fields', 'go', 'here'],
}

when(mockedService.getAll()).thenReturn(observableOf(EXPECTED_WORKSHOPS))
when(mockedService.getById('some sf id')).thenReturn(
  observableOf(EXPECTED_WORKSHOPS[0]),
)
when(mockedService.create(anyOfClass(Workshop))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.update(anyOfClass(Workshop))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.delete(anyOfClass(Workshop))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.search(anyString())).thenReturn(
  observableOf(EXPECTED_WORKSHOPS),
)
when(mockedService.describe()).thenReturn(observableOf(EXPECTED_DESCRIBE))
when(mockedService.uploadAttendeeFile(anyString(), anything())).thenReturn(null)
when(mockedService.uploadEvaluations(anyString(), anything())).thenReturn(null)

export { mockedService as MockWorkshopService }
