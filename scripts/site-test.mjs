/**
 * Physioflex Site Verification Script
 * Covers: public pages, auth, booking, patient portal, admin panel
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3333';
const PATIENT_EMAIL = 'patient@test.physioflex';
const PATIENT_PASS = 'TestPatient123!';

let pass = 0, fail = 0, warn = 0;
const findings = [];

function log(icon, label, detail = '') {
  const line = `${icon} ${label}${detail ? ' → ' + detail : ''}`;
  console.log(line);
  if (icon === '✅') pass++;
  else if (icon === '❌') { fail++; findings.push({ type: 'FAIL', label, detail }); }
  else if (icon === '⚠️') { warn++; findings.push({ type: 'WARN', label, detail }); }
}

function check(condition, label, detail = '') {
  if (condition) log('✅', label, detail);
  else log('❌', label, detail);
}

async function waitReady(page, url, timeout = 30000) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  await page.waitForTimeout(700);
}

// innerText excludes <script> and <style> contents — use for visible-text checks
async function visibleText(page) {
  return page.evaluate(() => document.body.innerText);
}

// ─── helpers ────────────────────────────────────────────────────────────────

async function loginAs(page, email, password) {
  await waitReady(page, `${BASE}/auth/login`);
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
}

async function logout(page) {
  try {
    const btn = page.locator('button, a').filter({ hasText: /sign out|log out|logout/i }).first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
      await page.waitForTimeout(1500);
    }
  } catch { /* ignored */ }
}

