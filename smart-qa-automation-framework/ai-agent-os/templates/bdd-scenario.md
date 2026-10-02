# Template: BDD scenario

> Blank template. One feature per acceptance-criteria group; every scenario traces to a stated criterion.

```gherkin
Feature: {{feature name}}
  As a {{role}}
  I want {{capability}}
  So that {{benefit}}

  # Traces to: {{REQ-ID}} AC-{{n}}
  Background:
    Given {{state every scenario shares}}

  # Traces to: AC-{{n}} (positive)
  Scenario: {{observable outcome when it works}}
    Given {{starting state}}
    When {{one user action}}
    Then {{observable result: a status, a message, a value}}

  # Traces to: AC-{{n}} (negative)
  Scenario: {{observable outcome when it is rejected}}
    Given {{starting state}}
    When {{invalid action or input}}
    Then {{the specific rejection}}
    And {{proof that nothing changed (checked through the API, not only the screen)}}

  # Traces to: AC-{{n}} (boundary)
  Scenario Outline: {{limit behaviour}}
    When {{action}} with <value>
    Then the result is <result>

    Examples:
      | value                 | result   |
      | {{exactly at limit}}  | accepted |
      | {{just over limit}}   | rejected |
```

Checklist:
- [ ] Each `Then` is observable, not "works correctly"
- [ ] Negative scenarios prove that nothing changed
- [ ] Limits have exact boundary rows

A running test that applies the same pattern: `tests/negative/ui-validation.spec.ts` (NEG-003 asserts the rejection
*and* that nothing was created).
