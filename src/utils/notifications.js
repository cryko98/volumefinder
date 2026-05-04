export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications');
        return false;
    }
    if (Notification.permission === 'granted') {
        return true;
    }
    if (Notification.permission !== 'denied') {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        catch (error) {
            console.warn('Notification permission request failed:', error);
            return false;
        }
    }
    return false;
}
export function sendNotification(title, options) {
    if (Notification.permission !== 'granted') {
        return null;
    }
    try {
        return new Notification(title, {
            icon: '/volumefinder/favicon.ico',
            ...options,
        });
    }
    catch (error) {
        console.warn('Failed to send notification:', error);
        return null;
    }
}
export function playSound(type = 'alert') {
    // Create a simple beep using Web Audio API
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        if (type === 'success') {
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, context.currentTime);
            gain.gain.setValueAtTime(0, context.currentTime + 0.2);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.2);
        }
        else {
            // Alert sound - higher pitch
            oscillator.frequency.setValueAtTime(1000, context.currentTime);
            gain.gain.setValueAtTime(0.2, context.currentTime);
            gain.gain.setValueAtTime(0, context.currentTime + 0.1);
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.1);
        }
    }
    catch (error) {
        console.warn('Audio context not available:', error);
    }
}
export function copyToClipboard(text) {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return Promise.resolve(true);
        }
        catch {
            document.body.removeChild(textarea);
            return Promise.resolve(false);
        }
    }
    return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);
}
