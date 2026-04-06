import {Session_Typing_Count} from '@/const/config.const';

export function incrementSessionTypingCount(): number {
    const count = parseInt(sessionStorage.getItem(Session_Typing_Count) || '0', 10);
    const newCount = count + 1;
    sessionStorage.setItem(Session_Typing_Count, String(newCount));
    window.dispatchEvent(new CustomEvent('typing-count-update', {detail: newCount}));
    return newCount;
}
