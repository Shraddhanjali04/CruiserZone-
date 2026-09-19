"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { setSession, destroySession } from "@/lib/auth";
const registerSchema = z.object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{10,13}$/, "Enter a valid 10-digit mobile number"),
    city: z.string().trim().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export async function registerAction(_prev, formData) {
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        city: formData.get("city"),
        password: formData.get("password"),
    });
    if (!parsed.success) {
        return {
            error: "Please fix the highlighted fields.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }
    const data = parsed.data;
    const existing = await prisma.user.findFirst({
        where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existing) {
        return {
            error: existing.email === data.email
                ? "An account with this email already exists."
                : "An account with this phone number already exists.",
        };
    }
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            passwordHash: await hashPassword(data.password),
            role: "BUYER",
            kycStatus: "PENDING",
        },
    });
    await setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
    });
    redirect("/dashboard");
}
const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(1, "Enter your password"),
});
export async function loginAction(_prev, formData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) {
        return {
            error: "Enter your email and password.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return { error: "Incorrect email or password." };
    }
    await setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
    });
    redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}
export async function logoutAction() {
    await destroySession();
    redirect("/");
}
