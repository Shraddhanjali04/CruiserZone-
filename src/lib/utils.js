import { CURRENCY } from "@/lib/constants";
export function inr(n) {
    return `${CURRENCY}${n.toLocaleString("en-IN")}`;
}
export function formatDate(d) {
    if (!d)
        return "—";
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
export function formatDateTime(d) {
    if (!d)
        return "—";
    return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}
export function timeAgo(d) {
    const then = typeof d === "string" ? new Date(d) : d;
    const diff = Date.now() - then.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)
        return "just now";
    if (mins < 60)
        return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)
        return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30)
        return `${days}d ago`;
    return formatDate(then);
}
export function readJsonArray(s) {
    try {
        const v = JSON.parse(s);
        return Array.isArray(v) ? v : [];
    }
    catch {
        return [];
    }
}
export function toInput(d) {
    if (!d)
        return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function cn(...parts) {
    return parts.filter(Boolean).join(" ");
}
