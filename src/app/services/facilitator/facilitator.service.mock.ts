import { of as observableOf, Observable } from 'rxjs'
import {
  when,
  mock,
  instance,
  anyOfClass,
  anyString,
  anything,
} from 'ts-mockito'

import { FacilitatorService } from './facilitator.service'
import { Facilitator } from '../../facilitators/facilitator.model'
import { SFSuccessResult } from '../api/base-api.abstract.service'

const mockedService: FacilitatorService = mock(FacilitatorService)

export const EXPECTED_FACILITATORS: Facilitator[] = [
  new Facilitator({ Id: 'some sf id' }),
  new Facilitator({ Id: 'some other sf id' }),
]
export const EXPECTED_SF_SUCCESS: SFSuccessResult = {
  id: 'some sf id',
  success: true,
  errors: [],
}
export const EXPECTED_DESCRIBE: any = {
  fields: ['some', 'fields', 'go', 'here'],
}

when(mockedService.getAll()).thenReturn(observableOf(EXPECTED_FACILITATORS))
when(mockedService.getById('some sf id')).thenReturn(
  observableOf(EXPECTED_FACILITATORS[0]),
)
when(mockedService.create(anyOfClass(Facilitator))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.update(anyOfClass(Facilitator))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.delete(anyOfClass(Facilitator))).thenReturn(
  observableOf(EXPECTED_SF_SUCCESS),
)
when(mockedService.search(anyString(), anything(), anything())).thenReturn(
  observableOf(EXPECTED_FACILITATORS),
)
when(mockedService.describe()).thenReturn(observableOf(EXPECTED_DESCRIBE))

export { mockedService as MockFacilitatorService }
