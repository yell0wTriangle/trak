# ABSTRACT

Students manage coursework, deadlines, group activities, and personal routines across separate tools. This project presents **trak**, a productivity application that combines task planning, habits, focus sessions, and calendar events. Users organize tasks into projects, set schedules, add subtasks, track habits, focus on selected work, and review progress. Signed-in users can connect Google Calendar or Microsoft Outlook when OAuth is configured.

trak is built with Next.js, TypeScript, and Supabase. Guest mode stores data locally and opens with sample college-life content; registered accounts use cloud storage and client-side content encryption. The application also provides statistics, reminders, import/export tools, and offline-capable behavior. This report describes its requirements, design, implementation, verification approach, results, future scope, and team contributions.

**Keywords:** Productivity Application, Task Management, Habit Tracking, Focus Timer, Calendar Integration, Next.js, Supabase

---

# Contents

| Section | Title | Page |
|---|---|---:|
|  | Abstract | — |
|  | List of Figures | — |
| 1 | Introduction | 1 |
| 2 | Literature Review | 2 |
| 2.1 | Personal Productivity Systems | 2 |
| 2.2 | Task and Project Management | 2 |
| 2.3 | Habit Tracking and Frequency Models | 3 |
| 2.4 | Focus Sessions and Time Management | 3 |
| 2.5 | Calendar Integration and Notifications | 3 |
| 2.6 | Offline-Capable Web Applications | 4 |
| 3 | Problem Statement | 5 |
| 3.1 | Project Planning | 6 |
| 3.2 | Project Analysis (SRS) | 7 |
| 3.3 | System Design | 8 |
| 3.3.1 | Design Constraints | 8 |
| 3.3.2 | Context Diagram and DFD | 9 |
| 4 | Implementation | 10 |
| 4.1 | Methodology / Proposal | 10 |
| 4.2 | Testing / Verification Plan | 12 |
| 4.3 | Result Analysis / Screenshots | 14 |
| 4.4 | Quality Assurance | 15 |
| 5 | Standards Adopted | 16 |
| 5.1 | Design Standards | 16 |
| 5.2 | Coding Standards | 16 |
| 5.3 | Testing Standards | 17 |
| 6 | Conclusion and Future Scope | 18 |
| 6.1 | Conclusion | 18 |
| 6.2 | Future Scope | 18 |
|  | References | 20 |
|  | Individual Contribution | 21–24 |
|  | Plagiarism Report | 25 |

# List of Figures

| Figure | Title | Page |
|---|---|---:|
| 3.1 | trak Context Diagram | 9 |
| 3.2 | Level 1 Data Flow Diagram | 9 |
| 4.1 | trak Home and Task Workspace | 14 |

---

# Chapter 1 — Introduction

University students often balance assignments, examinations, group projects, classes, social commitments, and personal routines. These responsibilities are commonly recorded across notebooks, calendar applications, reminder tools, and habit trackers. When information is distributed across several systems, it becomes difficult to see the relationship between a deadline, the work required to meet it, and the time available to complete it. A student may know that an assignment is due without having a practical plan for breaking it into manageable steps.

This project introduces **trak**, a web-based productivity application for organizing everyday work. It combines task and project management with habit tracking, a focus timer, calendar planning, and progress statistics. Tasks can have priorities, descriptions, subtasks, schedules, and recurrence rules. Projects group related work, while list and board views support different ways of reviewing it. Search and keyboard navigation help users reach tasks and commands quickly.

The application also supports habits with flexible schedules, including daily targets, a specified number of completions within a time window, and measurable values. A focus timer can be associated with a task so that a work session is recorded in context. The calendar presents scheduled tasks alongside events created in trak. Signed-in users can connect Google Calendar or Microsoft Outlook for on-demand synchronization when the corresponding OAuth settings are available.

trak is designed to support both local guest use and registered accounts. A guest can begin without creating an account; the browser stores guest information and supplies a sample college-life workspace. Registered accounts use Supabase services for authentication and cloud persistence. Content encryption is performed on the user's device, while selected scheduling metadata remains available to support features such as reminders. This report presents the motivation, requirements, design, implementation, verification approach, results, standards, future work, and individual contributions for trak.