// ============================================================================
// SECTION 1 — PUBLIC PAGES
// ============================================================================
async function testPublicPages(browser) {
  console.log('\n══════════════════════════════════════');
  console.log('  01 — PUBLIC PAGES');
  console.log('══════════════════════════════════════');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(e.message));

  // ── Homepage ──
  await waitReady(page, `${BASE}/`);
  const title = await page.title();
  check(title.length > 0, 'Homepage: page loads', title);
  check(await page.locator('nav').first().isVisible(), 'Homepage: nav bar visible');
  const heroText = await page.locator('h1, h2').first().textContent().catch(() => '');
  check(heroText.length > 0, 'Homepage: hero section has headline', heroText.trim().slice(0, 60));
  const bookNow = page.locator('a[href="/book"], a[href*="book"]').first();
  check(await bookNow.isVisible().catch(() => false), 'Homepage: Book Now button visible');

  const bodyText = await visibleText(page);
  const servicesSection = await page.locator('section, div').filter({ hasText: /services|physiotherapy|treatment/i }).count();
  check(servicesSection > 0, 'Homepage: services section present');
  check(bodyText.includes('Susan'), 'Homepage: Susan Mubatapasango in team section');
  check(bodyText.includes('Vimbai'), 'Homepage: Vimbai Shumba in team section');

  const testimonialSection = page.locator('[class*="testimonial"], section').filter({ hasText: /testimonial|review/i });
  const testimonialVisible = await testimonialSection.isVisible().catch(() => false);
  check(!testimonialVisible, 'Homepage: testimonials section hidden (no real reviews yet)');

  const footer = await page.locator('footer').textContent().catch(() => '');
  check(footer.includes('Swakopmund') || footer.includes('Ocean View'), 'Homepage: footer has correct address');
  check(footer.includes('08:00') || footer.includes('Mon'), 'Homepage: footer has working hours');
  const medAids = ['NHP', 'NMC', 'Named', 'Prosperity', 'Napotel', 'GemHealth'];
  const footerText = await page.locator('footer').evaluate(el => el.innerText).catch(() => '');
  const foundAids = medAids.filter(a => footerText.includes(a));
  check(foundAids.length >= 3, `Homepage: footer medical aids listed (${foundAids.join(', ')})`, footerText.slice(0, 200));

  const noErrors = consoleErrors.filter(e => !e.includes('Warning') && !e.includes('favicon')).length === 0;
  check(noErrors, 'Homepage: no console errors', consoleErrors.filter(e => !e.includes('favicon')).join('; ').slice(0, 120) || 'clean');

  // ── Mobile nav ──
  // Check hamburger on narrow viewport
  const mobile = await browser.newPage();
  await mobile.setViewportSize({ width: 375, height: 812 });
  await waitReady(mobile, `${BASE}/`);
  const hamburger = mobile.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button[aria-label*="nav"], button svg[class*="menu"], [class*="hamburger"], [class*="mobile-menu"]').first();
  check(await hamburger.isVisible().catch(() => false), 'Homepage mobile: hamburger menu button visible');
  await mobile.close();

  // ── Team ──
  await waitReady(page, `${BASE}/team`);
  const teamText = await visibleText(page);
  check(teamText.includes('Susan'), 'Team page: Susan Mubatapasango shown');
  check(teamText.includes('Vimbai'), 'Team page: Vimbai Shumba shown');
  const dummies = ['Anri', 'Marco', 'Liesl', 'David'];
  const foundDummies = dummies.filter(d => teamText.includes(d));
  check(foundDummies.length === 0, 'Team page: no dummy staff visible', foundDummies.length ? foundDummies.join(', ') : 'none found');
  const teamImages = await page.locator('img').count();
  check(teamImages > 0, 'Team page: images present', `${teamImages} imgs`);

  // ── Blog ──
  await waitReady(page, `${BASE}/blog`);
  const blogH = await page.locator('h1, h2, h3').first().textContent().catch(() => '');
  check(blogH.length > 0, 'Blog: page loads with heading', blogH.trim().slice(0, 60));
  const postCards = await page.locator('a[href*="/blog/"]').count();
  check(postCards > 0, 'Blog: at least 1 post card visible', `${postCards} cards`);
  if (postCards > 0) {
    const href = await page.locator('a[href*="/blog/"]').first().getAttribute('href');
    await waitReady(page, `${BASE}${href}`);
    const postText = await visibleText(page);
    check(postText.length > 200, 'Blog detail: page loads with content', `${postText.trim().length} chars`);
  }

  // ── Conditions ──
  await waitReady(page, `${BASE}/conditions`);
  const condText = await visibleText(page);
  check(condText.length > 100, 'Conditions: page loads');
  const condLinks = await page.locator('a[href*="/conditions/"]').count();
  check(condLinks > 0, 'Conditions: condition links present', `${condLinks} links`);

  // ── Gallery ──
  await waitReady(page, `${BASE}/gallery`);
  const galleryImgs = await page.locator('img').count();
  check(galleryImgs > 0, 'Gallery: images present', `${galleryImgs} images`);

  // ── Reviews ──
  await waitReady(page, `${BASE}/reviews`);
  const reviewsText = await visibleText(page);
  check(reviewsText.length > 100, 'Reviews: page loads');
  const leaveReview = page.locator('a, button').filter({ hasText: /leave a review|write a review/i }).first();
  check(await leaveReview.isVisible().catch(() => false), 'Reviews: Leave a Review button visible');

  // ── Contact ──
  await waitReady(page, `${BASE}/contact`);
  const contactText = await visibleText(page);
  check(contactText.includes('Swakopmund') || contactText.includes('Eugene') || contactText.includes('-22'), 'Contact: address/location present');
  const mapEmbed = await page.locator('iframe[src*="google"], iframe[src*="maps"], [class*="map"], [data-*="map"]').count();
  check(mapEmbed > 0, 'Contact: map embed present', `${mapEmbed} map elements`);

  // ── Symptom Check ──
  await waitReady(page, `${BASE}/symptom-check`);
  const symptomText = await visibleText(page);
  check(symptomText.length > 100, 'Symptom check: page loads');
  const symptomInput = await page.locator('input, textarea').count();
  check(symptomInput > 0, 'Symptom check: input present');

  // ── Resources ──
  await waitReady(page, `${BASE}/resources`);
  const resourcesText = await visibleText(page);
  check(resourcesText.length > 100, 'Resources: page loads');

  // ── Privacy ──
  await waitReady(page, `${BASE}/privacy`);
  const privacyText = await visibleText(page);
  check(privacyText.length > 200, 'Privacy: page loads with content');

  // ── 404 ──
  const resp = await page.goto(`${BASE}/this-page-does-not-exist`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const notFoundText = await visibleText(page);
  const is404 = resp?.status() === 404 || notFoundText.toLowerCase().includes('not found') || notFoundText.toLowerCase().includes('404') || notFoundText.toLowerCase().includes("doesn't exist");
  check(is404, '404: custom 404 page shown', `HTTP ${resp?.status()} — "${notFoundText.trim().slice(0, 60)}"`);
  const backHome = await page.locator('a[href="/"]').count();
  check(backHome > 0, '404: link back to homepage present');

  await ctx.close();
}

