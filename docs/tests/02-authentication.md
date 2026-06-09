# 02 — Authentication

---

## Register `/auth/register`

- [ ] Page loads with first name, last name, email, password, confirm password fields
- [ ] Submitting empty form shows required field errors
- [ ] Mismatched passwords shows "Passwords do not match" error
- [ ] Password under 8 characters shows length error
- [ ] Valid submission shows "Check your email to confirm your account" message
- [ ] Confirmation email arrives (check Supabase → Authentication → Logs in dev)
- [ ] Clicking confirmation link in email activates the account and redirects to `/auth/login`
- [ ] After confirming, logging in redirects to `/portal`
- [ ] New user has `role = patient` in Supabase → profiles table

---

## Login `/auth/login`

### Happy path
- [ ] Enter `patient@test.physioflex` / `TestPatient123!` → redirects to `/portal`
- [ ] Enter admin credentials → redirects to `/admin`

### Error cases
- [ ] Wrong password → shows "Invalid login credentials" error
- [ ] Unknown email → shows error (not a silent success)
- [ ] Empty fields → shows validation error

### Redirect preservation
- [ ] Go to `/portal` while logged out → redirected to `/auth/login?redirect=/portal`
- [ ] After login, you land back at `/portal` (not the homepage)
- [ ] Go to `/admin` while logged out → redirected to `/auth/login?redirect=/admin`
- [ ] After admin login, you land at `/admin`

---

## Forgot Password `/auth/forgot`

- [ ] Page loads with email field
- [ ] Enter `patient@test.physioflex` → success message shown
- [ ] Reset email arrives (check Supabase email logs)
- [ ] Unknown email → still shows success message (security — no user enumeration)

---

## Password Reset `/auth/reset`

- [ ] Clicking the reset link in email opens `/auth/reset`
- [ ] Form shows new password + confirm password fields
- [ ] Mismatched passwords shows error
- [ ] Valid new password → success message and redirect to `/auth/login`
- [ ] Old password no longer works after reset
- [ ] New password works on login

---

## Logout

- [ ] Click Sign out in the portal sidebar → session cleared, redirected to homepage or `/auth/login`
- [ ] Visiting `/portal` after logout redirects back to login
- [ ] Visiting `/admin` after logout redirects back to login
- [ ] No stale session data visible after logout
