// Local stub for @clerk/clerk-react.
//
// Aliased via vite.config.ts so every `import ... from '@clerk/clerk-react'`
// resolves to this file. We intentionally do not contact Clerk's servers:
// the app is shipped in guest/demo mode and behaves as a fully-logged-out
// experience. To re-enable real Clerk auth, remove the alias in
// vite.config.ts and set VITE_CLERK_PUBLISHABLE_KEY in the build env.

import type { ReactNode } from 'react';

type AnyProps = { children?: ReactNode } & Record<string, unknown>;

const passthrough = ({ children }: AnyProps): ReactNode => children ?? null;
const nothing = (_props?: AnyProps): ReactNode => null;

export const ClerkProvider = (props: AnyProps): ReactNode => passthrough(props);
export const SignedIn = nothing;
export const SignedOut = passthrough;
export const SignInButton = passthrough;
export const SignUpButton = passthrough;
export const UserButton = nothing;

// Hook stubs — return safe defaults so any code that reaches for them
// never crashes even if ClerkProvider is missing in the tree.
export const useUser = () => ({
  isSignedIn: false,
  isLoaded: true,
  user: null,
});
export const useAuth = () => ({
  isSignedIn: false,
  isLoaded: true,
  userId: null,
  sessionId: null,
  getToken: async () => null,
  orgId: null,
  orgRole: null,
  has: () => false,
});
export const useSession = () => ({
  isSignedIn: false,
  isLoaded: true,
  session: null,
});
export const useClerk = () => ({
  signIn: { open: () => undefined, create: async () => undefined },
  signUp: { open: () => undefined, create: async () => undefined },
  signOut: async () => undefined,
  openSignIn: () => undefined,
  openSignUp: () => undefined,
  openUserProfile: () => undefined,
  closeUserProfile: () => undefined,
});
export const useOrganization = () => ({
  isLoaded: true,
  organization: null,
});
export const useOrganizationList = () => ({
  isLoaded: true,
  organizationList: [],
  userMemberships: [],
});

// Keep default export harmless in case anything does a default import.
const ClerkStub = { passthrough, nothing };
export default ClerkStub;