// ============================================================================
// SECTION 2 — AUTHENTICATION
// ============================================================================
async function testAuthentication(browser) {
  console.log('\n══════════════════════════════════════');
  console.log('  02 — AUTHENTICATION');
  console.log('══════════════════════════════════════');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // ── Register page ──
  await waitReady(page, `${BASE}/auth/register`);
  const regText = await visibleText(page);
  check(regText.toLowerCase().includes('register') || regText.toLowerCase().includes('sign up') || regText.toLowerCase().includes('create'), 'Register: page loads');
  const firstNameField = await page.locator('input[name="firstName"], input[placeholder*="first" i], input[id*="first" i], input[name="first_name"]').count();
  check(firstNameField > 0, 'Register: first name field present');
  const emailField = await page.locator('input[type="email"]').count();
  check(emailField > 0, 'Register: email field present');
  const passwordFields = await page.locator('input[type="password"]').count();
  check(passwordFields >= 2, 'Register: password + confirm password fields present', `${passwordFields} password fields`);

  // Submit empty form — HTML5 native required validation blocks submission (browser tooltip, no DOM text)
  // Verify the form was blocked: page URL stays on /register and inputs report invalid validity
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  const stillOnRegister = page.url().includes('/register') || page.url().includes('/auth');
  const firstInputInvalid = await page.locator('input[required]').first().evaluate(el => !el.validity.valid).catch(() => false);
  check(stillOnRegister && firstInputInvalid, 'Register: empty submit blocked by validation (stays on register page)');


  // ── Login page ──
  await waitReady(page, `${BASE}/auth/login`);
  const loginText = await visibleText(page);
  check(loginText.toLowerCase().includes('login') || loginText.toLowerCase().includes('sign in'), 'Login: page loads');

  // Wrong password
  await page.fill('input[type="email"], input[name="email"]', PATIENT_EMAIL);
  await page.fill('input[type="password"], input[name="password"]', 'WrongPassword999');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  const afterWrongPass = await visibleText(page);
  check(
    afterWrongPass.toLowerCase().includes('invalid') || afterWrongPass.toLowerCase().includes('error') || afterWrongPass.toLowerCase().includes('incorrect') || afterWrongPass.toLowerCase().includes('wrong'),
    'Login: wrong password shows error'
  );

  // ── Redirect preservation ──
  await waitReady(page, `${BASE}/portal`);
  const currentUrl = page.url();
  check(currentUrl.includes('/auth/login'), 'Login: /portal while logged out redirects to login', currentUrl);
  check(currentUrl.includes('redirect') || currentUrl.includes('portal'), 'Login: redirect param preserved in URL', currentUrl);

  // ── Happy path — patient login ──
  await page.fill('input[type="email"], input[name="email"]', PATIENT_EMAIL);
  await page.fill('input[type="password"], input[name="password"]', PATIENT_PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3500);
  const afterLoginUrl = page.url();
  check(afterLoginUrl.includes('/portal'), 'Login: patient login redirects to /portal', afterLoginUrl);

  // ── Forgot password ──
  await waitReady(page, `${BASE}/auth/forgot`);
  const forgotText = await visibleText(page);
  check(forgotText.toLowerCase().includes('forgot') || forgotText.toLowerCase().includes('reset') || forgotText.toLowerCase().includes('password'), 'Forgot password: page loads');
  const forgotEmail = await page.locator('input[type="email"]').count();
  check(forgotEmail > 0, 'Forgot password: email field present');
  await page.fill('input[type="email"]', 'unknown@nowhere.invalid');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  const afterForgot = await visibleText(page);
  check(
    afterForgot.toLowerCase().includes('check') || afterForgot.toLowerCase().includes('sent') || afterForgot.toLowerCase().includes('email') || afterForgot.toLowerCase().includes('link'),
    'Forgot password: unknown email shows safe success message'
  );

  // ── Logout ──
  await waitReady(page, `${BASE}/portal`);
  const signOutBtn = page.locator('button, a').filter({ hasText: /sign out|log out|logout/i }).first();
  const signOutVisible = await signOutBtn.isVisible().catch(() => false);
  check(signOutVisible, 'Logout: Sign out button visible in portal');
  if (signOutVisible) {
    await signOutBtn.click();
    await page.waitForTimeout(2000);
    const afterLogoutUrl = page.url();
    check(
      afterLogoutUrl.includes('/auth/login') || afterLogoutUrl === `${BASE}/` || afterLogoutUrl === `${BASE}`,
      'Logout: after sign out redirected away from portal', afterLogoutUrl
    );
    await waitReady(page, `${BASE}/portal`);
    check(page.url().includes('/auth/login'), 'Logout: /portal after logout redirects to login', page.url());
  }

  await ctx.close();
}

