import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const SESSION_COOKIE = "cz_session";
const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "cruiserzone-local-secret-change-me");
export async function createSession(user) {
    return new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}
export async function verifySessionToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    }
    catch {
        return null;
    }
}
export async function getSession() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token)
        return null;
    return verifySessionToken(token);
}
export async function setSession(user) {
    const token = await createSession(user);
    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}
export async function destroySession() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
}
export async function requireUser() {
    const user = await getSession();
    if (!user)
        return null;
    return user;
}
export async function requireAdmin() {
    const user = await getSession();
    if (!user || user.role !== "ADMIN")
        return null;
    return user;
}
