## Description
Added console.log() logging to all API endpoint calls for better debugging and visibility into API requests.

## Type of Change
<!-- Mark the relevant option with an "x" -->
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [x] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [x] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test update
- [ ] Other (please describe):

## Changes Made
<!-- List the main changes made in this PR -->
- Added console.log() calls before all API endpoint calls in `src/api/` files
- Logging includes HTTP method, endpoint URL, and request parameters/body
- Sensitive data like passwords are redacted in logs for security
- Files modified:
  - `src/api/auth.ts` - Added logging for POST /auth/login
  - `src/api/entries.ts` - Added logging for GET /entries and POST /entries/filter
  - `src/api/users.ts` - Added logging for POST /users, PUT /users/{id}, GET /entries/form, and POST /users/upsert

## Testing
<!-- Describe the testing you've done or how to test these changes -->
- Verified all API calls still function correctly
- Console logs appear when API endpoints are called
- No linter errors introduced

## Checklist
<!-- Mark completed items with an "x" -->
- [x] Code follows the project's style guidelines
- [x] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [x] No new warnings generated
- [ ] Tests added/updated (if applicable)
- [x] All tests pass locally

## Related Issues
<!-- Link to related issues, if any -->
Closes #

## Additional Notes
<!-- Any additional information, screenshots, or context -->
This change helps developers debug API calls by providing visibility into when endpoints are called and what data is being sent. The logging uses console.log() as requested and includes appropriate data redaction for security.