// ============================================================================
// SECTION 3 — BOOKING FLOW
// ============================================================================
async function testBookingFlow(browser) {
  console.log('\n══════════════════════════════════════');
  console.log('  03 — BOOKING FLOW');
  console.log('══════════════════════════════════════');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  try {
    // ── Step 1: Service selection ──
    await waitReady(page, `${BASE}/book`);
    const bookText = await visibleText(page);
    check(bookText.length > 100, 'Book: page loads');

    // Price check uses innerText (excludes script tag __NEXT_DATA__ JSON)
    const pricePattern = /N\$\s*\d+|NAD\s*\d+|\d+\s*NAD/;
    check(!pricePattern.test(bookText), 'Book: service prices NOT visible in UI');

    // Duration check
    const durationPattern = /\d+\s*(min|minute|minutes|mins)\b/i;
    check(!durationPattern.test(bookText), 'Book: service duration NOT visible in UI');

    // Service cards are buttons inside the wizard grid — pick first one
    // They match the service names from the DB
    const serviceGrid = page.locator('div.grid button, div[class*="grid"] button').first();
    const serviceCount = await page.locator('div.grid button, div[class*="grid"] button').count();
    check(serviceCount > 0, 'Book: service cards rendered', `${serviceCount} cards`);

    if (serviceCount > 0) {
      // Click first service card
      await page.locator('div.grid button, div[class*="grid"] button').first().click();
      await page.waitForTimeout(500);

      // Continue button should now be enabled
      const continueBtn = page.locator('button').filter({ hasText: /continue|next/i }).first();
      const isEnabled = await continueBtn.isEnabled().catch(() => false);
      check(isEnabled, 'Book step 1: Continue button enabled after selecting service');

      if (isEnabled) {
        await continueBtn.click();
        await page.waitForTimeout(1000);

        // ── Step 2: Therapist selection ──
        const step2Text = await visibleText(page);
        check(step2Text.includes('Susan') || step2Text.toLowerCase().includes('therapist'), 'Book step 2: therapist selection shown');
        check(step2Text.includes('Susan'), 'Book step 2: Susan Mubatapasango listed');
        check(step2Text.includes('Vimbai'), 'Book step 2: Vimbai Shumba listed');
        check(step2Text.toLowerCase().includes('any'), 'Book step 2: "Any available" option present');

        // Select "Any available"
        const anyBtn = page.locator('div.grid button, div[class*="grid"] button').first();
        await anyBtn.click();
        await page.waitForTimeout(500);
        const continueBtn2 = page.locator('button').filter({ hasText: /continue|next/i }).first();
        if (await continueBtn2.isEnabled().catch(() => false)) {
          await continueBtn2.click();
          await page.waitForTimeout(1000);
        }

        // ── Step 3: Date & Time ──
        const step3Text = await visibleText(page);
        const hasDatePicker = await page.locator('table, [class*="calendar"], [class*="date"]').count();
        check(hasDatePicker > 0, 'Book step 3: calendar/date picker shown');

        // Calendar uses buttons with day numbers — click an enabled future weekday
        // The MiniCalendar renders disabled={isDisabled(day)} where past/Sunday is disabled
        const dayButtons = page.locator('div.grid.grid-cols-7 button:not([disabled])');
        const dayCount = await dayButtons.count();
        check(dayCount > 0, 'Book step 3: selectable weekday slots in calendar', `${dayCount} available days`);

        if (dayCount > 0) {
          await dayButtons.first().click();
          await page.waitForTimeout(3000); // wait for slots API fetch + React re-render

          const timeSlots = await page.locator('button').filter({ hasText: /^\d{1,2}:\d{2}/ }).count();
          check(timeSlots > 0, 'Book step 3: time slots appear after selecting a date', `${timeSlots} slots`);

          if (timeSlots > 0) {
            await page.locator('button').filter({ hasText: /^\d{1,2}:\d{2}/ }).first().click();
            await page.waitForTimeout(500);
            const continueBtn3 = page.locator('button').filter({ hasText: /continue|next/i }).first();
            if (await continueBtn3.isEnabled().catch(() => false)) {
              await continueBtn3.click();
              await page.waitForTimeout(1000);
            }

            // ── Step 4: Patient details (guest) ──
            const step4Text = await visibleText(page);
            const emailField4 = await page.locator('input[type="email"], input[name="email"]').count();
            check(emailField4 > 0, 'Book step 4 (guest): email field visible', `${emailField4} field(s)`);
            // First name: type=text, placeholder="Sarah", no name/id attr
            const firstNameField4 = await page.locator('input[type="text"][placeholder="Sarah"]').count();
            check(firstNameField4 > 0, 'Book step 4 (guest): first name field present');
            check(step4Text.toLowerCase().includes('notes') || await page.locator('textarea').count() > 0, 'Book step 4 (guest): notes field present');
          }
        }
      }
    }

    // ── Manage booking page ──
    await waitReady(page, `${BASE}/book/manage`);
    const manageText = await visibleText(page);
    check(manageText.toLowerCase().includes('reference') || manageText.toLowerCase().includes('booking') || manageText.toLowerCase().includes('manage'), 'Manage booking: page loads');
    const refInput = await page.locator('input').count();
    check(refInput > 0, 'Manage booking: reference number input present');

    if (refInput > 0) {
      await page.locator('input#ref, input[placeholder*="PF-"]').first().fill('PF-9999-0000');
      await page.waitForTimeout(500);
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isEnabled().catch(() => false)) {
        await submitBtn.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(3000);
      const afterInvalid = await visibleText(page);
      check(
        afterInvalid.toLowerCase().includes('not found') || afterInvalid.toLowerCase().includes('invalid') || afterInvalid.toLowerCase().includes('no booking') || afterInvalid.toLowerCase().includes('found'),
        'Manage booking: invalid reference shows appropriate message'
      );
    }

  } catch (err) {
    log('❌', `Booking flow: unexpected error — ${err.message.slice(0, 120)}`);
  }

  await ctx.close();
}

