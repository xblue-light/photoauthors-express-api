export enum ERROR_MESSAGES {
  ACCESS_DENIED = 'Access Denied: You do not have sufficient permissions to perform this action. ',
  UNAUTHORIZED_ACCESS = 'Unauthorized Access: You do not have permission to access this resource.',
  PERMISSION_ERROR = 'Permission Error: Your role does not allow you to perform this action.',
  PERMISSION_DENIED = 'Permission Denied: You do not have the required permissions to access this resource.',
  AUTH_FAILED = 'Authentication Failed: Your username or password is incorrect. Please try again or reset your password',
  USER_NOT_FOUND = "User Not Found: We couldn't find an account with the provided username or email address.",
  INVALID_CREDS = 'Invalid Credentials: The username or password you provided is incorrect. Please try again with the correct credentials.',
}