# Chapter 2 — Literature Review

## 2.1 Personal Productivity Systems

Personal productivity systems help users capture responsibilities, prioritize work, and review progress. Separate task lists, calendars, and habit tools can fragment a user's plans. A unified workspace can connect a task to its project, schedule, and completion history. For students, this means moving from a course project to its next actionable step without switching applications.

Effective systems distinguish urgent work from flexible activities and provide a manageable view of what comes next. Users need both quick capture and later review; a task should not require full planning at the moment it is recorded. Projects, dates, priorities, and completion history provide this structure in trak.

## 2.2 Task and Project Management

Task-management systems represent work as items that can be prioritized, scheduled, grouped, and completed. Projects relate tasks to courses or goals; subtasks divide assignments into actions; recurrence reduces repeated entry. trak supports list and board views, notes, priorities, subtasks, completion history, and recurring tasks. Optimistic updates make changes appear promptly and allow a failed save to roll back.

Search and grouping become more useful as task lists grow. Users can find an item, group work by project or date, and review completed tasks through the logbook. This supports both daily planning and retrospective review.

## 2.3 Habit Tracking and Frequency Models

Habit trackers record repeated behaviors and compare activity with a chosen schedule. Daily streaks do not suit every goal, so frequency-aware tracking supports goals such as several sessions per week. trak provides Boolean and measurable habits, daily or interval-based frequencies, targets, entry history, skips, and schedule-aware progress.

Recording a skip separately from an unrecorded day can represent planned rest or exceptions. Past entries help users understand consistency over time rather than relying only on a current streak. trak includes entry history and per-habit insights.

## 2.4 Focus Sessions and Time Management

Pomodoro-style methods divide work into focus intervals and breaks. Linking a timer to a task provides more useful history than recording time alone. trak offers a configurable timer, floating countdown, task subtasks, and focus statistics. Registered users can hand off timer state between devices; this does not imply continuous synchronization of all content.

Keeping the countdown visible while navigating reduces the need to return to a dedicated timer screen. Recorded sessions also help users compare planned work with time spent.

## 2.5 Calendar Integration and Notifications

A calendar places time-specific commitments in chronological context. trak offers month, week, and multi-day views, event creation, reminders, and `.ics` import/export. Google Calendar and Microsoft Outlook connection flows are implemented for registered accounts, require OAuth configuration, and sync on demand. CalDAV is unavailable. Push notifications and briefings also require VAPID setup, deployed Supabase functions, browser permission, and service-worker support.

External calendar access depends on the user's provider permissions. trak's internal calendar remains useful without an external connection; configured accounts can choose which provider calendars to include.

## 2.6 Offline-Capable Web Applications

Progressive web application techniques support installation and selected offline behavior. trak stores guest data locally and uses an offline-capable application shell; registered data uses Supabase. Clearing guest storage and refreshing initializes sample data again. Service-worker behavior depends on the build and development mode.

Offline operation does not make remote features available: authentication, external calendar requests, push delivery, and cloud persistence still require their services. The application therefore separates local guest workflows from server-dependent capabilities.

# Chapter 3 — Problem Statement

Students need to manage coursework, daily responsibilities, and personal goals in a way that connects planning with action. A list alone may show what is due but not how to divide the work. A calendar may show classes but not habit progress. A timer may record work without indicating which task it supported. When these tools are disconnected, the student must maintain the relationships manually.

The problem addressed by trak is the absence of a single, adaptable workspace that supports task organization, subtasks, flexible recurring schedules, habit tracking, focused work, calendar planning, and review of progress. The solution must remain approachable for a student who wants to begin immediately, while supporting accounts and optional cloud services for users who need them. It must also distinguish local guest operation from authenticated services and from calendar integrations that require external configuration.

## 3.1 Project Planning

The project was planned as a modular web application. Planning centered on the student workflow of capturing, organizing, scheduling, completing, and reviewing work, then extended it with habits, focus timing, calendar events, and statistics.