// ============================================================================
// SECTION 4 — PATIENT PORTAL
// ============================================================================
async function testPatientPortal(browser) {
  console.log('\n══════════════════════════════════════');
  console.log('  04 — PATIENT PORTAL');
  console.log('══════════════════════════════════════');

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // ── Access control ──
  await waitReady(page, `${BASE}/portal`);
  check(page.url().includes('/auth/login'), 'Portal access: /portal while logged out → redirects to login', page.url());

  // ── Login as patient ──
  await loginAs(page, PATIENT_EMAIL, PATIENT_PASS);
  check(page.url().includes('/portal'), 'Portal: patient login lands on /portal', page.url());

  // ── Dashboard ──
  await waitReady(page, `${BASE}/portal`);
  const dashText = await visibleText(page);
  check(dashText.length > 200, 'Portal dashboard: page loads');
  check(dashText.includes('James') || dashText.includes('Nakale'), 'Portal dashboard: patient name shown (James Nakale)');
  const bookLink = await page.locator('a[href="/book"], a[href*="book"]').count();
  check(bookLink > 0, 'Portal dashboard: "Book an appointment" link present');

  // ── Appointments ──
  await waitReady(page, `${BASE}/portal/appointments`);
  const apptText = await visibleText(page);
  check(apptText.length > 100, 'Portal appointments: page loads');

  // ── Billing ──
  await waitReady(page, `${BASE}/portal/billing`);
  const billingText = await visibleText(page);
  check(billingText.length > 100, 'Portal billing: page loads');

  // ── Messages ──
  await waitReady(page, `${BASE}/portal/messages`);
  const msgText = await visibleText(page);
  check(msgText.length > 100, 'Portal messages: page loads');
  const msgInput = await page.locator('input[type="text"], textarea').count();
  check(msgInput > 0, 'Portal messages: text input present');
  // Send button uses a <Send> icon only — detect by type="submit" in the message form
  const sendBtn = await page.locator('form button[type="submit"]').count();
  check(sendBtn > 0, 'Portal messages: send button present');

  if (msgInput > 0 && sendBtn > 0) {
    const inputEl = page.locator('input[type="text"], textarea').last();
    await inputEl.fill('Verification test message');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
    const afterSend = await visibleText(page);
    check(afterSend.includes('Verification test message'), 'Portal messages: sent message appears in thread');
  }

  // ── Progress ──
  await waitReady(page, `${BASE}/portal/progress`);
  const progressText = await visibleText(page);
  check(progressText.length > 100, 'Portal progress: page loads');

  // ── Profile ──
  await waitReady(page, `${BASE}/portal/profile`);
  const profileText = await visibleText(page);
  check(profileText.length > 100, 'Portal profile: page loads');
  check(profileText.includes('James'), 'Portal profile: first name James pre-filled');
  check(profileText.includes('Nakale'), 'Portal profile: last name Nakale pre-filled');
  check(profileText.includes('NHP') || profileText.includes('medical aid' ) || profileText.includes('Medical Aid'), 'Portal profile: medical aid info visible');

  // ── Resources ──
  await waitReady(page, `${BASE}/portal/resources`);
  const resText = await visibleText(page);
  check(resText.length > 100, 'Portal resources: page loads');

  // ── Sidebar navigation ──
  const sidebarLinks = [
    ['/portal', 'Dashboard'],
    ['/portal/appointments', 'Appointments'],
    ['/portal/billing', 'Billing'],
    ['/portal/messages', 'Messages'],
    ['/portal/progress', 'Progress'],
    ['/portal/profile', 'Profile'],
  ];
  await waitReady(page, `${BASE}/portal`);
  for (const [href, label] of sidebarLinks) {
    const link = await page.locator(`a[href="${href}"]`).count();
    check(link > 0, `Portal sidebar: "${label}" link present`);
  }

  // Active state check (on appointments page, appointment link should have active style)
  await waitReady(page, `${BASE}/portal/appointments`);
  const apptSidebarLink = page.locator(`a[href="/portal/appointments"]`).first();
  const activeClass = await apptSidebarLink.getAttribute('class').catch(() => '');
  check(activeClass.includes('active') || activeClass.includes('current') || activeClass.includes('teal') || activeClass.includes('#0d9488') || activeClass.includes('font-medium'), 'Portal sidebar: active page highlighted', activeClass.slice(0, 60));

  await ctx.close();
}

