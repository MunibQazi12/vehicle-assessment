import type { Access, FieldAccess } from 'payload'

// =============================================================================
// Access Functions
// =============================================================================

/**
 * Access function - Any authenticated user
 */
export const authenticated: Access = ({ req: { user } }) => {
	return Boolean(user)
}

// =============================================================================
// Field Access Functions
// =============================================================================

/**
 * Field access - Read for any authenticated user
 */
export const fieldReadAuthenticated: FieldAccess = ({ req: { user } }) => Boolean(user)