**Requirement identification**

- Manage tasks, projects, priorities, notes, subtasks, and schedules.
- View, search, and review tasks in list or board formats.
- Track recurring tasks, habits, and task-linked focus sessions.
- Present scheduled tasks and events in calendar views.
- Support local guests, registered accounts, statistics, reminders, and data portability.

**Technology selection**

- Application: Next.js App Router, React, TypeScript, and Tailwind CSS.
- Client state: TanStack Query for product data and Zustand for local UI state.
- Backend: Supabase Auth, PostgreSQL, Row Level Security, and Edge Functions.
- Guest persistence: local storage and IndexedDB-backed query persistence.

**Implementation phases**

1. Define application structure, domain types, and navigation.
2. Implement task, habit, calendar, and focus workflows.
3. Add account persistence, encryption, and configured integrations.
4. Add statistics, reminders, portability, and offline behavior.
5. Verify workflows with unit, integration, and browser tests.

## 3.2 Project Analysis (SRS)

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Create and manage tasks, projects, and subtasks. |
| FR-02 | Set priorities, schedules, notes, and recurrence. |
| FR-03 | Track Boolean and measurable habits. |
| FR-04 | Record task-linked focus sessions. |
| FR-05 | Display tasks and events in calendar views. |
| FR-06 | Provide local guest mode and registered accounts. |
| FR-07 | Calculate task, habit, and focus statistics. |
| FR-08 | Support file portability and configured services. |

### Non-Functional Requirements

| Category | Requirement |
|---|---|
| Usability | Core workflows support desktop and mobile. |
| Responsiveness | Changes appear promptly and failures are communicated. |
| Reliability | Validate inputs and handle recoverable errors. |
| Security | Scope account records through database policies. |
| Privacy | Encrypt registered user-authored content on the client. |

### Feasibility Analysis

**Technical feasibility:** Established web technologies, Supabase, and browser storage support the application. External services require configuration.

**Operational feasibility:** Guests start without accounts; cloud features and integrations require setup.

**Economic feasibility:** Open-source frameworks support development; hosting and provider limits affect deployment costs.

## 3.3 System Design

trak separates Next.js routes, reusable components, and data access. Guest operations use the local store; registered operations use Supabase. Temporary UI state remains separate from persistent records.

### 3.3.1 Design Constraints

- Guest data stays in the browser and is not synced across devices.
- Google and Outlook require an account and OAuth setup; CalDAV is unavailable.
- Push requires VAPID keys, deployed functions, browser permission, and a service worker.
- Registered content encryption uses a device-held passphrase.
- WebDAV is manual backup and restore, not sync.

**Software requirements:** Node.js 24+, npm, a modern browser, and Supabase. OAuth and push need additional configuration.

**Hardware requirements:** A modern computer, tablet, or phone with a supported browser. Cloud and remote services require network access.

### 3.3.2 Context Diagram and Data Flow Diagram

The **context diagram (Figure 3.1)** shows the user, trak, local guest storage, Supabase, and optional Google, Outlook, and Web Push services.

The **Level 1 Data Flow Diagram (Figure 3.2)** shows the interface, data layer, authentication, productivity logic, external adapters, and persistence. User actions reach local storage or Supabase; configured adapters exchange calendar or notification data with external services.

# Chapter 4 — Implementation

The implementation follows a modular approach. App Router routes compose domain components, while data access and business logic are organized in reusable libraries and hooks. The application uses TypeScript types for tasks, projects, habits, focus records, calendar events, and user settings. Shared UI primitives provide consistent dialogs, menus, forms, and responsive layouts.

## 4.1 Methodology / Proposal

### Step-by-Step Methodology

**1. User entry and workspace initialization.** The user enters as a guest or signs in. Guest mode loads a sample in browser storage; registered mode loads account-owned Supabase records.

**2. Task and project planning.** The user creates and schedules tasks, groups them into projects, and divides assignments into subtasks. Recurrence supports repeated work; list and board layouts provide alternate views.

**3. Habit routines.** The user selects a Boolean or measurable habit, sets its frequency, and records completions, skips, or measurements. Views display progress and history.

