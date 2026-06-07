import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export type PermissionKey =
  | `${string}.read`
  | `${string}.write`
  | `${string}.delete`
  | `${string}.manage`
  | `${string}.approve`
  | `${string}.export`
  | string;

export const Permissions = (...permissions: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
