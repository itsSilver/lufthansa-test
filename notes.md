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

| Role | Value | Source |
|---|---|---|
| Primary (buttons, active tab) | `#6792EF` | reference style guide |
| Accent | `#5546FB` | reference style guide |
| Black | `#0E0E0E` | reference neutral scale (sampled) |
| Graphite | `#3F4246` | reference neutral scale (sampled) |
| Silver | `#D6D6D6` | reference neutral scale (sampled) |
| White | `#FFFFFF` | reference neutral scale |

The reference only shows a light theme. The dark theme surfaces, muted text and status colors (success/warning/danger) are derived by me to fit the palette.

## UI patterns seen in the reference (to reuse)

- Pill-shaped primary buttons with an icon circle (e.g. "Get Started" with a plane icon)
- Search card: stacked From/To inputs with a round swap (⇅) button, a date + cabin row, a full-width "Search Flight" button
- Soft, light surfaces with subtle shadows, large rounded corners, a sky/cloud imagery background
- Floating pill bottom tab bar, where the active tab is filled primary with a label and the others are icon-only circles
- Onboarding: full-bleed airplane image, title + subtitle, "Get Started", close (×) button
