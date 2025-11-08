# CloudVault - Project Board Structure

This document defines the project board structure for managing CloudVault development using Kanban or Scrum methodology.

---

## Board Overview

**Board Type**: Kanban with Sprint Planning  
**Tool Recommendations**: GitHub Projects, Jira, Linear, or Trello

---

## Column Structure

### 1. 📋 Backlog
**Purpose**: All planned work not yet started

**Criteria for Entry**:
- Ticket created with description
- Acceptance criteria defined
- Priority assigned
- Estimate provided

**Sorting**:
- Sort by priority (Critical → High → Medium → Low)
- Then by phase (Phase 1 → Phase 2 → Phase 3 → Phase 4)

---

### 2. 📝 Ready for Development
**Purpose**: Tickets ready to be picked up by developers

**Criteria for Entry**:
- All dependencies resolved
- Design/mockups available (if needed)
- Technical approach agreed upon
- Assigned to sprint (if using Sprints)

**Limit**: Max 10 tickets (to prevent overwhelming the team)

---

### 3. 🚧 In Progress
**Purpose**: Active development work

**Criteria for Entry**:
- Developer assigned
- Work started
- Branch created (if using Git flow)

**Limit**: Max 2 tickets per developer (to encourage focus)

**Sub-columns** (optional):
- In Development
- In Code Review

---

### 4. 🧪 Testing / QA
**Purpose**: Tickets awaiting or undergoing testing

**Criteria for Entry**:
- Code complete
- Pull request created
- Unit tests passing
- Deployed to staging (if applicable)

**Criteria for Exit**:
- All acceptance criteria verified
- No critical bugs found
- Code review approved

---

### 5. ✅ Done
**Purpose**: Completed work

**Criteria for Entry**:
- All acceptance criteria met
- Code merged to main branch
- Deployed to production (or ready for deployment)
- Documentation updated

**Archive**: Move to archive after 2 weeks

---

### 6. 🚫 Blocked
**Purpose**: Work that cannot proceed due to blockers

**Criteria for Entry**:
- Clear blocker identified
- Blocker documented in ticket
- Escalated to appropriate person

**Daily Review**: Check all blocked tickets in standup

---

## Labels / Tags

### Priority Labels
- 🔴 **Critical** - Blocks other work, must be done immediately
- 🟠 **High** - Important for current sprint
- 🟡 **Medium** - Should be done soon
- 🟢 **Low** - Nice to have, can be deferred

### Type Labels
- 🎨 **Frontend** - UI/UX work
- ⚙️ **Backend** - Server-side logic
- 🗄️ **Database** - Data model changes
- 🔧 **DevOps** - Infrastructure/deployment
- 🐛 **Bug** - Fixing defects
- 📚 **Documentation** - Docs and guides
- 🧪 **Testing** - Test creation/updates

### Phase Labels
- 📦 **Phase 1: MVP** - Core functionality
- 🎯 **Phase 2: Enhanced** - User experience
- 🚀 **Phase 3: Production** - Performance & security
- 🎉 **Phase 4: Launch** - Testing & deployment

### Component Labels
- 🔐 **Auth** - Authentication/authorization
- 📁 **Files** - File management
- 📂 **Folders** - Folder operations
- 🔗 **Sharing** - File sharing/transfers
- 💾 **Storage** - Storage management
- 👤 **Profile** - User profiles
- 📊 **Analytics** - Tracking/reporting
- 🔔 **Notifications** - Alerts/emails

### Status Labels
- ⏸️ **Blocked** - Cannot proceed
- 🔄 **In Review** - Awaiting code review
- ⚠️ **Needs Discussion** - Requires team input
- 🎯 **Ready** - Ready to start

---

## Sprint Structure (if using Scrum)

### Sprint Duration
**2 weeks** (10 working days)

### Sprint Ceremonies

#### 1. Sprint Planning (Monday, Week 1)
**Duration**: 2 hours  
**Attendees**: Full team

**Agenda**:
- Review sprint goal
- Select tickets from backlog
- Estimate story points
- Assign tickets to developers
- Identify dependencies and risks

**Output**: Sprint backlog with committed tickets

---

#### 2. Daily Standup (Every day)
**Duration**: 15 minutes  
**Attendees**: Full team

**Format** (each person):
- What I did yesterday
- What I'm doing today
- Any blockers

**Rules**:
- Keep it brief
- Discuss details offline
- Update board before standup

---

#### 3. Sprint Review (Friday, Week 2)
**Duration**: 1 hour  
**Attendees**: Team + stakeholders

**Agenda**:
- Demo completed work
- Review sprint metrics
- Gather feedback
- Update product backlog

**Output**: Stakeholder feedback, backlog updates

---

#### 4. Sprint Retrospective (Friday, Week 2)
**Duration**: 1 hour  
**Attendees**: Full team

**Agenda**:
- What went well
- What didn't go well
- Action items for improvement

**Output**: Process improvements for next sprint

---

## Ticket Workflow

### 1. Ticket Creation
```
Backlog → Add ticket with:
- Title (clear, concise)
- Description (context, requirements)
- Acceptance criteria (testable)
- Priority label
- Type label
- Phase label
- Component label
- Estimate (hours or story points)
```

### 2. Ticket Refinement
```
Backlog → Ready for Development
- Review technical approach
- Break down if too large (>8 hours)
- Add design/mockup links
- Verify dependencies
- Assign to sprint
```

### 3. Development
```
Ready → In Progress
- Assign to developer
- Create feature branch
- Update ticket with branch name
- Move to "In Progress"
- Add comments for progress updates
```

