"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession, setSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
const kycSchema = z.object({
    kycType: z.enum(["AADHAAR", "PAN", "PASSPORT", "DRIVING_LICENSE"]),
    kycNumber: z.string().trim().min(6, "Enter a valid document number"),
    city: z.string().trim().optional(),
});
const passwordSchema = z.object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(8, "New password must be at least 8 characters"),
});
export async function updateKycAction(_prev, formData) {
    const session = await getSession();
    if (!session)
        return { error: "Not signed in." };
    const parsed = kycSchema.safeParse({
        kycType: formData.get("kycType"),
        kycNumber: formData.get("kycNumber"),
        city: formData.get("city"),
    });
    if (!parsed.success)
        return { error: "Please fill in the KYC details correctly." };
    const data = parsed.data;
    const user = await prisma.user.update({
        where: { id: session.id },
        data: {
            kycType: data.kycType,
            kycNumber: data.kycNumber,
            kycStatus: "SUBMITTED",
            kycSubmittedAt: new Date(),
            ...(data.city ? { city: data.city } : {}),
        },
    });
    await prisma.notification.create({
        data: {
            userId: user.id,
            type: "KYC",
            title: "KYC submitted",
            message: "Our team is verifying your documents. This usually takes under 24 hours.",
            link: "/dashboard/profile",
        },
    });
    await setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
    });
    return { ok: true };
}
export async function changePasswordAction(_prev, formData) {
    const session = await getSession();
    if (!session)
        return { error: "Not signed in." };
    const parsed = passwordSchema.safeParse({
        current: formData.get("current"),
        next: formData.get("next"),
    });
    if (!parsed.success)
        return { error: "Please enter both passwords." };
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user)
        return { error: "Account not found." };
    if (!(await verifyPassword(parsed.data.current, user.passwordHash))) {
        return { error: "Current password is incorrect." };
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await hashPassword(parsed.data.next) },
    });
    return { ok: true };
}
