/**
 * firebase-config.js — PaintRank Firebase Configuration
 *
 * HOW TO FILL THIS IN:
 * 1. Go to https://console.firebase.google.com
 * 2. Create or open your project
 * 3. Click the gear icon (⚙) → "Project settings"
 * 4. Scroll to "Your apps" → click the web icon (</>)
 * 5. Register the app (give it any nickname)
 * 6. Copy the firebaseConfig object values below
 *
 * Then either:
 *  A) Paste the values directly into paintrank.html (search "YOUR_API_KEY"), OR
 *  B) Keep this file and add <script src="firebase-config.js"></script>
 *     BEFORE the paintrank.html <script> block in index.html
 *
 * ⚠️  This file will be publicly visible to anyone who views source.
 *     That is intentional — see README Security Note.
 */

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",            // e.g. "AIzaSyA..."
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",          // e.g. "paintrank-abc12"
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",           // e.g. "123456789012"
  appId:             "YOUR_APP_ID",              // e.g. "1:123456789012:web:abc..."
};

// Initialize Firebase (guard prevents double-init if already done in HTML)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Expose the Firestore instance globally so paintrank.html can use it
// (only needed if this file is loaded separately)
// const db = firebase.firestore();