### 4. Code Review
```
In Progress → Testing/QA
- Create pull request
- Link PR to ticket
- Request code review
- Address review comments
- Get approval
```

### 5. Testing
```
Testing/QA → Done
- Verify acceptance criteria
- Test on staging
- Check for regressions
- Get QA approval
- Merge to main
```

### 6. Completion
```
Done → Archive
- Deploy to production
- Update documentation
- Close ticket
- Archive after 2 weeks
```

---

## Metrics to Track

### Sprint Metrics
- **Velocity**: Story points completed per sprint
- **Burndown**: Work remaining over time
- **Cycle Time**: Time from start to done
- **Throughput**: Tickets completed per sprint

### Quality Metrics
- **Bug Rate**: Bugs per feature
- **Rework Rate**: Tickets reopened
- **Code Review Time**: Time in review
- **Test Coverage**: % of code tested

### Team Metrics
- **WIP Limit**: Tickets in progress per person
- **Blocked Time**: Time tickets spend blocked
- **Lead Time**: Time from backlog to done

---

## Example Sprint Backlog (Sprint 1)

### Sprint Goal
"Set up project foundation and implement authentication"

### Committed Tickets (40 story points)

| Ticket | Title | Assignee | Points | Priority |
|--------|-------|----------|--------|----------|
| 1.1 | Create TypeScript Data Model Interfaces | Backend Dev | 3 | Critical |
| 1.2 | Define Service Interface Contracts | Backend Dev | 2 | Critical |
| 1.3 | Create Error Response Types | Backend Dev | 2 | High |
| 1.4 | Set Up Utility Functions | Frontend Dev | 3 | Medium |
| 2.1 | Add MFA Setup Flow | Backend Dev | 8 | High |
| 2.2 | Create MFA UI Components | Frontend Dev | 5 | High |
| 2.3 | Implement Token Refresh | Backend Dev | 3 | Critical |
| 2.4 | Add Session Persistence | Backend Dev | 3 | Medium |
| 2.5 | Enhance Auth Error Handling | Backend Dev | 3 | High |
| ENV.1 | Set up AWS Environment | DevOps | 5 | Critical |
| ENV.2 | Configure Amplify Gen 2 | DevOps | 3 | Critical |

**Total**: 40 story points

---

## Board Views

### View 1: By Phase
Group tickets by phase labels to see progress across the roadmap.

### View 2: By Assignee
Group tickets by assignee to see individual workload.

### View 3: By Priority
Group tickets by priority to focus on critical work.

### View 4: By Component
Group tickets by component to see feature progress.

---

## Automation Rules

### Rule 1: Auto-assign labels
- When ticket title contains "bug" → Add 🐛 Bug label
- When ticket title contains "test" → Add 🧪 Testing label

### Rule 2: Auto-move on PR
- When PR created → Move ticket to Testing/QA
- When PR merged → Move ticket to Done

### Rule 3: Stale ticket alerts
- If ticket in "In Progress" > 5 days → Add comment asking for update
- If ticket in "Blocked" > 3 days → Notify team lead

### Rule 4: Sprint automation
- When sprint starts → Move "Ready" tickets to "In Progress"
- When sprint ends → Move incomplete tickets back to "Backlog"

---

## GitHub Projects Setup (Recommended)

### 1. Create Project
```
Repository → Projects → New Project
- Name: CloudVault Development
- Template: Board
```

### 2. Add Custom Fields
- Priority (Single select: Critical, High, Medium, Low)
- Phase (Single select: Phase 1, Phase 2, Phase 3, Phase 4)
- Estimate (Number: hours or story points)
- Component (Single select: Auth, Files, Folders, etc.)

### 3. Create Views
- **Board View**: Default Kanban board
- **Sprint View**: Filter by current sprint
- **Roadmap View**: Timeline by phase
- **Team View**: Group by assignee

### 4. Link Issues
- Create issues from tickets.md
- Link to project board
- Add labels and custom fields

---

## Jira Setup (Alternative)

### 1. Create Project
```
Projects → Create Project
- Type: Kanban or Scrum
- Name: CloudVault
```

### 2. Configure Board
- Add columns: Backlog, Ready, In Progress, Testing, Done, Blocked
- Set WIP limits
- Add swimlanes by priority

### 3. Create Issue Types
- Story (for features)
- Task (for technical work)
- Bug (for defects)
- Epic (for phases)

### 4. Set Up Workflows
- Define transitions between statuses
- Add validators and conditions
- Configure automation rules

---

## Best Practices

### 1. Keep Tickets Small
- Max 8 hours of work per ticket
- Break down larger tickets into subtasks
- Easier to estimate and track

### 2. Update Regularly
- Move tickets as work progresses
- Add comments for updates
- Keep board current

### 3. Limit WIP
- Max 2 tickets per developer
- Finish before starting new work
- Reduces context switching

### 4. Review Blocked Tickets Daily
- Identify blockers early
- Escalate quickly
- Remove blockers ASAP

### 5. Celebrate Wins
- Acknowledge completed work
- Share demos in sprint review
- Recognize team contributions

---

## Next Steps

1. **Choose your tool**: GitHub Projects, Jira, or Linear
2. **Create the board**: Set up columns and labels
3. **Import tickets**: Create issues from tickets.md
4. **Assign work**: Distribute tickets to team members
5. **Start Sprint 1**: Begin development!

---

## Support

For questions about the project board:
- **Setup help**: See tool documentation
- **Process questions**: Ask in team standup
- **Board issues**: Contact project manager
