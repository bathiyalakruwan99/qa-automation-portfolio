# Orders to Domestic - QA Documentation Repository

Welcome to the QA documentation repository for the Orders to Domestic workflow project. This repository contains comprehensive test documentation, requirements traceability matrices, and test case exports for systematic quality assurance.

---

## 📁 Repository Structure

```
orders to domastic/
│
├── README.md                                      # This file
│
├── PB-3176_Manual_Load_Planning_MindMap.md       # Mind map visualization
├── PB-3176_Testing_Summary.md                     # Comprehensive test summary
│
├── rtms/                                          # Requirements Traceability Matrix
│   ├── README.md                                  # RTM guidelines
│   ├── RTM_Template.csv                           # Template for new RTMs
│   └── RTM_Manual_Load_Planning_PB-3176.csv      # 85 test cases for PB-3176
│
└── testiny_test_cases/                            # Testiny CSV exports
    ├── README.md                                  # Testiny import/export guide
    ├── Testiny_Template.csv                       # Template for new exports
    └── Testiny_Export_Manual_Load_Planning_PB-3176_20251001.csv  # 27 detailed test cases
```

---

## 🎯 Current Features in Testing

### PB-3176: Manual Load Planning - Domestic Workflow
**Status:** Development In Progress  
**Developer:** Sanjaya Gihan  
**Planned End Date:** October 16, 2025