**4. Calendar planning.** Calendar views combine scheduled tasks and events. Users can create events and use `.ics` files. Registered users can authorize Google or Outlook and sync selected calendars on demand when OAuth is configured.

**5. Focus sessions.** A task-linked timer displays the countdown and subtasks. Completed sessions contribute to statistics; registered timer state uses server time.

**6. Review and adjustment.** Statistics summarize completed work, habits, focus time, and goals, helping the user plan the next period.

### Architecture and Technologies

| Layer | Technologies / Responsibility |
|---|---|
| Web application | Next.js App Router, React, TypeScript |
| Presentation | Tailwind CSS and reusable components |
| Client data | TanStack Query and Zustand |
| Persistence | Browser storage; Supabase Auth and PostgreSQL |
| Authorization | PostgreSQL Row Level Security |
| Integrations | Google Calendar, Microsoft Graph, optional Web Push |
| Data utilities | Todoist, Loop Habit Tracker, iCalendar files |

Registered user-authored fields are encrypted on the client. Account identity and selected schedule metadata remain server-side for authentication, reminders, and analytics.

The data layer uses query hooks and mutations to load and update product records. Zustand stores temporary interface and timer state. This arrangement keeps local interactions responsive while directing guest data to browser storage and registered data to Supabase. External services remain optional and are activated only when their credentials and server components are configured.

## 4.2 Testing / Verification Plan

Verification covers logic, connected data flows, and user-visible behavior. The repository contains unit, integration, and browser tests. OAuth and push require configured services for operational verification.

| Test Area | Verification Activity | Expected Result |
|---|---|---|
| Test Area | Verification | Expected Result |
|---|---|---|
| Tasks | Create, edit, complete, reorder, and delete. | UI and stored data agree; failures recover. |
| Recurrence | Verify generated occurrences. | Dates follow the selected rule. |
| Habits | Record done, skip, and measured entries. | History reflects the schedule. |
| Focus | Start, pause, and complete a session. | Timer state and session record agree. |
| Calendar | Create events and import/export `.ics`. | Items appear at expected times. |
| Guest | Initialize, edit, clear, and refresh sample data. | Local data persists; refresh after clear reseeds sample. |
| Accounts | Verify authenticated access boundaries. | Users access only their own records. |
| Services | Test OAuth and push with deployed configuration. | Configured provider flows complete. |

## 4.3 Result Analysis / Screenshots

The implemented application combines tasks, projects, habits, focus sessions, calendar views, and progress statistics. Guest mode supplies local sample data; registered accounts add Supabase persistence. The interface supports list and board views, recurring schedules, subtasks, frequency-based habits, and task-linked focus sessions.

The screenshot montage should demonstrate how users move from a project list into task details, then review related habits, calendar events, focus activity, and statistics. It represents the implemented interface rather than a separate resume-analysis workflow.

Optional services depend on configuration. Google and Outlook require OAuth credentials and an account. Push and scheduled briefings require VAPID values, deployed functions, browser permission, and service-worker support. A source-code integration is not necessarily active in every environment.

**Figure 4.1 — trak application screens:** Insert a current screenshot or montage showing the Home workspace, habits, focus timer, calendar, and statistics.


## 4.4 Quality Assurance

Quality assurance checks correctness, usability, data boundaries, and failure behavior. Typed inputs and validation support task, habit, calendar, and timer operations. Mutations update the interface promptly and can roll back failed saves. Errors are surfaced or recorded rather than silently ignored.

Database policies isolate account records, and client-side encryption protects registered user-authored content. Imports and restores require validation because they can change large amounts of data. Responsive layouts, keyboard navigation, and accessible controls support different devices and input methods. OAuth, push, briefings, and service workers must be checked in a configured deployment; local core workflows do not prove remote services are active.

Verification should also confirm that invalid dates, malformed imports, and unavailable network requests produce understandable feedback. These checks reduce the risk of silent data loss and help distinguish application defects from missing service configuration.

# Chapter 5 — Standards Adopted

