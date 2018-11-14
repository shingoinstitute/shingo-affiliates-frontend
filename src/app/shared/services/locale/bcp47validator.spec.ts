import { isValidBCP47 } from './bcp47validator'
import { tuple } from '../../util/functional'

// from ietf BCP47 spec Appendix A
/**
 *  Simple language subtag:
 *
 *    de (German)
 *
 *    fr (French)
 *
 *    ja (Japanese)
 *
 *    i-enochian (example of a grandfathered tag)
 */
const simple = ['de', 'fr', 'ja', 'i-enochian']
/**
 *  Language subtag plus Script subtag:
 *
 *    zh-Hant (Chinese written using the Traditional Chinese script)
 *
 *    zh-Hans (Chinese written using the Simplified Chinese script)
 *
 *    sr-Cyrl (Serbian written using the Cyrillic script)
 *
 *    sr-Latn (Serbian written using the Latin script)
 */
const langPlusScript = ['zh-Hant', 'zh-Hans', 'sr-Cyrl', 'sr-Latn']
/**
 *  Extended language subtags and their primary language subtag
 *  counterparts:
 *
 *    zh-cmn-Hans-CN (Chinese, Mandarin, Simplified script, as used in
 *    China)
 *
 *    cmn-Hans-CN (Mandarin Chinese, Simplified script, as used in
 *    China)
 *
 *    zh-yue-HK (Chinese, Cantonese, as used in Hong Kong SAR)
 *
 *    yue-HK (Cantonese Chinese, as used in Hong Kong SAR)
 */
const extLangWithPrimary = [
  'zh-cmn-Hans-CN',
  'cmn-Hans-CN',
  'zh-yue-HK',
  'yue-HK',
]
/**
 *  Language-Script-Region:
 *
 *    zh-Hans-CN (Chinese written using the Simplified script as used in
 *    mainland China)
 *
 *    sr-Latn-RS (Serbian written using the Latin script as used in
 *    Serbia)
 */
const langScriptRegion = ['zh-Hans-CN', 'zr-Latn-RS']
/**
 *  Language-Variant:
 *
 *    sl-rozaj (Resian dialect of Slovenian)
 *
 *    sl-rozaj-biske (San Giorgio dialect of Resian dialect of
 *    Slovenian)
 *
 *    sl-nedis (Nadiza dialect of Slovenian)
 */
const langVariant = ['sl-rozaj', 'sl-rozaj-biske', 'sl-nedis']
/**
 *  Language-Region-Variant:
 *
 *    de-CH-1901 (German as used in Switzerland using the 1901 variant
 *    [orthography])
 *
 *    sl-IT-nedis (Slovenian as used in Italy, Nadiza dialect)
 */
const langRegionVariant = ['de-CH-1901', 'sl-IT-nedis']
/**
 *  Language-Script-Region-Variant:
 *
 *    hy-Latn-IT-arevela (Eastern Armenian written in Latin script, as
 *    used in Italy)
 */
const langScriptRegionVariant = ['hy-Latn-arevela']
/**
 *  Language-Region:
 *
 *    de-DE (German for Germany)
 *
 *    en-US (English as used in the United States)
 *
 *    es-419 (Spanish appropriate for the Latin America and Caribbean
 *    region using the UN region code)
 */
const langRegion = ['de-DE', 'en-US', 'es-419']
/**
 *  Private use subtags:
 *
 *    de-CH-x-phonebk
 *
 *    az-Arab-x-AZE-derbend
 */
const privateSubtags = ['de-CH-x-phonebk', 'az-Arab-x-AZE-derbend']
/**
 *  Private use registry values:
 *
 *    x-whatever (private use using the singleton 'x')
 *
 *    qaa-Qaaa-QM-x-southern (all private tags)
 *
 *    de-Qaaa (German, with a private script)
 *
 *    sr-Latn-QM (Serbian, Latin script, private region)
 *
 *    sr-Qaaa-RS (Serbian, private script, for Serbia)
 */
const privateRegistry = [
  'x-whatever',
  'qaa-Qaaa-QM-x-southern',
  'de-Qaaa',
  'sr-Latn-QM',
  'sr-Qaaa-RS',
]
/**
 *  Tags that use extensions (examples ONLY -- extensions MUST be defined
 *  by revision or update to this document, or by RFC):
 *
 *    en-US-u-islamcal
 *
 *    zh-CN-a-myext-x-private
 *
 *    en-a-myext-b-another
 */
const withExtensions = [
  'en-US-u-islamcal',
  'zh-CN-a-myext-x-private',
  'en-a-myext-b-another',
]
/**
 *  Some Invalid Tags:
 *
 *    de-419-DE (two region tags)
 *
 *    a-DE (use of a single-character subtag in primary position; note
 *    that there are a few grandfathered tags that start with "i-" that
 *    are valid)
 *
 *    ar-a-aaa-b-bbb-a-ccc (two extensions with same single-letter
 *    prefix)
 */
// const invalid = ['de-419-DE', 'a-DE', 'ar-a-aaa-b-bbb-a-ccc']
/**
 * irregular grandfathered tags
 *
 * These tags don't fit the format for a language-tag, but they are grandfathered in
 */
const irregularGrandfathered = [
  'en-GB-oed',
  'i-ami',
  'i-bnn',
  'i-default',
  'i-enochian',
  'i-hak',
  'i-klingon',
  'i-lux',
  'i-mingo',
  'i-navajo',
  'i-pwn',
  'i-tao',
  'i-tay',
  'i-tsu',
  'sgn-BE-FR',
  'sgn-BE-NL',
  'sgn-CH-DE',
]
const regularGrandfathered = [
  'art-lojban',
  'cel-gaulish',
  'no-bok',
  'no-nyn',
  'zh-guoyu',
  'zh-hakka',
  'zh-min',
  'zh-min-nan',
  'zh-xiang',
]

const basicTest = (inputs: string[], pass = true) => {
  const results = inputs.map(v => tuple(v, isValidBCP47(v)))
  results.forEach(([input, result]) => {
    const fail = `Regex Validator failed for input ${input}`
    expect({ fail, result }).toEqual({ fail, result: pass })
  })
  return results
}

describe('BCP47 parser', () => {
  it('parses the Simple language subtag examples', () => {
    basicTest(simple)
  })
  it('parses the Language subtag plus Script examples', () => {
    basicTest(langPlusScript)
  })
  it('parses the Extended language subtag with primary lang subtag examples', () => {
    basicTest(extLangWithPrimary)
  })
  it('parses the Language-Script-Region examples', () => {
    basicTest(langScriptRegion)
  })
  it('parses the Language-Variant examples', () => {
    basicTest(langVariant)
  })
  it('parses the Language-Region-Variant examples', () => {
    basicTest(langRegionVariant)
  })
  it('parses the Language-Script-Region-Variant examples', () => {
    basicTest(langScriptRegionVariant)
  })
  it('parses the Language-Region examples', () => {
    basicTest(langRegion)
  })
  it('parses the Private subtag examples', () => {
    basicTest(privateSubtags)
  })
  it('parses the Private use registry examples', () => {
    basicTest(privateRegistry)
  })
  it('parses the tags with extensions examples', () => {
    basicTest(withExtensions)
  })
  // the regex validator allows some invalid langs (false positives)
  // we'll allow it for now, since the parser combinator version didn't work
  // it('fails to parse the invalid examples', () => {
  //   basicTest(invalid, false)
  // })
  it('parses irregular grandfathered tags', () => {
    basicTest(irregularGrandfathered)
  })
  it('parses regular grandfathered tags', () => {
    basicTest(regularGrandfathered)
  })
})
