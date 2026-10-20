# Aurelia Overland — Firestore Security Architecture Specification (`security_spec.md`)

## 1. Data Invariants
1. **Global Default-Deny**: All paths not explicitly matched (`/users/{userId}` and `/bookings/{bookingId}`) are strictly denied (`allow read, write: if false;`).
2. **Verified Identity & Ownership**:
   - A `/users/{userId}` document can only be created or updated by an authenticated user with a verified email (`request.auth.token.email_verified == true`) whose `request.auth.uid == userId` and `incoming().uid == request.auth.uid`.
   - `list` is strictly forbidden on `/users` to prevent PII scraping (`allow list: if false;`).
   - Immutable fields (`uid`, `email`, `tier`, `membershipNumber`, `createdAt`) cannot be modified during profile updates.
3. **Relational Integrity & Terminal State Locking on Bookings (`/bookings/{bookingId}`)**:
   - A booking document can only be created if `incoming().userId == request.auth.uid` and the parent user profile exists (`exists(/databases/$(database)/documents/users/$(incoming().userId))`).
   - `selectedSeats` is a strictly bounded list (`size() >= 1 && size() <= 4` and `selectedSeats[0] is string && selectedSeats[0].size() <= 10`).
   - Queries (`allow list`) on `/bookings` enforce `resource.data.userId == request.auth.uid` without any `get()` or `exists()` calls inside `list`.
   - Once a booking reaches a terminal status (`Completed` or `Cancelled`), no further updates are permitted (`existing().status == 'Confirmed'`). The only allowed update action is transitioning `status` from `'Confirmed'` to `'Cancelled'` alongside `updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 01 (Unverified Email Write)**: Attempting to create `/users/user_1` with `email_verified: false`. -> `PERMISSION_DENIED`
2. **Payload 02 (Identity Spoofing on User Create)**: Authenticated `user_1` attempting to create `/users/user_2` or set `uid: 'user_2'`. -> `PERMISSION_DENIED`
3. **Payload 03 (Shadow / Ghost Field Injection)**: Authenticated `user_1` creating `/users/user_1` with an extra field `"isAdmin": true`. -> `PERMISSION_DENIED`
4. **Payload 04 (Tier Privilege Escalation on Update)**: Authenticated `user_1` attempting to update `tier` or `membershipNumber` after creation. -> `PERMISSION_DENIED`
5. **Payload 05 (PII Blanket Read / Scraping)**: Authenticated `user_2` attempting `get` on `/users/user_1` or `list` on `/users`. -> `PERMISSION_DENIED`
6. **Payload 06 (Denial-of-Wallet Oversized String)**: Injecting a 5,000-character string into `defaultChauffeurAddress` (max 200). -> `PERMISSION_DENIED`
7. **Payload 07 (Forged Client Timestamp)**: Supplying a past or future `createdAt` or `updatedAt` timestamp that does not equal `request.time`. -> `PERMISSION_DENIED`
8. **Payload 08 (Orphaned Booking Creation)**: Authenticated `user_1` attempting to create `/bookings/AOV-101` before `/users/user_1` exists in Firestore. -> `PERMISSION_DENIED`
9. **Payload 09 (Unbounded Seat Array Poisoning)**: Creating a booking with 10 seats (`selectedSeats.size() > 4`) or non-string first element. -> `PERMISSION_DENIED`
10. **Payload 10 (Terminal State Bypass on Cancelled Booking)**: Attempting to update a booking whose `existing().status == 'Cancelled'` back to `'Confirmed'`. -> `PERMISSION_DENIED`
11. **Payload 11 (Unauthorized Fare Mutation on Booking Update)**: Attempting to modify `totalInr` during a booking update action. -> `PERMISSION_DENIED`
12. **Payload 12 (Cross-User Booking List Scraping)**: Authenticated `user_2` querying `/bookings` without `where('userId', '==', 'user_2')`. -> `PERMISSION_DENIED`
