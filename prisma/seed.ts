import { PrismaClient, Priority, Status } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString =
  process.env.DATABASE_URL ||
  "mysql://root:MyNewPass%402026@localhost:3306/issue_tracker";
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding realistic Issue Tracker Pro data...");

  // 1. Seed Team Members
  const user1 = await prisma.user.upsert({
    where: { email: "sarah.chen@issuetracker.pro" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "sarah.chen@issuetracker.pro",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "alex.rivera@issuetracker.pro" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex.rivera@issuetracker.pro",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "david.kim@issuetracker.pro" },
    update: {},
    create: {
      name: "David Kim",
      email: "david.kim@issuetracker.pro",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`Created team members: ${user1.name}, ${user2.name}, ${user3.name}`);

  // 2. Clear existing issues to seed fresh practical examples
  await prisma.issue.deleteMany();

  // 3. Realistic Issue Dataset with Critical, High, Medium, and Low items
  const issuesToSeed = [
    {
      title: "🚨 [CRITICAL] Redis Session Store Connection Pool Exhaustion under Peak Traffic",
      description: `### Severity: Critical Incident
**Impact**: Users in the \`us-east\` region are experiencing intermittent HTTP 504 Gateway Timeouts during session validation.

#### Root Cause Analysis:
Under sudden connection bursts (>2,500 req/sec), the Redis client pool runs out of available sockets and fails to release idle connections back to the cluster pool.

#### Steps to Reproduce:
1. Run load test script \`k6 run scripts/load_session_burst.js\` with 5,000 VUs.
2. Monitor \`redis_connected_clients\` and observe socket starvation.

#### Required Action:
- Configure connection pool timeout from 10s down to 2s.
- Implement exponential backoff retry policy on session retrieval.
- Scale Redis replica cluster nodes.`,
      status: Status.OPEN,
      priority: Priority.URGENT,
      assignedToUserId: user1.id,
    },
    {
      title: "🚨 [SECURITY] Rate-Limiting Bypass on Password Reset Endpoint via Header Spoofing",
      description: `### Vulnerability Report (CVE-Internal-2026-081)
**Vulnerability Type**: Insecure Direct Object Reference / Rate Limit Circumvention
**CVSS Score**: 8.4 (High)

#### Details:
The IP extraction utility in \`middleware.ts\` blindly trusts \`X-Forwarded-For\` without validating proxy hop integrity, allowing attackers to cycle spoofed IP addresses and brute-force token generation.

#### Remediation Plan:
- Restrict trusted proxy headers strictly to Cloudflare / AWS ALB CIDR blocks.
- Transition rate-limiting key from pure IP to a combined composite key of \`hash(IP + User-Agent + Email)\`.`,
      status: Status.IN_PROGRESS,
      priority: Priority.URGENT,
      assignedToUserId: user2.id,
    },
    {
      title: "🚨 [CRITICAL] Stripe Webhook Duplicate Event Processing During Concurrent Checkout",
      description: `### Incident Summary
Customer subscriptions in checkout state occasionally trigger duplicate invoice generation when Stripe retries webhooks within a 300ms window.

#### Acceptance Criteria:
- Add a distributed Redis lock / database unique constraint on \`stripe_event_id\`.
- Enforce strict idempotency validation before debiting user balance.`,
      status: Status.OPEN,
      priority: Priority.URGENT,
      assignedToUserId: user3.id,
    },
    {
      title: "⚡ [PERFORMANCE] Slow Query Optimization on Issue Pagination (>850ms on 100k rows)",
      description: `### Performance Regression
**Component**: \`app/issues/list/page.tsx\`
**Observed Latency**: P99 query latency reached 890ms during large dataset pagination.

#### Action:
- Add composite index on \`(status, priority, createdAt DESC)\` in schema.
- Implement cursor-based pagination for high-volume tenant tables.`,
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      assignedToUserId: user1.id,
    },
    {
      title: "🔒 [FEATURE] Multi-Factor Authentication (TOTP / Google Authenticator) Integration",
      description: `### Feature Specification
Allow workspace administrators and developers to enable 2FA using standard RFC 6238 TOTP algorithms.

#### Implementation:
- QR code generation using \`otplib\` and \`qrcode\`.
- Store encrypted secret in User model.
- Provide 8 single-use emergency backup recovery codes.`,
      status: Status.OPEN,
      priority: Priority.HIGH,
      assignedToUserId: user2.id,
    },
    {
      title: "🎨 [UI/UX] Implement Dark Mode Theme Switcher with Radix UI Tokens",
      description: `### User Request
Add a quick-toggle theme switch in the top navigation bar supporting:
- Light Mode
- Dark Mode (OLED/Neutral Slate)
- System Default (matching \`prefers-color-scheme\`)`,
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
      assignedToUserId: user3.id,
    },
    {
      title: "📊 [ANALYTICS] Export Issue Reports to CSV and PDF Summary Reports",
      description: `Add an 'Export Data' action menu on the issues list page allowing users to download CSV or PDF digests of filtered issues.`,
      status: Status.CLOSED,
      priority: Priority.MEDIUM,
      assignedToUserId: user1.id,
    },
    {
      title: "📝 [DOCS] Update OpenAPI Spec and GitHub Actions Deployment Workflows",
      description: `Synchronize the API Swagger/OpenAPI documentation with the updated PATCH /api/issues endpoint parameters.`,
      status: Status.CLOSED,
      priority: Priority.LOW,
      assignedToUserId: user2.id,
    },
  ];

  for (const issue of issuesToSeed) {
    await prisma.issue.create({ data: issue });
  }

  console.log(`✅ Successfully seeded ${issuesToSeed.length} practical issues into MySQL!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