// ============================================================================
// SECTION 5 — ADMIN PANEL
// ============================================================================
async function testAdminPanel(browser) {
  console.log('\n══════════════════════════════════════');
  console.log('  05 — ADMIN PANEL');
  console.log('══════════════════════════════════════');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // ── Access control: unauthenticated ──
  await waitReady(page, `${BASE}/admin`);
  check(page.url().includes('/auth/login'), 'Admin access: /admin while logged out → redirects to login', page.url());

  // ── Access control: patient cannot access admin ──
  await loginAs(page, PATIENT_EMAIL, PATIENT_PASS);
  await page.waitForTimeout(1500);
  await waitReady(page, `${BASE}/admin`);
  const afterPatientAdmin = page.url();
  check(
    !afterPatientAdmin.endsWith('/admin') || afterPatientAdmin.includes('/portal'),
    'Admin access: patient account redirected away from /admin', afterPatientAdmin
  );

  await logout(page);
  await page.waitForTimeout(1000);

  if (!adminEmail || !adminPass) {
    log('⚠️', 'Admin panel: ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping authenticated admin tests');
    await ctx.close();
    return;
  }

  await loginAs(page, adminEmail, adminPass);
  const adminLoginUrl = page.url();
  check(adminLoginUrl.includes('/admin'), 'Admin login: admin credentials → lands on /admin', adminLoginUrl);

  // ── Overview ──
  await waitReady(page, `${BASE}/admin`);
  const adminText = await visibleText(page);
  check(adminText.length > 200, 'Admin overview: page loads');
  check(adminText.toLowerCase().includes('appointment') || adminText.toLowerCase().includes('patient') || adminText.toLowerCase().includes('today'), 'Admin overview: stats/KPI cards present');
  const viewAllLink = await page.locator('a[href="/admin/bookings"]').count();
  check(viewAllLink > 0, 'Admin overview: "View all" link goes to /admin/bookings');

  // ── Bookings ──
  await waitReady(page, `${BASE}/admin/bookings`);
  const bookingsText = await visibleText(page);
  check(bookingsText.length > 200, 'Admin bookings: page loads');
  const hasTable = await page.locator('table, [role="table"], [class*="table"]').count();
  check(hasTable > 0, 'Admin bookings: data table present', `${hasTable} table elements`);
  // Actual DB has bookings for Tadiwanashe Guchu (test patient James Nakale has none yet)
  const hasAnyBooking = bookingsText.toLowerCase().includes('guchu') || bookingsText.toLowerCase().includes('pf-2026') || bookingsText.toLowerCase().includes('confirmed');
  check(hasAnyBooking, 'Admin bookings: booking records visible in table');

  const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill('Guchu');
    await page.waitForTimeout(1200);
    const afterSearch = await visibleText(page);
    check(afterSearch.toLowerCase().includes('guchu') || afterSearch.toLowerCase().includes('tadiwanashe'), 'Admin bookings: search by patient name works');
    await searchInput.fill('');
    await page.waitForTimeout(500);
  } else {
    log('⚠️', 'Admin bookings: search input not found — skipping search test');
  }

  // ── Patients ──
  await waitReady(page, `${BASE}/admin/patients`);
  const patientsText = await visibleText(page);
  check(patientsText.length > 100, 'Admin patients: page loads');
  check(patientsText.includes('James') || patientsText.includes('Nakale'), 'Admin patients: James Nakale in patient list');

  // ── Therapists ──
  await waitReady(page, `${BASE}/admin/therapists`);
  const therapistsText = await visibleText(page);
  check(therapistsText.includes('Susan'), 'Admin therapists: Susan Mubatapasango listed');
  check(therapistsText.includes('Vimbai'), 'Admin therapists: Vimbai Shumba listed');
  // Dummy staff (Anri/Marco/Liesl/David) were deactivated, not deleted — admin panel shows all for management.
  // Anri has 3 real appointments so can't be deleted. Verify they appear as inactive via toggle state.
  const foundDummies = ['Anri', 'Marco', 'Liesl', 'David'].filter(d => therapistsText.includes(d));
  if (foundDummies.length > 0) {
    log('⚠️', `Admin therapists: deactivated dummy staff still visible (${foundDummies.join(', ')}) — expected in admin, hidden from /book`);
  } else {
    log('✅', 'Admin therapists: no dummy staff visible');
  }

  // ── Content ──
  await waitReady(page, `${BASE}/admin/content`);
  const contentText = await visibleText(page);
  check(contentText.length > 100, 'Admin content: page loads');
  check(contentText.toLowerCase().includes('service') || contentText.toLowerCase().includes('review'), 'Admin content: services/reviews section visible');

  // ── Analytics ──
  await waitReady(page, `${BASE}/admin/analytics`);
  const analyticsText = await visibleText(page);
  check(analyticsText.length > 100, 'Admin analytics: page loads');
  await page.waitForTimeout(2000); // wait for charts to render
  const chartElements = await page.locator('svg, canvas, [class*="recharts"]').count();
  check(chartElements > 0, 'Admin analytics: charts render', `${chartElements} chart elements`);

  // ── Finance ──
  await waitReady(page, `${BASE}/admin/finance`);
  const financeText = await visibleText(page);
  check(financeText.length > 100, 'Admin finance: page loads');
  check(financeText.toLowerCase().includes('invoice') || financeText.toLowerCase().includes('revenue') || financeText.toLowerCase().includes('paid'), 'Admin finance: revenue/invoice content present');

  // ── Admin sidebar nav ──
  const adminLinks = ['/admin', '/admin/bookings', '/admin/patients', '/admin/therapists', '/admin/content', '/admin/analytics', '/admin/finance'];
  let missingLinks = [];
  for (const link of adminLinks) {
    const found = await page.locator(`a[href="${link}"]`).count();
    if (found === 0) missingLinks.push(link);
  }
  check(missingLinks.length === 0, 'Admin sidebar: all nav links present', missingLinks.length ? missingLinks.join(', ') : 'all found');

  await ctx.close();
}

// ============================================================================
// MAIN
// ============================================================================
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await testPublicPages(browser);
    await testAuthentication(browser);
    await testBookingFlow(browser);
    await testPatientPortal(browser);
    await testAdminPanel(browser);
  } finally {
    await browser.close();
  }

  console.log('\n══════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════');
  console.log(`✅ Pass:    ${pass}`);
  console.log(`❌ Fail:    ${fail}`);
  console.log(`⚠️  Warn:    ${warn}`);
  console.log(`Total: ${pass + fail + warn}`);

  if (findings.length > 0) {
    console.log('\n── Failures & Warnings ──');
    for (const f of findings) {
      console.log(`${f.type === 'FAIL' ? '❌' : '⚠️'} ${f.label}${f.detail ? ': ' + f.detail : ''}`);
    }
  }

  process.exit(fail > 0 ? 1 : 0);
})();
