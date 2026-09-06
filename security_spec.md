# Security Specification & Threat Model (Heyo Bingaa NGO)

## 1. Data Invariants
1. **Public Readability**:
   - `events`, `media`, `programs`, and `siteSettings` are public resources that all users (anonymous and authenticated) can read and list to access Islamic content and schedules.
2. **Admin Authority**:
   - Only verified administrators (authenticated users whose UID exists in `/admins/{uid}` or who match bootstrapped admin email `ryn@azmans.com`) are authorized to create, update, or delete `events`, `media`, `programs`, `siteSettings`, and review `volunteerApplications` / `donationSlips`.
3. **Donation Slip Submissions**:
   - Any supporter (including guests) can submit a `donationSlip` with valid required fields (donorName, phone, amount > 0, currency, bankAccount).
   - Once created, non-admins cannot modify or delete donation slips. Only admins can mark them as verified.
4. **Volunteer Applications**:
   - Any supporter can submit a `volunteerApplication` with valid fields (name, phone, islandCity, track, availability).
   - Once submitted, only admins can view the private applicant contact details and update the application review status (`pending` -> `reviewed` -> `contacted`).

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Admin Escalation Payload**: Unauthenticated client attempts to create `/admins/attacker_uid` with `{ role: "admin" }`. Expected: PERMISSION_DENIED.
2. **Public Content Injection Payload**: Unauthenticated client attempts to inject an event into `/events/hacked_event` with malicious HTML or links. Expected: PERMISSION_DENIED.
3. **Volunteer Data Scraping Payload**: Unauthenticated client attempts to list all volunteer applicant phone numbers from `/volunteerApplications`. Expected: PERMISSION_DENIED.
4. **Donation Slip Snooping Payload**: Authenticated non-admin client attempts to read all donors' slip details from `/donationSlips`. Expected: PERMISSION_DENIED.
5. **Negative Amount Donation Payload**: Malicious client submits donation slip with `{ amount: -500 }`. Expected: PERMISSION_DENIED.
6. **Huge Buffer Poisoning Payload**: Malicious client attempts to write a 1MB junk payload into `/events/event_1/title`. Expected: PERMISSION_DENIED.
7. **Invalid Status Injection Payload**: Client submits event with `{ status: "invalid_status_type" }`. Expected: PERMISSION_DENIED.
8. **Volunteer Status Tampering Payload**: Applicant attempts to alter their own application status to `"contacted"` without admin authorization. Expected: PERMISSION_DENIED.
9. **Donation Slip Verification Tampering**: Donor attempts to self-verify their donation `{ verified: true }` during creation. Expected: PERMISSION_DENIED (or non-admin cannot verify).
10. **ID Poisoning Attack**: Client attempts document ID with special punctuation/traversal characters `/events/../../etc/passwd`. Expected: PERMISSION_DENIED.
11. **Programs Mass Delete Payload**: Non-admin client attempts to delete `/programs/prog-sisters`. Expected: PERMISSION_DENIED.
12. **Settings Hijack Payload**: Non-admin client attempts to replace the NGO bank account details or Viber hotline. Expected: PERMISSION_DENIED.
