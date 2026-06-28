// Central content + config for Kinetic Recess.
// Seed content mirrors the spec's CMS collections (Session, CommunityNight,
// StoryBlock, Review). Structured so each array can later be swapped for a
// `@wix/data` query without touching the page markup.

export const SITE = {
  name: "Kinetic Recess",
  tagline: "Playground fitness for adults who miss recess",
  location: "Toronto, ON",
  hours: "Sessions Tue–Sun evenings, 6–9pm. Office closed Monday.",
  established: 2022,
  socials: {
    instagram: { label: "@kineticrecess", href: "https://instagram.com/kineticrecess" },
    foursquare: { label: "@foursquaregrudge", href: "https://instagram.com/foursquaregrudge" },
  },
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Sessions", href: "/sessions" },
  { label: "Schedule", href: "/schedule" },
  { label: "Community", href: "/community" },
  { label: "Corporate", href: "/corporate" },
  { label: "About", href: "/about" },
  { label: "Parks", href: "/parks" },
];

export const CTA = {
  primary: { label: "Grab a spot", href: "/schedule" },
  free: { label: "Save my spot (free)", href: "/community" },
  corporate: { label: "Book a recess for your team", href: "/corporate" },
};

// ── Sessions (The Schedule) ───────────────────────────────────────────────
export type Session = {
  gameName: string;
  dayOfWeek: string;
  startTime: string;
  park: string;
  neighborhood: string;
  sessionType: string;
  spotsLeft: number;
  difficulty: string;
  price: string;
  blurb: string;
  image: string;
};

export const SESSIONS: Session[] = [
  {
    gameName: "Dodgeball Mayhem",
    dayOfWeek: "Tuesday",
    startTime: "6:30pm",
    park: "Trinity Bellwoods Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 9,
    difficulty: "Rowdy",
    price: "$18 drop-in",
    blurb:
      "Foam balls, no mercy, one self-appointed villain per game. Last team standing buys nobody anything because that's not how recess works.",
    image: "/images/dodgeball.png",
  },
  {
    gameName: "Capture the Flag (After Dark)",
    dayOfWeek: "Thursday",
    startTime: "7:00pm",
    park: "Riverdale Park East",
    neighborhood: "East End",
    sessionType: "Public drop-in",
    spotsLeft: 4,
    difficulty: "Sweaty",
    price: "$18 drop-in",
    blurb:
      "Two teams, two flags, one floodlit hill, and a forty-minute argument about whether you were actually tagged.",
    image: "/images/capture-the-flag.png",
  },
  {
    gameName: "Four-Square Showdown",
    dayOfWeek: "Sunday",
    startTime: "5:00pm",
    park: "Dufferin Grove Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 12,
    difficulty: "High Drama",
    price: "$18 drop-in",
    blurb:
      "Return to the court where you first learned about betrayal. An official referee makes every line dispute count.",
    image: "/images/four-square-court.png",
  },
  {
    gameName: "Championship Kickball",
    dayOfWeek: "Wednesday",
    startTime: "7:30pm",
    park: "Christie Pits Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 6,
    difficulty: "Dusty",
    price: "$18 drop-in",
    blurb:
      "Slow-pitch rubber ball, fast-pitch opinions, everyone bats. Slide into home like it's 1998; ice packs not included.",
    image: "/images/kickball.png",
  },
  {
    gameName: "No-Mercy Dodgeball",
    dayOfWeek: "Saturday",
    startTime: "8:00pm",
    park: "Trinity Bellwoods Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 2,
    difficulty: "Rowdy",
    price: "$18 drop-in",
    blurb: "High-velocity foam therapy for the modern desk-worker. Bring a grudge.",
    image: "/images/dodgeball.png",
  },
  {
    gameName: "Sunset Four Square",
    dayOfWeek: "Friday",
    startTime: "6:30pm",
    park: "Dufferin Grove Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 14,
    difficulty: "Casual",
    price: "$18 drop-in",
    blurb: "Chalk grid, golden hour, and a server who will absolutely insist they didn't double-touch.",
    image: "/images/four-square-court.png",
  },
  {
    gameName: "Midnight Capture the Flag",
    dayOfWeek: "Saturday",
    startTime: "9:00pm",
    park: "Riverdale Park East",
    neighborhood: "East End",
    sessionType: "Public drop-in",
    spotsLeft: 0,
    difficulty: "Intense",
    price: "$18 drop-in",
    blurb: "The final showdown. Stealth, sprinting, and a floodlit hill in near-total darkness.",
    image: "/images/capture-the-flag.png",
  },
  {
    gameName: "Kickball Block Party",
    dayOfWeek: "Sunday",
    startTime: "1:00pm",
    park: "Christie Pits Park",
    neighborhood: "West End",
    sessionType: "Public drop-in",
    spotsLeft: 18,
    difficulty: "Casual",
    price: "$18 drop-in",
    blurb: "Daytime kickball for people who want recess but also want to be home by dinner.",
    image: "/images/kickball.png",
  },
];

// ── Community Nights ──────────────────────────────────────────────────────
export type CommunityNight = {
  gameName: string;
  date: string;
  park: string;
  funder: string;
  spotsLeft: number;
  blurb: string;
};

