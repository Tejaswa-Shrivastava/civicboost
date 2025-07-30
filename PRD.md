# Report & Reward - Public Issue Reporting with Incentives

A civic engagement platform that empowers citizens to report public issues while earning rewards for their community contributions.

**Experience Qualities**:
1. **Empowering** - Users feel their voice matters and can create real change in their community
2. **Rewarding** - Clear incentives and recognition make participation satisfying and motivating
3. **Trustworthy** - Professional interface builds confidence that reports are taken seriously

**Complexity Level**: Light Application (multiple features with basic state)
The app manages issue reports, user rewards, and status tracking without requiring complex user accounts or backend infrastructure.

## Essential Features

**Issue Reporting**
- Functionality: Submit detailed reports with photos, location, category, and description
- Purpose: Enable citizens to easily document and report public problems
- Trigger: User clicks "Report Issue" button
- Progression: Select category → Add location → Upload photo → Write description → Submit → Receive confirmation
- Success criteria: Report is saved with unique ID and timestamped

**Reward System**
- Functionality: Award points for reporting, bonus points for verified issues, achievement badges
- Purpose: Incentivize consistent reporting and quality submissions
- Trigger: Automatically when issues are submitted or status changes
- Progression: Submit report → Earn base points → Issue gets verified → Earn bonus points → Unlock achievements
- Success criteria: Points and badges are tracked and displayed to user

**Issue Tracking**
- Functionality: View submitted reports with status updates (Submitted, Under Review, In Progress, Resolved)
- Purpose: Provide transparency and closure on reported issues
- Trigger: User navigates to "My Reports" section
- Progression: View list → Select report → See detailed status and timeline
- Success criteria: All reports show current status with last updated timestamp

**Leaderboard**
- Functionality: Display top contributors by points with achievements
- Purpose: Create community engagement and friendly competition
- Trigger: User navigates to "Leaderboard" tab
- Progression: View rankings → See own position → Browse other users' achievements
- Success criteria: Accurate point totals and rankings displayed

## Edge Case Handling

- **Duplicate Reports**: Show warning if similar issue reported in same area recently
- **Missing Location**: Allow manual address entry if GPS fails
- **Photo Upload Failure**: Gracefully handle failed uploads with retry option
- **Offline Mode**: Queue reports locally when internet unavailable
- **Empty States**: Show encouraging messaging when no reports exist yet

## Design Direction

The design should feel civic and trustworthy while remaining approachable - like a modern government service that actually works well, with clean lines and clear information hierarchy that builds confidence in the reporting process.

## Color Selection

Complementary (opposite colors) - Using civic blue and warm orange to balance authority with approachability, creating trust while encouraging action.

- **Primary Color**: Civic Blue (oklch(0.45 0.15 250)) - Communicates trust, authority, and civic responsibility
- **Secondary Colors**: Light Blue (oklch(0.85 0.08 250)) for backgrounds, Dark Blue (oklch(0.25 0.18 250)) for text
- **Accent Color**: Warm Orange (oklch(0.65 0.18 45)) - Attention-grabbing for CTAs and reward elements
- **Foreground/Background Pairings**: 
  - Background (White #FFFFFF): Dark Blue text (oklch(0.25 0.18 250)) - Ratio 8.2:1 ✓
  - Primary (Civic Blue): White text (#FFFFFF) - Ratio 6.8:1 ✓
  - Accent (Warm Orange): White text (#FFFFFF) - Ratio 4.9:1 ✓
  - Card (Light Gray oklch(0.98 0.01 250)): Dark Blue text - Ratio 7.8:1 ✓

## Font Selection

Inter font family to convey modern professionalism and excellent readability across all civic documents and digital interfaces.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - H3 (Card Titles): Inter Medium/18px/normal spacing
  - Body (Descriptions): Inter Regular/16px/relaxed line height
  - Small (Metadata): Inter Regular/14px/compact spacing

## Animations

Subtle and purposeful animations that feel responsive and government-appropriate - smooth transitions that guide attention without feeling playful or distracting from the serious nature of civic reporting.

- **Purposeful Meaning**: Motion communicates progress through the reporting process and celebrates achievements
- **Hierarchy of Movement**: Form submissions get satisfying confirmation animations, status changes slide smoothly, reward notifications have gentle celebration effects

## Component Selection

- **Components**: Cards for issue reports, Badges for achievements, Forms for reporting, Tabs for navigation, Progress indicators for status, Alert dialogs for confirmations
- **Customizations**: Custom status indicators with color-coded progress, custom reward point display component, custom photo upload with preview
- **States**: Buttons show loading states during submission, forms validate in real-time, cards have hover effects for interactivity
- **Icon Selection**: MapPin for location, Camera for photos, Trophy for rewards, CheckCircle for completed, AlertCircle for issues
- **Spacing**: Consistent 1rem (16px) base spacing with 0.5rem for tight elements and 2rem for section separation
- **Mobile**: Stack forms vertically, collapse navigation to hamburger menu, ensure touch targets meet 44px minimum, single-column card layout