## 5.1 Design Standards

The system uses a modular, component-based application design. Routing and page composition are kept separate from domain data access and presentation components. Shared interface elements are used for repeated interactions such as dialogs, forms, menus, and notifications. Responsive design supports desktop and mobile layouts, while keyboard accessibility and semantic controls support users who navigate without a pointer.

Data-flow diagrams should distinguish local guest storage, authenticated cloud persistence, and optional third-party services. Database access rules are enforced at the database layer using user ownership and Row Level Security. Optional integrations are shown with configuration requirements so that a design diagram does not imply unsupported or inactive functionality.

## 5.2 Coding Standards

The project follows consistent TypeScript and React conventions. Types describe application records and function inputs. Components are organized by domain, while data access and business logic are placed in reusable hooks and libraries. Names should describe the purpose of variables, components, and functions. Formatting is enforced with Prettier and lint rules.

Asynchronous operations use explicit success and error handling. User-visible data changes are routed through the data layer rather than issuing ad hoc database calls from presentation components. Secrets are read from environment configuration and are not embedded in browser code or committed to source control. Database changes are represented through schema and migration files rather than being edited as generated application artifacts.

## 5.3 Testing Standards

Testing follows a layered approach:

- **Unit testing:** verifies pure functions, recurrence calculations, format conversion, and validation logic.
- **Component and integration testing:** verifies interaction between React components, query hooks, mutations, and local stores.
- **End-to-end testing:** verifies user workflows in a browser, including guest mode, navigation, task interactions, and responsive behavior.
- **Security testing:** checks row ownership, access controls, encryption behavior, and safe handling of untrusted imports.
- **Service verification:** tests OAuth, push, and scheduled functions only in an environment with valid credentials, browser permission, and deployed services.

Test cases should include normal, invalid, boundary, and failure conditions. Verification results should record the environment and configuration used. A feature that is covered by source code but has not been exercised against configured external services should be reported as implemented but not operationally verified.

# Chapter 6 — Conclusion and Future Scope

## 6.1 Conclusion

trak addresses the fragmentation of student planning by combining tasks, projects, habits, focus sessions, calendar events, and progress review. Users can organize coursework into projects, divide assignments into subtasks, schedule recurring work, build flexible habits, and associate focused work sessions with tasks. Calendar and statistics views help connect plans with activity over time.

The application supports local guest use with sample college-life data and registered accounts backed by Supabase. Its modular design separates interface state from persistent product data and accommodates both browser-local workflows and account-based features. Calendar integrations, reminders, and scheduled briefings are implemented as configurable services; they require provider credentials, deployment configuration, browser permission, and appropriate runtime support.

The project demonstrates how a modern web application can support a student's daily planning loop: capture responsibilities, schedule them, focus on the next action, maintain habits, and review progress. It also establishes a foundation for further usability improvements and for operationally validating optional services in a complete deployment.

## 6.2 Future Scope

Several extensions could improve trak. A shared project mode could support group assignments, task ownership, and collaborative progress tracking. More flexible timetable imports could reduce manual entry of classes and recurring academic events. Calendar synchronization could be expanded after provider configuration and deployment are tested across supported accounts and edge cases.

Further work could improve onboarding so users can choose a sample, begin with an empty workspace, or import existing tasks. The focus timer could offer additional study/break patterns and richer per-course reports. Statistics could provide configurable academic-period summaries and visual comparisons without exposing private task content. Accessibility testing with assistive technologies and usability sessions with students could guide interface refinements.

Operational future work includes documenting OAuth setup for each supported calendar provider, completing push-service deployment instructions, and verifying scheduled briefings in a deployed Supabase environment. Continuous background calendar synchronization and realtime mirroring of all task and habit content are not current features and would require separate design, service-cost analysis, and implementation.

# References

