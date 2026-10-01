# Feature Specification: Jaanu Setu – ACL Rehab Tracker

**Feature Directory**: `specs/001-rehab-tracker`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Jaanu Setu: a mobile-first website tracker for a rehab-first ACL recovery programme, similar in spirit to a daily sadhana tracker, based on the ACL Rehab Programme Daily Schedule PDF."

*Jaanu = knee, Setu = bridge: a bridge from a torn ACL back to a confident knee.*

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Follow today's schedule and tick it off (Priority: P1)

The user opens the app and sees today's plan: Morning (50 min stretch + walk, M1–M6), Before lunch (20 min, quad + hip strength, L1–L5), Evening (45 min, bike + strength + recovery), and desk mini-sessions (heel props, quad sets, ankle pumps). The evening depends on the weekday: Day A (Mon/Wed/Fri) is the band circuit, Day B (Tue/Thu/Sat) is good-leg + core, and Sunday is a lighter day. The user can swap the evening for the yoga session on yoga days. Each item shows its card code and amount, and can be ticked off.

**Why this priority**: This is the daily habit loop and the core value; everything else supports it.

**Independent Test**: Open the app on a Monday, see Day A evening items with the right card codes and amounts, tick items, reload, and ticks remain.

**Acceptance Scenarios**:

1. **Given** it is Monday, **When** the user opens Today, **Then** the evening shows the Day A band circuit (B1–B6, B8 plus quad sets, calf raises, bike, legs up the wall).
2. **Given** it is Tuesday, **When** the user opens Today, **Then** the evening shows Day B good-leg + core items (E3–E9).
3. **Given** it is Sunday, **When** the user opens Today, **Then** a lighter plan is shown (morning stretch and walk, heel props, yoga optional).
4. **Given** the user marks "yoga day", **When** Today refreshes, **Then** the evening session is replaced by the yoga sequence entry while the morning walk stays.
5. **Given** the user ticks items, **When** they close and reopen the app (including offline), **Then** the ticks are preserved.

---

### User Story 2 - Exercise card library (Priority: P1)

From any schedule item the user opens its exercise card showing: title, category, illustration or clear description of the movement, steps, hold/repeat amount, breathing, "you should feel", knee safety, easier, harder, and stop-if. All cards are also browsable and searchable by code or name (M, L, E, B groups), including band basics.

**Why this priority**: The user needs correct form guidance at the moment of doing the exercise.

**Independent Test**: Tap "M5 Quad Sets" from Today and see its full card; search "heel" and find L5.

**Acceptance Scenarios**:

1. **Given** a schedule item with code L5, **When** the user taps it, **Then** the Heel Prop card opens with steps, amount and stop-if guidance.
2. **Given** the library, **When** the user searches "bridge", **Then** L2 Bridges and B4 Banded Bridge are listed.

---

### User Story 3 - Morning knee check adjusts today's plan (Priority: P1)

Each morning the user records how the knee feels versus yesterday: same or better; a bit puffier/stiffer; clearly swollen, warm or painful; shifted or gave way. Today's plan adapts as per the programme: full plan with +5 min walk when calm (up to 40 min); halve walk and bike and skip chair pose and step-ups; rest day with quad sets, heel props, ankle pumps, legs up the wall and ice; or stop standing work and walking with a prompt to note the cause and contact physio/surgeon.

**Why this priority**: This is the safety and progression mechanism of the programme.

**Independent Test**: Choose "clearly swollen" and verify today shows only rest-day items; choose "same or better" and verify the suggested walk is 5 min longer than the last walk (capped at 40).

**Acceptance Scenarios**:

1. **Given** walk target is 20 min and the check is "same or better", **When** confirmed, **Then** the walk target becomes 25 min (max 40).
2. **Given** "a bit puffier", **When** confirmed, **Then** walk and bike are halved and chair pose / step-ups are hidden or flagged to skip.
3. **Given** "clearly swollen, warm or painful", **When** confirmed, **Then** Today switches to the rest-day plan and the next day's walk restarts shorter.
4. **Given** "knee shifted or gave way", **When** confirmed, **Then** a stop notice is shown, walking and standing work are removed from Today, and the user is asked to note what they were doing.

---

### User Story 4 - Daily log, streaks and weekly view (Priority: P2)

The user logs per day: swelling, pain level, walk minutes, giving-way events, and free-text notes. The app shows the current streak, a weekly adherence view (percentage of planned items completed per session per day), and trends of walk minutes, swelling and pain.

**Why this priority**: Motivates consistency and gives data to share with the physio/surgeon.

