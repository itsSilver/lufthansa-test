# Flight App

A React Native take-home: log in, search flights, save favorites and view flight details. Built with Expo, TypeScript, React Navigation and Redux Toolkit.

▶️ **[Watch the demo](docs/demo.mp4)** (iPhone, ~2 min)

## Features

- **Onboarding** — three-slide intro shown once; the current step is remembered if the app is closed halfway.
- **Login** — mocked auth with validation, loading state and a persisted session (expires after 7 days).
- **Home** — round trip / one way search with airport autocomplete (3,200+ airports), a range calendar, origin ≠ destination validation, recent searches and popular destinations.
  - _Popular destinations_ isn't part of the spec. I added it to round out the home design and to give quick prefills: tapping a city sets it as the destination.
- **Search results** — real flights from Aviationstack for the outbound and return legs, pull-to-refresh, loading skeletons, empty and error states.
- **Flight details** — times, duration, terminals, gate, baggage belt, aircraft, status and codeshares.
- **Favorites** — save or remove from results, details or the favorites list; persisted.
- **Profile** — user info, dark mode toggle, logout (clears the user's favorites, recents and cached flights).
- **More** — Settings, Help, About and Contact placeholder screens.
- **Theming** — light and dark across every screen, header and tab bar; follows the device until changed, and the choice is remembered.
- **Polish** — staggered list animations, an animated favorite button with haptics, loading skeletons, and large display text capped so it stays readable with bigger system font sizes.

## Getting started

Requirements: Node 22 (see `.nvmrc`) and either the Expo Go app, an iOS simulator or an Android emulator.

```bash
npm install
cp env.example .env   # then add your Aviationstack key (optional, see below)
npm start             # press i for iOS, a for Android, w for web
```

**Demo login:** any valid email with a password of at least 6 characters, e.g. `jane.doe@example.com` / `secret1`.

### Environment variables

| Variable                             | Default                           | Purpose                                                              |
| ------------------------------------ | --------------------------------- | -------------------------------------------------------------------- |
| `EXPO_PUBLIC_AVIATIONSTACK_API_KEY`  | _empty_                           | Aviationstack key. Without it the app uses generated sample flights. |
| `EXPO_PUBLIC_AVIATIONSTACK_BASE_URL` | `http://api.aviationstack.com/v1` | API base URL.                                                        |
| `EXPO_PUBLIC_MOCK_API_DELAY_MS`      | `800`                             | Fake network delay for mock login and sample flights.                |
| `EXPO_PUBLIC_SESSION_TTL_DAYS`       | `7`                               | How long a login stays valid.                                        |

A free Aviationstack key is available at [aviationstack.com](https://aviationstack.com/). Restart Expo with `npx expo start --clear` after editing `.env`.

### Scripts

| Command                     | What it does                              |
| --------------------------- | ----------------------------------------- |
| `npm start`                 | Start the Expo dev server                 |
| `npm test`                  | Run the Jest test suite                   |
| `npm run lint`              | ESLint + Prettier, fails on warnings      |
| `npm run typecheck`         | `tsc --noEmit`                            |
| `npm run check`             | Lint, typecheck and tests together        |
| `npm run format`            | Format the codebase with Prettier         |
| `npm run generate:airports` | Rebuild the airport list from OurAirports |

CI runs lint, typecheck, tests, `expo-doctor` and an iOS + Android bundle build on every push and pull request.

## Architecture

### Why Expo

Expo gives a working iOS and Android setup without Xcode or Android Studio, runs in Expo Go for quick review, and handles native configuration through `app.json` and config plugins instead of hand-edited native projects. Everything used here (fonts, splash screen, images, gradients, symbols) is an Expo or Expo-compatible module, so there was no reason to eject. If a native module is needed later, a development build covers it.

### Navigation

React Navigation with typed param lists for every navigator:

```
RootStack (native stack)
├── Onboarding          shown until completed
├── Login               shown while logged out
└── Main (bottom tabs)
    ├── HomeTab       → Home → Search Results → Flight Details
    ├── FavoritesTab  → Favorite Flights → Flight Details
    ├── ProfileTab    → Profile
    └── MoreTab       → More → Settings / Help / About / Contact
```

The root stack renders one branch based on Redux state, so onboarding and login can't be reached with the back button once passed. Tabs reset to their first screen when you leave them (`popToTopOnBlur`).

### State

Redux Toolkit is the only state management:

- **Slices** — `auth`, `onboarding`, `settings` (theme), `recentSearches`, `favorites` (entity adapter, sorted by departure).
- **RTK Query** — `flightsApi` fetches a route's timetable and caches it for 30 minutes, so opening details or going back doesn't spend API requests.
- **redux-persist** — saves onboarding, theme, recent searches, favorites and the session to AsyncStorage. Loading and error state is never persisted.
- **Listener middleware** — applies the saved theme before the splash screen hides, logs out expired sessions on launch and clears the flight cache on logout.

The splash screen stays up until fonts, key images and persisted state are ready, so the first frame is the correct screen in the correct theme.

### Flight data

The free Aviationstack plan only returns yesterday's and today's flights, so the app fetches a route's real timetable (airlines, flight numbers, times, terminals) and shows it on the date the user picks. Today's flights keep their live status and delay; other dates show as scheduled. Codeshare duplicates are merged into the operating flight.

If there's no key, the key is invalid or the monthly quota is used up, the app falls back to generated sample flights (deterministic per route, realistic durations) and says so on screen. The provider sits behind `services/flights`, so a different API only needs a new adapter.

Airports come from [OurAirports](https://ourairports.com/data/) (public domain), trimmed to large and medium airports with scheduled service.

### Styling

NativeWind (Tailwind) with design tokens in `src/theme/colors.ts`. The same tokens feed Tailwind (as CSS variables) and the React Navigation theme, so screens, headers and the tab bar always match. The UI follows [this Dribbble concept](https://dribbble.com/shots/27388720-Flight-Booking-App), with Inter in place of SF Pro (SF Pro can't ship on Android). See [docs/notes.md](docs/notes.md) for design and photo credits.

### Project structure

```
src/
├── components/     shared UI (ui/) and flight components (flights/)
├── config/         environment variables
├── data/           airport list and search
├── hooks/          app-level hooks (boot readiness)
├── navigation/     navigators, param types, navigation theme
├── screens/        one folder per feature, with its own components/
├── services/       auth mock and flight providers
├── store/          Redux store, slices, RTK Query API, listeners
├── theme/          color tokens, fonts, theme scope
├── types/          domain types
└── utils/          dates, formatting, flight helpers
```

### Testing

Jest with `jest-expo` and React Native Testing Library, 48 tests:

- **Reducers** — recent searches rules (order, dedupe, limit of 10, logout), favorites (toggle, sorting, logout).
- **Logic** — search and login validation, date and duration formatting, time zone handling, timetable projection.
- **API** — the Aviationstack parser against a mocked `fetch` (codeshare merging, delays, error codes).
- **Components** — `FlightCard` (content, navigation, favoriting, status badge) and `SearchCard` (same-airport error, trip type, swap, submit).
- **Navigation** — the root navigator shows onboarding, then login, then the app, based on Redux state.

## Trade-offs and limitations

- **Mock auth** — any valid email signs in; there's no backend or token refresh.
- **API key in the app** — `EXPO_PUBLIC_*` values end up in the bundle. A production app would call the flight API through its own backend.
- **HTTP only** — the free Aviationstack plan doesn't support HTTPS, so cleartext traffic is allowed for that host on iOS and app-wide on Android.
- **Future dates** — shown from today's real timetable, not a true schedule for that day.
- **Durations** — Aviationstack has no time zone data, so the offset is estimated from each airport's longitude; it can be an hour off around daylight saving changes.
- **No prices or booking** — the free API has no fares, so the design's price labels were left out.

## What I'd do next

- Move the flight API behind a small backend (key safety, HTTPS, caching).
- Localization and accessibility review with a screen reader.
