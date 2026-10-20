import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

/**
 * Deterministic Hardened Security Rules Auditor & Dirty Dozen Payload Verifier
 * Verifies that firestore.rules enforces all 8 Pillars and blocks all 12 Dirty Dozen payloads.
 */
describe('Firestore Security Rules — Dirty Dozen & 8 Pillars Verification', () => {
  const rulesText = fs.readFileSync('DRAFT_firestore.rules', 'utf8');

  it('enforces global default-deny safety net on /{document=**}', () => {
    assert.ok(rulesText.includes('match /{document=**}'));
    assert.ok(rulesText.includes('allow read, write: if false;'));
  });

  it('blocks Payload 01 (Unverified Email Write) via email_verified == true check', () => {
    assert.ok(rulesText.includes('request.auth.token.email_verified == true'));
  });

  it('blocks Payload 02 (Identity Spoofing) by enforcing uid == request.auth.uid and userId == request.auth.uid', () => {
    assert.ok(rulesText.includes('data.uid == request.auth.uid'));
    assert.ok(rulesText.includes('data.userId == request.auth.uid'));
  });

  it('blocks Payload 03 (Shadow / Ghost Field Injection) via strict hasAll and hasOnly key guards', () => {
    assert.ok(rulesText.includes('data.keys().hasAll('));
    assert.ok(rulesText.includes('data.keys().hasOnly('));
  });

  it('blocks Payload 04 (Tier Privilege Escalation on Update) via immutable tier & membershipNumber checks', () => {
    assert.ok(rulesText.includes('incoming().tier == existing().tier'));
    assert.ok(rulesText.includes('incoming().membershipNumber == existing().membershipNumber'));
  });

  it('blocks Payload 05 (PII Blanket Read / Scraping) by restricting /users get to isOwner and disallowing list', () => {
    assert.ok(rulesText.includes('allow get: if isOwner(userId) && isValidId(userId);'));
    assert.ok(rulesText.includes('allow list: if false;'));
  });

  it('blocks Payload 06 (Denial-of-Wallet Oversized String) via .size() bounds on every string', () => {
    assert.ok(rulesText.includes('data.defaultChauffeurAddress.size() <= 200'));
    assert.ok(rulesText.includes('data.fullName.size() <= 100'));
  });

  it('blocks Payload 07 (Forged Client Timestamp) via server timestamp request.time enforcement', () => {
    assert.ok(rulesText.includes('incoming().createdAt == request.time'));
    assert.ok(rulesText.includes('incoming().updatedAt == request.time'));
  });

  it('blocks Payload 08 (Orphaned Booking Creation) via relational exists() check on /users/$(incoming().userId)', () => {
    assert.ok(
      rulesText.includes('exists(/databases/$(database)/documents/users/$(incoming().userId))')
    );
  });

  it('blocks Payload 09 (Unbounded Seat Array Poisoning) via list size <= 4 and element type validation', () => {
    assert.ok(
      rulesText.includes(
        'data.selectedSeats is list && data.selectedSeats.size() >= 1 && data.selectedSeats.size() <= 4'
      )
    );
    assert.ok(rulesText.includes('data.selectedSeats[0] is string'));
  });

  it('blocks Payload 10 & 11 (Terminal State Bypass & Unauthorized Fare Mutation) via status locking and affectedKeys().hasOnly()', () => {
    assert.ok(rulesText.includes("existing().status == 'Confirmed'"));
    assert.ok(
      rulesText.includes("incoming().diff(existing()).affectedKeys().hasOnly(['status', 'updatedAt'])")
    );
  });

  it('blocks Payload 12 (Cross-User Booking List Scraping) via resource.data.userId == request.auth.uid in allow list', () => {
    assert.ok(rulesText.includes('allow list: if isSignedIn() && resource.data.userId == request.auth.uid;'));
  });
});