**Independent Test**: Log three days of data and see the streak, weekly grid and walk-minute trend reflect it.

**Acceptance Scenarios**:

1. **Given** three consecutive days with all sessions completed, **When** viewing Progress, **Then** the streak shows 3.
2. **Given** logged giving-way events, **When** viewing Progress, **Then** they are listed with date and notes.
3. **Given** a missed day, **When** viewing the week, **Then** that day shows reduced adherence and the streak resets.

---

### User Story 5 - Quad-set and heel-prop counters (Priority: P2)

The user can tap to count quad sets (target 5–6 sessions of 10 a day), heel props (3 × 10 min, with an optional timer), and ankle-pump sets through the day, with progress shown against the daily target.

**Why this priority**: These are the "most important" frequent exercises done many times a day and are easy to forget.

**Independent Test**: Tap the quad-set counter five times and see 5/6 progress; a heel-prop timer counts 10 minutes.

**Acceptance Scenarios**:

1. **Given** the counter at 0, **When** the user taps +1 three times, **Then** it shows 3 of the daily target and persists across reloads.
2. **Given** a new day, **When** the app opens, **Then** counters start at 0 and yesterday's totals are kept in history.

---

### User Story 6 - Safety warnings (Priority: P2)

Warnings are always accessible and shown prominently when relevant: sudden calf pain, swelling or tightness needs same-day medical checking (burst Baker's cyst and clot can feel alike; only a scan differentiates); giving-way stops the day's standing work; sharp pain or locking on any card means stop and tell the physio. If the user was advised a Doppler scan, it is tracked as an opt-in to-do until marked done. A "not medical advice" notice is visible.

**Why this priority**: Calf symptoms can signal a clot, especially with varicose veins or a Baker's cyst; missing that warning is the highest-harm failure.

**Independent Test**: Open the safety page and see the calf-pain warning; mark the Doppler as done and see it leave the to-do list.

**Acceptance Scenarios**:

1. **Given** the user reports calf pain/swelling in the log, **When** saved, **Then** a same-day medical check warning is shown prominently.
2. **Given** the user marked a Doppler scan as advised and it is not done, **When** the user opens Today, **Then** a reminder is visible until marked done; without that flag no reminder is shown.

---

### User Story 7 - MRI findings and programme checkpoints (Priority: P3)

A reference page explains common MRI findings in plain language with "what it changes", the first 2–3 week adjustments, the questions to ask the surgeon, and a timeline of checkpoints: 6-week and 3-month surgeon reviews and the 6-month progression. The user sees weeks elapsed since start and the next checkpoint, and can add notes at each checkpoint.

**Why this priority**: Valuable context and planning, but not needed daily.

**Independent Test**: Set a start date and see "Week N" and the date of the next checkpoint.

**Acceptance Scenarios**:

1. **Given** a start date, **When** viewing Checkpoints, **Then** 6-week, 3-month and 6-month dates are shown with countdown.
2. **Given** a checkpoint, **When** the user adds a note, **Then** it is saved and shown.

---

### User Story 8 - Vegetarian food plan and protein tracking (Priority: P3)

The user sees the food plan (strictly vegetarian, no onion, garlic or root vegetables): the plate guide, the daily eating pattern, and the 7-day rotation for breakfast, lunch, evening snack and dinner. Today's meals are shown with estimated protein; the user ticks meals eaten and sees protein progress against about 105 g/day, plus a water goal (2.5–3 L).

**Why this priority**: Supports recovery, but it is secondary to the exercise loop.

**Independent Test**: Open Food on a Wednesday, see Wednesday's rotation, tick lunch, and see the protein total increase.

**Acceptance Scenarios**:

1. **Given** Wednesday, **When** opening Food, **Then** the Wednesday rotation meals are shown.
2. **Given** meals ticked, **When** viewing the total, **Then** protein is the sum of ticked meals versus the 105 g target.

---

### Edge Cases

- Missed days: walk target after a gap stays at the last value or restarts shorter after a swollen/gave-way day; streak resets without erasing history.
- Morning check not done: Today shows the full plan with a prompt to do the check first.
- Check done twice in a day: the latest answer replaces the earlier one and the plan is recomputed.
- Timezone or midnight rollover while the app is open: Today refreshes to the new date.
- Offline use with no connection after first load: everything works.
- Browser data cleared: the user is warned that data lives only on the device and can export/import a backup.
- Editing a past day's ticks or log is allowed.
- Gave-way event and calf-pain warning on the same day: both warnings appear; the stop notice takes priority in Today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a Today view with Morning, Before lunch, Evening and desk mini-session items, each with description, amount and card code.
- **FR-002**: The system MUST choose the evening session by weekday: Day A (Mon/Wed/Fri), Day B (Tue/Thu/Sat), lighter plan on Sunday.
- **FR-003**: Users MUST be able to mark a day as a yoga day, replacing the evening session with the yoga sequence entry.
- **FR-004**: Users MUST be able to tick and untick each item and see per-session and per-day completion.
- **FR-005**: The system MUST provide a card for every exercise (M1–M6, L1–L5, E1–E11, B1–B8), including band basics, with steps, hold/repeat, breathing, feel, knee safety, easier, harder and stop-if where the source defines them.
- **FR-006**: Users MUST be able to search and browse the card library by code, name and category.
- **FR-007**: The system MUST offer the next-morning knee check with the four outcomes and apply the plan adjustments defined in the programme.
- **FR-008**: The system MUST manage a walk-minutes target starting at 15–20 min, +5 min on calm days, capped at 40, and reduce or restart it after puffy, swollen or gave-way days.
- **FR-009**: The system MUST record a daily log: swelling, pain, walk minutes, giving-way events and notes.
- **FR-010**: The system MUST show current and best streaks and a weekly adherence view, and trends of walk minutes, swelling and pain.
- **FR-011**: The system MUST provide tap counters for quad sets, heel props and ankle pumps with daily targets and a heel-prop 10-minute timer.
- **FR-012**: The system MUST display the safety warnings (calf pain/swelling same-day check, giving-way stop rule, stop-if guidance) and a persistent not-medical-advice notice.
- **FR-013**: The system MUST let the user flag that a Doppler scan was advised, then show a reminder until it is marked done.
- **FR-014**: The system MUST present the MRI findings page and the first 2–3 week adjustments.
- **FR-015**: The system MUST show programme week, and the 6-week, 3-month and 6-month checkpoints with notes, from a user-set start date.
- **FR-016**: The system MUST present the vegetarian food plan (plate guide, eating pattern, 7-day rotation) and respect the no onion, garlic or root vegetables constraint in all content.
- **FR-017**: Users MUST be able to tick meals and see protein progress against about 105 g and water against the daily goal.
- **FR-018**: The system MUST work fully offline after first load, be usable on a phone-sized screen, and store all data on the user's device only, without accounts.
- **FR-019**: Users MUST be able to export and import their data as a backup file.

### Key Entities

- **Programme Start**: the start date, from which week number and checkpoints derive.
- **Exercise Card**: code, name, group (M/L/E/B), category, steps, amount, breath, feel, safety, easier, harder, stop-if.
- **Session Template**: Morning, Before lunch, Evening Day A / Day B / Sunday / Yoga, and desk mini-sessions, each with ordered items referencing cards.
- **Day Entry**: date, ticked items, yoga flag, knee check result, counters, log fields (swelling, pain, walk minutes, giving-way events, notes), meals ticked.
- **Walk Target**: the current recommended walk minutes derived from knee checks.
- **Checkpoint**: 6-week, 3-month, 6-month with date and user notes.
- **Meal**: day, slot, dishes, protein estimate.
- **Safety To-do**: Doppler scan status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can open the app and tick off a completed exercise in under 10 seconds.
- **SC-002**: A user can complete the morning knee check and see the adjusted plan in under 20 seconds.
- **SC-003**: All 30+ cards from the source programme are reachable within 3 taps from Today.
- **SC-004**: After first load, 100% of features work with no network connection.
- **SC-005**: The calf-pain/swelling warning is visible within 1 tap from any screen and is shown immediately on entry of those symptoms.
- **SC-006**: A week of use can be reviewed in a single view showing adherence per day and session.
- **SC-007**: The plan shown for each knee-check outcome matches the programme's rules in 100% of test cases.
- **SC-008**: No meal in the food plan contains onion, garlic or root vegetables.

## Assumptions

- Single user (the person recovering), single device; no accounts, sharing or sync in v1.
- Data stays in the browser; backup is by manual export/import.
- Content is taken from the source PDF; the PDF's 7-day rotation and protein estimates are used as is. The yoga sequence is a separate document, so only a placeholder entry is shown for it.
- The user's programme start date defaults to today and can be edited.
- Phases beyond Phase 1 (months 2–6) are shown as reference content, not as separately tracked schedules.
- Notifications and reminders are out of scope for v1.
- The app is a personal aid, not medical advice; it does not diagnose and always defers to the physio/surgeon.
- The MRI and safety content is generic educational material about common ACL-related findings; no personal medical data is included in the product or repository.
