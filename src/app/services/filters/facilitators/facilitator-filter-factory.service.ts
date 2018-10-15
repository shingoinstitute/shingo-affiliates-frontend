import { Injectable } from '@angular/core'
import { FilterFactory } from '../filter-factory.abstract.service'
import { TextFilter } from '../text-filter'
import { Facilitator } from '../../../facilitators/facilitator.model'

@Injectable()
export class FacilitatorFilterFactory {
  public static id = 0

  public createTextFilter(
    name: string = `FacilitatorFilterFactory:${FacilitatorFilterFactory.id}`,
  ): TextFilter<Facilitator> {
    FacilitatorFilterFactory.id++
    return new TextFilter<Facilitator>(name)
  }
}