export const COMMUNITY_NIGHTS: CommunityNight[] = [
  {
    gameName: "Free Four Square Friday",
    date: "July 18",
    park: "Dufferin Grove Park",
    funder: "Funded by Shopify's Tuesday booking",
    spotsLeft: 22,
    blurb: "Chalk grid, no fee, bring a friend who claims they were good at this.",
  },
  {
    gameName: "Free Kickball Sunday",
    date: "July 27",
    park: "Christie Pits Park",
    funder: "Funded by a Wealthsimple team night",
    spotsLeft: 30,
    blurb: "Slow-pitch rubber ball, fast-pitch opinions, everyone bats.",
  },
  {
    gameName: "Free Dodgeball Thursday",
    date: "August 7",
    park: "Trinity Bellwoods Park",
    funder: "Funded by a Figma offsite",
    spotsLeft: 24,
    blurb: "Foam balls on the house. Same villain energy, zero cover charge.",
  },
];

// ── Reviews (Home) ────────────────────────────────────────────────────────
export type Review = { name: string; quote: string; detail: string };

export const REVIEWS: Review[] = [
  {
    name: "Priya Nadkarni",
    quote:
      "I have not sprinted since high school and I sprinted four times Tuesday. For foam balls.",
    detail: "West-end regular, undefeated dodgeball villain.",
  },
  {
    name: "Devon Clarke",
    quote:
      "Booked it for my team expecting a polite hour. We are still arguing about a tag call from three weeks ago.",
    detail: "Brought a fourteen-person office to capture the flag.",
  },
  {
    name: "Maya Friedman",
    quote:
      "Free community night, total strangers, and I left with a four-square nemesis I now text.",
    detail: "Came for the chalk grid, stayed for the grudge.",
  },
];

// ── Story block (How Recess Works) ────────────────────────────────────────
export const STORY = {
  heading: "We added a referee, not to stop the arguing — to make it official.",
  body: `Kinetic Recess started because three adults realized the last time they had real fun moving their bodies was on a blacktop in grade five. So one Tuesday they hauled foam balls into a Toronto schoolyard after hours and texted everyone they knew. Twelve people showed up. Nobody stretched, everybody sweated, and a four-square match ended in a genuinely heated rules dispute that lasted longer than the game. That argument is when we knew. We added a referee, not to stop the arguing but to make it official. The format is simple: real playground games, real parks after dark, and a structured chance to insist you were not out. Corporate bookings pay the park permits and the foam-ball budget, which lets us run free community nights for anyone who shows up. No memberships. No journey. Just recess, for people tall enough to know better.`,
};

// ── FAQ (How Recess Works) — feeds FAQPage JSON-LD ────────────────────────
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Do I need to be in shape?",
    a: "No. If you can jog to catch a streetcar you can play. The games are intervals of sprinting and standing around insisting you were not out. Most people are more sore from laughing.",
  },
  {
    q: "What's the structured arguing about?",
    a: "Every session has a referee whose real job is to make the rules disputes official. You will disagree about a tag, a line, or whether the four-square server cheated. We've built in time for it. It's the most fun part.",
  },
  {
    q: "How do public sessions and corporate bookings differ?",
    a: "Public sessions are drop-in, $18, capped at 24 strangers who become temporary rivals. Corporate bookings are private for your team, priced per group, and they fund a free community night for the public.",
  },
  {
    q: "What are community nights?",
    a: "Free public sessions paid for by corporate bookings. Same parks, same games, no fee. We post the dates on the Community Nights page; just save a spot so we know how many foam balls to bring.",
  },
  {
    q: "Which parks do you use and how does after-hours access work?",
    a: "We rotate through permitted Toronto parks like Trinity Bellwoods, Dufferin Grove, Christie Pits, and Riverdale. Every session listing names the park and meeting spot. We hold the permit, so you just show up.",
  },
  {
    q: "What should I bring and what if it rains?",
    a: "Running shoes, water, and a willingness to lose gracefully (optional). We supply the gear and chalk. If a storm hits we move or reschedule and email everyone on the roster; light rain is just recess with mud.",
  },
];

// ── Parks (Find a Park) ───────────────────────────────────────────────────
export type Park = {
  name: string;
  neighborhood: string;
  access: string;
  bring: string;
  image: string;
};

export const PARKS: Park[] = [
  {
    name: "Trinity Bellwoods Park",
    neighborhood: "West End",
    access: "Gate 4 entry off Dundas. Digital pass required; meet at the perimeter chalk grid.",
    bring: "Running shoes, water, thermal layer — it gets cold once the floodlights are the only heat.",
    image: "/images/four-square-court.png",
  },
  {
    name: "Dufferin Grove Park",
    neighborhood: "West End",
    access: "Permitted after-hours field by the rink house. We hold the permit; just show up.",
    bring: "Outdoor soles, a friend, and your most disputed four-square memory.",
    image: "/images/kickball.png",
  },
  {
    name: "Christie Pits Park",
    neighborhood: "West End",
    access: "Lower field, south entrance. Floodlit until 9pm; meeting spot is the dugout.",
    bring: "Cleats or grippy runners, water, and ice packs for the kickball slide.",
    image: "/images/kickball.png",
  },
  {
    name: "Riverdale Park East",
    neighborhood: "East End",
    access: "Top of the hill by Broadview. After-hours access via the east path; we mark it with chalk.",
    bring: "Dark clothing optional, sprinting legs mandatory. Bring water.",
    image: "/images/capture-the-flag.png",
  },
];

// ── Homepage flow sections ────────────────────────────────────────────────
export const HOW_IT_WORKS = [
  { n: "01", title: "Pick a game.", body: "Dodgeball, four square, capture the flag, kickball. Choose your battlefield from the schedule." },
  { n: "02", title: "Show up at a park after work.", body: "Real Toronto parks, after dark, under the floodlights. We hold the permit — just arrive." },
  { n: "03", title: "Argue about the rules like your job depends on it.", body: "There's a referee. There's still a debate. That's the whole point." },
];
