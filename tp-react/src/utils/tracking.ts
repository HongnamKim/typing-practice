import {Storage_Anonymous_Id, Storage_Consent, Storage_Session_Id} from '@/const/config.const';

// --- anonymousId ---

export function getAnonymousId(): string | null {
    const consent = localStorage.getItem(Storage_Consent);
    if (consent !== 'accepted') return null;

    let id = localStorage.getItem(Storage_Anonymous_Id);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(Storage_Anonymous_Id, id);
    }
    return id;
}

// --- sessionId ---

export function getSessionId(): string {
    let id = sessionStorage.getItem(Storage_Session_Id);
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(Storage_Session_Id, id);
    }
    return id;
}

// --- referrer ---

const SELF_DOMAINS = ['typing-practice-omega.vercel.app', 'typing-practice.com', 'localhost'];

function extractDomain(url: string): string | null {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

const capturedReferrer: string | null = (() => {
    const ref = document.referrer;
    if (!ref) return null;
    const domain = extractDomain(ref);
    if (!domain) return null;
    if (SELF_DOMAINS.some(d => domain.includes(d))) return null;
    return domain;
})();

export function getReferrerDomain(): string | null {
    return capturedReferrer;
}

// --- deviceType ---

export type DeviceType = 'MOBILE' | 'TABLET' | 'DESKTOP';

const detectedDeviceType: DeviceType = (() => {
    const ua = navigator.userAgent;
    if (/Mobi|Android.*Mobile|iPhone/i.test(ua)) return 'MOBILE';
    if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 0)) return 'TABLET';
    if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'TABLET';
    if (navigator.maxTouchPoints > 0 && window.screen.width >= 768) return 'TABLET';
    return 'DESKTOP';
})();

export function getDeviceType(): DeviceType {
    return detectedDeviceType;
}

// --- tracking 객체 빌드 ---

export interface TrackingInfo {
    sessionId: string;
    referrer: string | null;
    deviceType: DeviceType;
}

export function buildTracking(): TrackingInfo | null {
    const consent = localStorage.getItem(Storage_Consent);
    if (consent !== 'accepted') return null;

    return {
        sessionId: getSessionId(),
        referrer: getReferrerDomain(),
        deviceType: getDeviceType(),
    };
}
