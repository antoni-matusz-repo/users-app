import { auth } from "@/lib/auth";

type AuthInstance = Pick<typeof auth, "api">;

type Role = "admin" | "user";

// Każda chroniona trasa ma dokładnie jedną dopuszczoną rolę oraz "swój dom"
// — trasę, na którą trafia zalogowany użytkownik z inną rolą (zamiast
// gołego 403).
const PROTECTED_ROUTES: { prefix: string; role: Role }[] = [
  { prefix: "/users", role: "admin" },
  { prefix: "/dashboard", role: "user" },
];

const HOME_FOR_ROLE: Record<Role, string> = {
  admin: "/users",
  user: "/dashboard",
};

export type RouteGuardResult = { type: "allow" } | { type: "redirect"; url: string };

function roleOf(sessionRole: string | null | undefined): Role {
  return sessionRole === "admin" ? "admin" : "user";
}

export async function guardProtectedRouteWith(
  authInstance: AuthInstance,
  requestHeaders: Headers,
  pathname: string,
): Promise<RouteGuardResult> {
  const route = PROTECTED_ROUTES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!route) {
    return { type: "allow" };
  }

  const session = await authInstance.api.getSession({ headers: requestHeaders });
  if (!session) {
    return { type: "redirect", url: "/login" };
  }

  const role = roleOf(session.user.role);
  if (role !== route.role) {
    return { type: "redirect", url: `${HOME_FOR_ROLE[role]}?forbidden=1` };
  }

  return { type: "allow" };
}
