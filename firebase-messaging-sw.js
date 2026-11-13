/* Service worker that shows chat notifications when the app is closed. */
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// Use the SAME values as FB_CFG in index.html.
firebase.initializeApp({
  apiKey: "AIzaSyD1M8VVTlrWrPD3qMmc0FG6nTauWntM-d8",
  projectId: "kudhinbillsplit",
  messagingSenderId: "58781718349",
  appId: "1:58781718349:web:416bef9fa4e203082c4904"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  // Show the app icon badge with the unread message count (when the alert includes one).
  try {
    if (d.badge && self.navigator && self.navigator.setAppBadge) self.navigator.setAppBadge(Number(d.badge));
  } catch (e) {}
  return self.registration.showNotification(d.title || "Squad Split", {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.tag || "chat",
    renotify: true,
    data: { url: d.url || "./" }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      return clients.openWindow((event.notification.data && event.notification.data.url) || "./");
    })
  );
});