1. Vercel, “Next.js App Router Documentation,” [Online]. Available: https://nextjs.org/docs/app
2. Supabase, “Supabase Auth Documentation,” [Online]. Available: https://supabase.com/docs/guides/auth
3. Supabase, “Row Level Security,” [Online]. Available: https://supabase.com/docs/guides/database/postgres/row-level-security
4. Google for Developers, “Google Calendar API Overview,” [Online]. Available: https://developers.google.com/workspace/calendar/api/guides/overview
5. Microsoft, “Calendar in Microsoft Graph,” [Online]. Available: https://learn.microsoft.com/en-us/graph/api/resources/calendar-overview?view=graph-rest-1.0
6. TanStack, “TanStack Query Documentation,” [Online]. Available: https://tanstack.com/query/latest/docs/framework/react/overview
7. React Team, “React Documentation,” [Online]. Available: https://react.dev/learn
8. PostgreSQL Global Development Group, “PostgreSQL Documentation,” [Online]. Available: https://www.postgresql.org/docs/
9. W3C, “Web App Manifest,” [Online]. Available: https://www.w3.org/TR/appmanifest/
10. trak Project Documentation, “Features and Domain Glossary,” project README and `docs/features.md`, 2026.

# Individual Contribution

## ABHIJEET PATRA

**Roll Number: 23051805**

**Abstract:** trak combines task, habit, focus, and calendar features. Registered accounts use Supabase, while guest data stays local.

**Individual contribution and findings:** Abhijeet focused on the backend data and account foundation. His area included the PostgreSQL entities for tasks, projects, habits, events, and profiles; Supabase authentication; and account-scoped access. Row Level Security policies restrict registered users to their own records. This work gives application features a common persistence layer and separates guest-local data from registered cloud data. The principal finding was that account authorization must be enforced by the database, not only by interface checks.

**Individual contribution to project report preparation:** Documented the account model, backend data entities, and database access approach.

**Individual contribution for project presentation and demonstration:** Presented the Supabase data foundation and explained authentication and account-level access rules.

## ADITYA VIKRAM

**Roll Number: 23051810**

**Abstract:** trak includes calendar and reminder workflows connecting user plans to external services.

**Individual contribution and findings:** Aditya Vikram focused on integrations and automation: Google and Outlook OAuth, calendar selection, and on-demand event sync. He also worked on task, habit, event, focus, and daily-briefing notification workflows using browser push and Supabase Edge Functions. These require provider credentials, VAPID configuration, deployed functions, browser permission, and service-worker support. A key finding was that integration code requires deployment configuration before it can run.

**Individual contribution to project report preparation:** Documented calendar and notification flows.

**Individual contribution for project presentation and demonstration:** Explained service setup and demonstrated configured workflows where available.

## ANOUSHKA CHOUDHARY

**Roll Number: 23051816**

**Abstract:** trak presents tasks, habits, focus sessions, calendars, and statistics as one weekly planning workflow.

**Individual contribution and findings:** Anoushka Choudhary focused on UI/UX, application flow, and documentation. She shaped navigation across projects, task details, calendar, habits, focus, and statistics, with desktop and mobile use in mind. The interface guides users to divide assignments into subtasks, review schedules, and return to progress after completion. Guest sample content helps explain the app without an account. Her documentation clarified workflows and setup for users and teammates. The main finding was that consistent navigation and terminology make a multi-feature app easier to learn.

**Individual contribution to project report preparation:** Documented application flow and user-facing features.

**Individual contribution for project presentation and demonstration:** Presented the user journey and key screens.

## AYUSMAN PATI

**Roll Number: 23051824**

**Abstract:** trak connects tasks, habits, focus, and calendar activity to progress views.

**Individual contribution and findings:** Ayusman Pati focused on application data workflows, including query and mutation paths for guest and account records, recurring tasks and habits, and statistics. His area also included guest initialization, account migration, and import/export operations. Separating persistent records from temporary UI state supports consistent behavior. The work showed the importance of clear data ownership across guest and registered modes.

**Individual contribution to project report preparation:** Documented data flows and recurrence behavior.

**Individual contribution for project presentation and demonstration:** Explained data workflows behind task, habit, and progress views.

# Plagiarism Report

Insert the official plagiarism report generated for the final trak report here. This section must contain the institution-approved report and actual score; no result is supplied in this replacement text.
