// backend/seed.js
// Run with: node seed.js
// WARNING: This will clear and re-seed Projects, Skills, and Profile.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Admin = require('./models/Admin');

const ADMIN_EMAIL = 'admin@methulgunasekara.com';
const ADMIN_PASSWORD = 'ChangeMe123!'; // Change before production

// ─── PROFILE ─────────────────────────────────────────────────────────────────

const profileData = {
  fullName: 'Methul Gunasekara',
  jobTitle: 'Business Analyst · Product Owner · Full-Stack Developer',
  bio: `Second-year IT undergraduate at SLIIT with a Commerce background (Business Studies, Accounting). I independently delivered three end-to-end product specifications — a multi-tenant SaaS boarding platform, a tourism booking engine, and a workshop operations system — each backed by real stakeholder requirements gathering, formal user-story documentation, explicit in/out-of-scope definitions, and deployed live products. Hands-on MERN/Next.js development experience enables direct, credible collaboration with engineering teams when translating business needs into technical specifications.`,
  githubUrl: 'https://github.com/MethulGunasekara',
  linkedinUrl: 'https://linkedin.com/in/methul-gunasekara',
  resumeUrl: '',       // Add your Cloudinary PDF URL after uploading
  heroImageUrl: '',    // Add your photo URL after uploading
  accentColor: '#00E5A0',
};

// ─── SKILLS ──────────────────────────────────────────────────────────────────

const skillsData = [
  // Frontend
  { name: 'React', category: 'Frontend', iconClass: 'ri-reactjs-line', proficiency: 85 },
  { name: 'Next.js', category: 'Frontend', iconClass: 'ri-layout-line', proficiency: 78 },
  { name: 'JavaScript', category: 'Frontend', iconClass: 'ri-javascript-line', proficiency: 85 },
  { name: 'HTML / CSS', category: 'Frontend', iconClass: 'ri-html5-line', proficiency: 90 },
  { name: 'Figma', category: 'Frontend', iconClass: 'ri-pencil-ruler-2-line', proficiency: 70 },
  // Backend
  { name: 'Node.js', category: 'Backend', iconClass: 'ri-server-line', proficiency: 80 },
  { name: 'Express', category: 'Backend', iconClass: 'ri-code-s-slash-line', proficiency: 80 },
  { name: 'MongoDB', category: 'Backend', iconClass: 'ri-database-2-line', proficiency: 78 },
  { name: 'REST API Design', category: 'Backend', iconClass: 'ri-links-line', proficiency: 82 },
  // Tools
  { name: 'Git / GitHub', category: 'Tools', iconClass: 'ri-git-branch-line', proficiency: 80 },
  { name: 'Cloudinary', category: 'Tools', iconClass: 'ri-cloud-line', proficiency: 72 },
  { name: 'Vercel / Render', category: 'Tools', iconClass: 'ri-rocket-line', proficiency: 75 },
  // BA / PM
  { name: 'Requirements Engineering', category: 'Design', iconClass: 'ri-file-list-3-line', proficiency: 88 },
  { name: 'User Story Authoring', category: 'Design', iconClass: 'ri-user-voice-line', proficiency: 88 },
  { name: 'Agile / Scrum', category: 'Design', iconClass: 'ri-loop-left-line', proficiency: 78 },
  { name: 'Process Mapping', category: 'Design', iconClass: 'ri-flow-chart', proficiency: 82 },
];

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

