import { SetMetadata } from '@nestjs/common';

export const ALLOW_PASSWORD_CHANGE_KEY = 'allowPasswordChange';

/** Exempts a route from PasswordChangeGuard so a user flagged mustChangePassword can still reach it. */
export const AllowPasswordChange = () =>
  SetMetadata(ALLOW_PASSWORD_CHANGE_KEY, true);
