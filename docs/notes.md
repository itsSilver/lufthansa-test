# Notes

## Design reference

The UI of this app is based on this Dribbble shot:
**https://dribbble.com/shots/27388720-Flight-Booking-App**

I'm using it only as visual reference for this demo (take-home assignment). It isn't my design, and the app isn't affiliated with its author. All credit for the visual direction goes to the original designer. Screens are adapted to fit the assignment's requirements, so they won't match the shot one-to-one.

## Design tokens taken from the reference

**Typography**: the reference uses **SF Pro Display** (Regular, Medium, Bold).
SF Pro's license only allows it in apps for Apple platforms, so it can't ship in the Android build. The app uses **Inter** instead (Regular 400, Medium 500, Bold 700). It's the closest open-source match and looks the same on iOS and Android.
Fonts load while the native splash screen is visible.

**Colors** (source of truth: `src/theme/colors.ts`):

| Role                          | Value     | Source                            |
| ----------------------------- | --------- | --------------------------------- |
| Primary (buttons, active tab) | `#6792EF` | reference style guide             |
| Accent                        | `#5546FB` | reference style guide             |
| Black                         | `#0E0E0E` | reference neutral scale (sampled) |
| Graphite                      | `#3F4246` | reference neutral scale (sampled) |
| Silver                        | `#D6D6D6` | reference neutral scale (sampled) |
| White                         | `#FFFFFF` | reference neutral scale           |

The reference only shows a light theme. The dark theme surfaces, muted text and status colors (success/warning/danger) are derived by me to fit the palette.

## Photos

Onboarding and destination photos are from [Pexels](https://www.pexels.com/license/) (free to use, no attribution required, credited anyway):

| File                                      | Photo                                                                                                              | Photographer   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------- |
| `assets/images/onboarding/slide-1.jpg`    | [Airplane flying in cloudy blue sky](https://www.pexels.com/photo/airplane-flying-in-cloudy-blue-sky-4618040/)     | Jonathan Borba |
| `assets/images/onboarding/slide-2.jpg`    | [Plane flying over clouds in blue sky](https://www.pexels.com/photo/plane-flying-over-clouds-in-blue-sky-4143427/) | Brett Sayles   |
| `assets/images/onboarding/slide-3.jpg`    | [Wing of airplane flying over clouds](https://www.pexels.com/photo/wing-of-airplane-flying-over-clouds-18459049/)  | Saket Suman    |
| `assets/images/destinations/london.jpg`   | [Ferris wheel beside body of water](https://www.pexels.com/photo/ferris-wheel-beside-body-of-water-2031726/)       | Chait Goli     |
| `assets/images/destinations/rome.jpg`     | [The Colosseum, Rome](https://www.pexels.com/photo/the-colosseum-rome-532263/)                                     | Pixabay        |
| `assets/images/destinations/paris.jpg`    | [Eiffel Tower, Paris](https://www.pexels.com/photo/eiffel-tower-paris-532826/)                                     | Pixabay        |
| `assets/images/destinations/new-york.jpg` | [City buildings and sky](https://www.pexels.com/photo/city-buildings-and-sky-462326/)                              | Pexels         |
| `assets/images/hero-plane.jpg`            | [White airplane in mid air](https://www.pexels.com/photo/white-airplane-in-mid-air-3912838/)                       | Pexels         |

## Data sources

- **Flights:** [Aviationstack](https://aviationstack.com/) `/flights` endpoint (free plan). It only returns yesterday and today, so the app takes the real timetable for a route and shows it on the date the user picks. Codeshares are merged into the operating flight. Without an API key, or when the monthly quota runs out, the app falls back to generated sample flights and says so on screen.
- **Airports:** [OurAirports](https://ourairports.com/data/) (public domain), trimmed to large and medium airports with scheduled service. Regenerate with `npm run generate:airports`.

## UI patterns seen in the reference (to reuse)

- Pill-shaped primary buttons with an icon circle (e.g. "Get Started" with a plane icon)
- Search card: stacked From/To inputs with a round swap (⇅) button, a date + cabin row, a full-width "Search Flight" button
- Soft, light surfaces with subtle shadows, large rounded corners, a sky/cloud imagery background
- Floating pill bottom tab bar, where the active tab is filled primary with a label and the others are icon-only circles
- Onboarding: full-bleed airplane image, title + subtitle, "Get Started", close (×) button
- Trip details: ticket-style card with a perforated edge, big airport codes with cities, a "Flight time" pill over a dotted route line with a plane, airline and flight number, then an info grid (gate, terminal, aircraft, status here instead of booking ID/seat/class)