const projectsData = [
  // ── 1. Boarding Management System ──────────────────────────────────────────
  {
    title: 'Boarding Management System',
    tagline: 'Multi-tenant SaaS digitising boarding-house operations across 3 stakeholder roles.',
    shortDescription: 'A multi-tenant SaaS platform replacing paper-based rent tracking, bill splitting, and tenant admission for boarding house owners — built from first-hand domain knowledge.',
    category: 'BA Case Study',
    description: `A multi-tenant SaaS platform that digitises boarding-house operations across three stakeholder roles: Platform Admin, Boarding Owner, and Tenant. The product was specified and built from first-hand requirements analysis — I operate a live boarding house — which allowed contextual domain knowledge to drive every design decision rather than assumptions.

The system handles digital tenant admission (with NIC photo capture and digital signatures), a configurable rent and cost-allocation engine (even-split or custom percentage-based), key money (deposit) tracking with automatic refund eligibility calculation, and a daily SMS/push notification reminder pipeline.`,

    problemStatement: `Boarding houses in Sri Lanka are typically run manually: paper admission forms, rent collected via cash/WhatsApp receipts, mental tracking of who has paid, and ad-hoc splitting of electricity/water bills. This causes missed payments, disputes over bill splits, lost paperwork, and no historical record if a dispute arises.`,

    solution: `Built a lightweight platform where boarding owners manage tenant admissions, rent, and shared costs digitally. Three key design decisions driven by domain analysis:

1. Rolling 30-day billing cycle (admission-date-anchored, not calendar-month) — a generic monthly cycle produces incorrect due dates, a detail a non-domain analyst would miss.
2. Configurable cost-allocation model supporting both even-split and custom percentage-based splitting, validated to sum to 100% — identified after analysing how real shared utility bills create tenant disputes.
3. Tenure-based deposit refund eligibility modelled as a separate data entity so eligibility is calculated automatically rather than by mental arithmetic.`,

    outcomes: `Live pilot running on the family boarding house. Eliminated paper admission forms, dispute-prone manual bill splits, and missed rent reminders. The risk register and explicit in/out-of-scope boundary (excluding payment gateway, biometric admission, marketplace) were maintained throughout delivery.`,

    documentation: `SCOPE
Phase 1 MVP: Platform Admin onboarding, Owner: room/tenant management, rent & cost engine, key money tracking, manual payment recording, automated reminders, overdue flagging. Tenant: SMS notification only (no tenant login in Phase 1).

OUT OF SCOPE (documented with reasoning):
- Marketplace/listing site: separate product vertical, not a boarding management feature
- Online rent payment gateway: avoids PCI compliance and transaction fees while revenue model is unproven
- Biometric admission: hardware cost conflicts with cost-efficiency requirement
- WhatsApp Business API: Phase 2 enhancement

BILLING LOGIC:
Each tenant's cycle starts on their admission date. Every cycle is a rolling 30 days from there — not the calendar month. This is the detail that makes due-date and reminder logic correct.

COST SPLIT LOGIC:
Model a Cost with splitType: EVEN | CUSTOM. Even split auto-divides by active tenant count in the room. Custom split stores a percentage per tenant, validated to sum to 100% before saving. Each cost generates individual per-tenant charge records so balances stay traceable.

KEY MONEY:
Modelled as its own entity: amount, date collected, minimum stay required, auto-calculated refund-eligible date, status (held/refunded/forfeited). The system surfaces eligibility; the owner makes the final call on deductions for damage.

NOTIFICATION COST STRATEGY:
Push notifications (Firebase Cloud Messaging — free) reserved for all owner-side alerts. Paid SMS scoped only to tenant reminders, reducing running cost to near zero except per-SMS charges.`,

    documentationUrl: 'https://boarding-management-system.vercel.app',
    liveLink: 'https://boarding-management-system.vercel.app',
    githubLink: 'https://github.com/MethulGunasekara',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'React Native', 'Cloudinary', 'Firebase FCM', 'node-cron'],
    keyFeatures: [
      'Digital tenant admission with NIC photo capture and signature pad',
      'Rolling 30-day billing cycle anchored to admission date (not calendar month)',
      'Even-split and custom percentage-based shared cost allocation (validated to 100%)',
      'Key money deposit tracking with automatic refund eligibility calculation',
      'Daily SMS reminders for tenants + free push notifications for owners',
      'Platform Admin dashboard with subscription management across all boarding places',
      'Overdue tenant flagging with platform-wide visibility for Admin',
      'Manual payment recording (cash / bank transfer / other) with receipt photo upload',
    ],
    myRole: 'Business Analyst / Product Owner / Full-Stack Developer (solo)',
    teamSize: 'Solo',
    duration: '2024 – Present',
    methodology: 'Agile (self-managed sprints)',
    problemStatement: `Boarding houses in Sri Lanka are run manually — paper admission forms, mental rent tracking, ad-hoc bill splits, no historical records. This causes missed payments, billing disputes, and lost paperwork.`,
    previewImages: [],
    videoUrl: '',
  },

  // ── 2. Edward Tours & Travels ───────────────────────────────────────────────
  {
    title: 'Edward Tours & Travels',
    tagline: 'Conversion-focused tour-operator website + booking engine for a live Sri Lankan business.',
    shortDescription: 'A full booking engine for a first-time tour operator entering the market, enabling foreign tourists to discover packages and pay deposits online via a CBSL-regulated payment gateway.',
    category: 'BA Case Study',
    description: `A conversion-focused tour-operator website and booking engine built for a first-time small-business owner (my father) entering the Sri Lankan tourism market. Foreign tourists can discover curated packages with day-by-day itineraries, rich photo/video galleries, and group-size pricing — then secure their dates by paying a deposit through PayHere, a CBSL-regulated Sri Lankan payment gateway.

The project combined two distinct requirements-gathering methods: direct stakeholder interviews with the business owner, and competitive benchmarking of two established Sri Lankan tour operators (visitsrilankatours.com, holidaylankatours.com).`,

    problemStatement: `A first-time tour guide has no digital presence, no way to accept international payments, and no way to showcase packages professionally against established competitors. Foreign tourists expect rich visual content, clear pricing, and a trustworthy way to pay a deposit online before meeting the operator in person.`,

    solution: `Built a Next.js SSR public site (for SEO — organic international discovery is the core business objective, which directly drove the architecture choice over a client-rendered SPA) with a PayHere-integrated deposit-based booking flow and a non-technical admin CMS for the business owner.

Key decisions:
1. PayHere over Stripe — selected based on regulatory fit (CBSL/BR requirements for a Sri Lankan business accepting foreign card payments), not developer preference. Stripe cannot pay out to a Sri Lankan bank account.
2. Deposit-based model (not full prepayment) — balances customer trust, chargeback risk, and operational maturity for a brand-new merchant account.
3. SSR via Next.js — linked directly to Epic E (organic international discovery): an SPA with no server-rendered HTML would actively hurt the business goal.`,

    outcomes: `Live site deployed for the business. PayHere merchant account active. Organic SEO in place with schema.org structured data, sitemap.xml, and Next.js image optimization. Admin can independently manage packages, photos, videos, and testimonials without developer involvement.`,

    documentation: `SCOPE
Phase 1 MVP: Public marketing site (SSR), package detail pages with itinerary/gallery/video/pricing, inquiry form, deposit payment via PayHere, admin CMS for packages/media/testimonials/inquiries.

OUT OF SCOPE (documented with reasoning):
- Full online checkout (100% of tour cost): chargeback/dispute risk unacceptable for a brand-new merchant account
- Multi-language site: English-only for MVP; Sinhala/German/French deferred to Phase 2
- Real-time availability calendar: operator cannot yet guarantee live inventory against hotels/vans he doesn't control
- Guide marketplace: single-operator site by design; marketplace is a materially different product

PAYMENT GATEWAY DECISION:
PayHere (not Stripe). Stripe cannot pay out to a Sri Lankan bank account. PayHere is CBSL-regulated, accepts international cards, and settles in LKR — correct fit for a Sri Lankan business with a BR accepting foreign tourists.

DEPOSIT MODEL:
Agreed price → required deposit (25–30%) paid via PayHere → balance settled by bank transfer/cash before or during the tour. Avoids refund/chargeback exposure on a new merchant account. Idempotent webhook handler: a booking must never be double-confirmed if PayHere retries the notification.

PACKAGE DATA STRUCTURE:
Package → many ItineraryDay (dayNumber, title, description, meals, overnightLocation)
        → many PricingTier (groupSizeLabel, minPax, maxPax, pricePerPersonUSD)
        → many MediaAsset (type, cloudinaryUrl, sortOrder, isHero)

SEO ARCHITECTURE:
Next.js SSR/SSG for public pages. TravelAgency + TouristTrip schema.org structured data. Sitemap.xml. Meta descriptions per package. Cloudinary responsive image delivery. This mirrors the business requirement: organic international discovery is the entire reason the platform exists.`,

    documentationUrl: 'https://edward-tours-ni4f3bypj-methulgunasekaras-projects.vercel.app',
    liveLink: 'https://edward-tours-ni4f3bypj-methulgunasekaras-projects.vercel.app',
    githubLink: 'https://github.com/MethulGunasekara',
    technologies: ['Next.js', 'React', 'MongoDB', 'Node.js', 'Cloudinary', 'PayHere', 'Nodemailer', 'schema.org / SEO'],
    keyFeatures: [
      'SSR public site (Next.js) for organic international SEO — architecture driven by business requirement',
      'Package pages with day-by-day itinerary, photo galleries, embedded video, and group-size pricing',
      'Inquiry → custom quote → deposit payment flow via PayHere (CBSL-regulated)',
      'Idempotent webhook handler for PayHere server-to-server booking confirmation',
      'Admin CMS: package CRUD, itinerary builder, drag-to-reorder photo/video gallery, testimonial management',
      'Booking confirmation email with downloadable itinerary PDF generated on payment success',
      'Currency stored in USD (target: foreign tourists); approximate LKR shown for transparency',
      'Competitive benchmarking of 2 established Sri Lankan tour operators shaped scope and UX decisions',
    ],
    myRole: 'Business Analyst / Product Owner / Full-Stack Developer (solo)',
    teamSize: 'Solo',
    duration: '2024 – Present',
    methodology: 'Agile (self-managed sprints)',
    previewImages: [],
    videoUrl: '',
  },

  // ── 3. Nalin Motors — Bike Service Management System ───────────────────────
  {
    title: 'Nalin Motors — Bike Service Management System',
    tagline: 'Internal operations system replacing a paper appointment book and handwritten service cards.',
    shortDescription: 'A mobile-first, bilingual (Sinhala/English) internal operations system for a real bike service centre, replacing paper appointment books and handwritten service cards across 3 staff roles.',
    category: 'BA Case Study',
    description: `An internal operations system built for Nalin Motors, a real bike service centre, replacing a paper appointment book and handwritten service cards. The system serves three distinct staff roles: Cashier (appointment booking and service card creation), Mechanic (service card viewing and status updates), and Owner (staff and service catalog management).

Requirements were gathered via contextual inquiry — direct, in-person observation of the existing paper workflow at the premises — a distinct requirements method from the stakeholder-interview approach used on the tours project. This gives two formally different, correctly-labelled elicitation techniques across the portfolio.`,

    problemStatement: `Nalin Motors runs entirely on paper: appointments in a handwritten book, service requirements noted on physical cards filled by cashiers and handed to mechanics. This creates double-booked slots, illegible/misplaced service cards, and zero historical record of what was done to a given vehicle.`,

    solution: `Replaced the paper book and service cards with a mobile-first React system (because the cashier's actual working device is a phone on the shop floor, not a desktop) with full Sinhala/English i18n wired into the component architecture from Sprint 1 — not retrofitted — because direct observation showed that most mechanics are more comfortable in Sinhala.

Key decisions:
1. Internal-first scope: the core pain point is lost/illegible service cards, not customer acquisition. Building a customer booking portal first would leave the actual bottleneck untouched.
2. Role-based views over a shared screen: Cashier and Mechanic get different default views reflecting the real physical division of labour observed on-site.
3. Service checklist as database records (not hardcoded UI): the owner can add/remove standard services without developer involvement.
4. Print-optimised HTML (CSS @media print) + client-side PDF export: no server-side rendering pipeline needed for a solo one-semester delivery.`,

    outcomes: `Deployed and live at nalin-motors.vercel.app. Paper appointment book replaced. Service cards are now digital, legible, and traceable back to the originating appointment. Mechanics can receive a clean printed A4 service card or view their queue on a shared tablet in Sinhala.`,

    documentation: `SCOPE
Phase 1 MVP: Appointment booking (staff-entered), Today's/Upcoming views, confirm arrival, reschedule, cancel. Service card creation (checklist + custom services + notes), lifecycle tracking (Pending → In Progress → Completed), print/download as clean A4 PDF. Sinhala/English language switch. Employee and service catalog management.

OUT OF SCOPE (documented with reasoning):
- Customer-facing booking portal: customers already book by walking in or calling; the paper-record problem is internal-first
- Online payments: this is a scheduling/tracking tool, not a billing system, for Phase 1
- SMS/WhatsApp reminders: separate, well-scoped Phase 2 feature; not core to solving the paper-card problem
- Inventory/parts-stock tracking: a materially different domain (stock levels, suppliers, reorder points) deserving its own phase
- Multi-branch support: single-premises system for now

LOCALIZATION DECISION:
i18n built into component architecture from Sprint 1 (all UI strings routed through react-i18next translation layer) rather than retrofitted. Retrofitting localization after the UI is built is a well-known source of rework. Identified as a hard functional requirement (not a stretch goal) based on direct observation of staff language preferences on the shop floor.

SERVICE CARD LIFECYCLE:
Appointment (Booked) → Arrival Confirmed → Service Card Created (Pending) → In Progress → Completed. Status changes are tracked, not destructive deletes — a vehicle's full service history is reconstructable over time.

DATA MODEL HIGHLIGHTS:
- Appointment: vehicleNumber, customerMobile, serviceDate, startTime, status
- ServiceCard: linked to Appointment, includes checklistSelections (array of catalog item IDs), customServices (array of free-text strings), notes, assignedMechanic, inspectingOfficer, status
- ServiceCatalogItem: admin-editable, replaces hardcoded checklist UI
- Employee: name, role (cashier/mechanic/owner), active flag

PRINT STRATEGY:
CSS @media print rules style the service card as a clean A4 layout. Client-side PDF export via react-to-print. No server-side PDF pipeline — avoids unnecessary complexity for a solo one-semester timeline.`,

    documentationUrl: 'https://nalin-motors.vercel.app',
    liveLink: 'https://nalin-motors.vercel.app',
    githubLink: 'https://github.com/MethulGunasekara',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'react-i18next', 'Vite', 'CSS Print / PDF', 'Vercel', 'Render'],
    keyFeatures: [
      'Mobile-first UI designed for shop-floor phone/tablet usage (not retrofitted from desktop)',
      'Full Sinhala/English i18n wired from Sprint 1 — hard requirement based on on-site observation',
      'Role-based views: Cashier (appointments + card creation), Mechanic (queue + status), Owner (admin)',
      'Service card lifecycle: Pending → In Progress → Completed with full audit trail',
      'Standard checklist from admin-editable service catalog (owner manages without developer)',
      'Custom service items and free-text notes per card',
      'Print-optimised A4 service card layout + client-side PDF download',
      'Appointment lifecycle: Booked → Confirmed Arrival → Rescheduled / Cancelled',
    ],
    myRole: 'Business Analyst / Product Owner / Full-Stack Developer (solo)',
    teamSize: 'Solo',
    duration: '2024 – Present',
    methodology: 'Agile / Contextual Inquiry (on-site observation)',
    previewImages: [],
    videoUrl: '',
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting seed...\n');

    // Profile
    await Profile.deleteMany({});
    await Profile.create(profileData);
    console.log('✅ Profile seeded');

    // Skills
    await Skill.deleteMany({});
    await Skill.insertMany(skillsData);
    console.log(`✅ ${skillsData.length} skills seeded`);

    // Projects
    await Project.deleteMany({});
    await Project.insertMany(projectsData);
    console.log(`✅ ${projectsData.length} projects seeded`);

    // Admin (only create if none exists)
    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
      await Admin.create({ email: ADMIN_EMAIL, password: hashedPassword });
      console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
      console.log('   ⚠️  Change the password after first login!');
    } else {
      console.log('ℹ️  Admin already exists — skipped');
    }

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();