**Quick Links:**
- [Jira Ticket](https://example-platform.atlassian.net/browse/PB-3176)
- [Figma Design](https://www.figma.com/proto/V3UtmFSpcSHqzVCVcDyp3D/Import-orders?node-id=1-6)
- [Mind Map](PB-3176_Manual_Load_Planning_MindMap.md)
- [Testing Summary](PB-3176_Testing_Summary.md)
- [RTM](rtms/RTM_Manual_Load_Planning_PB-3176.csv)
- [Testiny Export](testiny_test_cases/Testiny_Export_Manual_Load_Planning_PB-3176_20251001.csv)

**Test Coverage:**
- 85 test cases in RTM
- 27 detailed test cases in Testiny format
- 100% requirement coverage
- Est. 40 hours test execution time

---

## 🚀 Quick Start Guide

### For QA Engineers

1. **Review Requirements**
   ```
   Open: PB-3176_Manual_Load_Planning_MindMap.md
   ```
   - Understand feature scope
   - Review business logic and edge cases
   - Note Figma design references

2. **Import Test Cases**
   ```
   File: testiny_test_cases/Testiny_Export_Manual_Load_Planning_PB-3176_20251001.csv
   Action: Import to Testiny TMS
   ```
   - 27 ready-to-execute test cases
   - Detailed steps, preconditions, expected results
   - Priority and tags included

3. **Track Coverage**
   ```
   File: rtms/RTM_Manual_Load_Planning_PB-3176.csv
   ```
   - Update Status column as tests progress
   - Update Coverage column (Covered/Not Covered)
   - Add Notes for defects or observations

4. **Review Test Strategy**
   ```
   File: PB-3176_Testing_Summary.md
   Section: Testing Strategy
   ```
   - Follow 6-phase testing approach
   - Prioritize critical path tests
   - Track execution progress

### For Business Analysts

1. **Visualize Requirements**
   - Open mind map for visual breakdown
   - Review feature hierarchies
   - Validate completeness

2. **Verify Coverage**
   - Check RTM for requirement-to-test mapping
   - Ensure all acceptance criteria have test cases
   - Review edge cases and validations

3. **Update Documentation**
   - Add new features as they're defined
   - Update mind maps for new epics
   - Maintain RTM templates

---

## 📊 Documentation Standards

### Mind Maps (Mermaid Format)
- **File naming:** `[JIRA-ID]_[Feature-Name]_MindMap.md`
- **Root node:** Feature/Epic name with Jira ID
- **Children:** Sub-features, requirements, validations
- **Include:** Error handling, edge cases, Figma refs

### RTM Files (CSV Format)
- **File naming:** `RTM_[Feature-Name]_[JIRA-ID].csv`
- **Columns:** Requirement ID, Description, Test Case ID, Test Description, Type, Priority, Status, Coverage, Notes
- **Status values:** Not Started, In Progress, Completed
- **Coverage values:** Not Covered, Partially Covered, Covered

### Testiny Exports (CSV Format)
- **File naming:** `Testiny_Export_[Feature-Name]_[JIRA-ID]_[YYYYMMDD].csv`
- **Include:** Detailed test steps, preconditions, expected results
- **Priority:** Critical, High, Medium, Low
- **Type:** Manual, Automated
- **Tags:** Feature name, Jira ID, functional area

---

## 🔧 Tools & Integration

### Jira Integration
- All test cases link to Jira tickets via Requirement ID
- Use Jira comments URLs for detailed discussions
- Update Jira tickets with test execution results

### Testiny Integration
- Import CSV files via Testiny import feature
- Map columns during import (ID → TC-ID, Title → Name, etc.)
- Export updated results back to CSV for version control

### Figma Integration
- Reference Figma prototypes in test cases
- Validate UI implementation against designs
- Include Figma node-ids for specific screens

---

## 📈 Test Metrics & Reporting

### Key Metrics to Track
- **Test Coverage:** % of requirements with test cases
- **Execution Progress:** % of test cases executed
- **Pass Rate:** % of executed tests passed
- **Defect Density:** Defects per requirement
- **Test Efficiency:** Time to execute vs. planned

### Weekly Reports
Update `PB-3176_Testing_Summary.md` with:
- Execution progress (Not Started → In Progress → Passed/Failed)
- Defect summary (count by severity)
- Blockers and risks
- Next week's plan

---

## 🎨 Best Practices

### Creating Test Cases
1. **One test case = One objective**
2. **Include clear preconditions**
3. **Write step-by-step actions**
4. **Define measurable expected results**
5. **Tag appropriately for filtering**
6. **Link to requirements (Jira ID)**

### Maintaining RTMs
1. **Update after each sprint**
2. **Keep coverage status current**
3. **Link defects in Notes column**
4. **Review coverage gaps weekly**
5. **Archive obsolete test cases**

### Documentation Updates
1. **Version control all CSV files**
2. **Update README for new features**
3. **Create mind maps for all epics**
4. **Generate test summaries per feature**
5. **Review and refine templates quarterly**

---

## 🔄 Workflow

```mermaid
graph LR
    A[New Jira Ticket] --> B[Create Mind Map]
    B --> C[Generate RTM]
    C --> D[Create Testiny Test Cases]
    D --> E[Import to Testiny]
    E --> F[Execute Tests]
    F --> G[Log Defects in Jira]
    G --> H[Update RTM Status]
    H --> I[Generate Test Report]
    I --> J[Sprint Review]
    J --> K[Archive & Document]
```

---

## 📞 Support & Contacts

### QA Team
- **QA Lead:** [To be assigned]
- **QA Engineers:** [To be assigned]
- **Test Automation:** [To be assigned]

### Development Team
- **PB-3176 Developer:** Sanjaya Gihan

### Product Team
- **Product Owner:** Isuru Wickramage
- **Business Analyst:** [To be assigned]

### AI/Automation Assistant
- **BA/QA Documentation:** AI Assistant
- **Capabilities:** Mind map generation, test case design, RTM creation, documentation updates

---

## 🆕 Recent Updates

### October 1, 2025
- ✅ Created PB-3176 documentation suite
- ✅ Generated 85 test cases in RTM
- ✅ Created 27 detailed Testiny test cases
- ✅ Mind map with complete feature breakdown
- ✅ Comprehensive testing summary document
- ✅ Folder structure and templates established

### Next Steps
- [ ] Import test cases to Testiny
- [ ] Assign test cases to QA engineers
- [ ] Set up test environment and test data
- [ ] Begin Phase 1: Smoke testing
- [ ] Schedule kickoff meeting with QA team

---

## 📚 Additional Resources

- **Jira Board:** [Project Board URL]
- **Confluence:** [Documentation Space URL]
- **Testiny:** [TMS Instance URL]
- **Figma:** [Design System URL]
- **Development Environment:** [Dev URL]
- **Test Environment:** [Test URL]

---

## 📄 License & Confidentiality

This repository contains confidential business information. Access is restricted to authorized team members only.

**Last Updated:** October 1, 2025  
**Repository Maintainer:** QA Team  
**Version:** 1.0

