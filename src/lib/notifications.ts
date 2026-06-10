'use client';

/**
 * @fileOverview Push Notification Service for Daily Vibe Check Reminders.
 * Built on Unconditional Love — every notification is a gentle nudge, never a demand.
 */

export const LOVE_REMINDERS = [
  "I am loved",
  "Life is a radiant gift",
  "I cherish this breath",
  "Equality is my nature",
  "Love is life",
  "Unity is joy",
  "Truth is peace",
];

/** Request permission for push notifications */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

/** Schedule a daily vibe reminder */
export const scheduleDailyVibeReminder = (hourOfDay: number = 10): void => {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hourOfDay, 0, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const msUntilReminder = reminderTime.getTime() - now.getTime();

  // Save the scheduled time to localStorage
  localStorage.setItem(
    "prema_reminder",
    JSON.stringify({
      scheduledFor: reminderTime.toISOString(),
      hourOfDay,
    })
  );

  // Use a relative timeout for the initial trigger
  setTimeout(() => {
    sendLoveNotification();
    // Reschedule for the next day (24 hours)
    setInterval(sendLoveNotification, 24 * 60 * 60 * 1000);
  }, msUntilReminder);
};

/** Send a love-based notification */
export const sendLoveNotification = (): void => {
  if (typeof window === 'undefined' || !("Notification" in window) || Notification.permission !== "granted") return;

  const message = LOVE_REMINDERS[Math.floor(Math.random() * LOVE_REMINDERS.length)];

  const notification = new Notification("prema", {
    body: message,
    tag: "daily-vibe-check",
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = "/dashboard";
    notification.close();
  };
};

/** Ask user to enable notifications (call this after onboarding) */
export const askForNotificationPermission = async (
  preferredHour: number = 10
): Promise<void> => {
  const granted = await requestNotificationPermission();
  if (granted) {
    scheduleDailyVibeReminder(preferredHour);
    localStorage.setItem("prema_notifications", "enabled");
  }
};
