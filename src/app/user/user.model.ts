import { AuthUser } from '@shingo/affiliates-api/guards/auth.guard'

/* ================
 * TYPE DEFINITIONS
 * ================
 */

export type User = AuthUser

/* ==================
 * ACCESSOR FUNCTIONS
 * ==================
 */

// salesforce describe says Account may be undefined,
// however it is required when creating a Contact in SF, and so should always exist
// tslint:disable-next-line:no-non-null-assertion
export const affiliateId = (u: User) => u.sfContact.AccountId!
