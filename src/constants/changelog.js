export const CHANGELOG = [
  {
    version: '0.4',
    date: 'Mar 2026',
    changes: [
      'Calculator accuracy: fixed depreciation to use ATO Div 43 method (original construction cost gross-up)',
      'Calculator accuracy: fixed CGT — selling costs now correctly reduce taxable capital gain',
      'Added Depreciation Rate input (default 2.5%) in Advanced settings',
      'UI refresh: Phosphor Icons (duotone), DM Serif Display headings, DM Sans body, card depth shadows',
      'Changelog versioning changed to v0.x (pre-launch)',
    ],
  },
  {
    version: '0.3',
    date: 'Mar 2026',
    changes: [
      'UI overhaul: left sidebar nav replacing top header, clean Mouon/Moneda-inspired design',
      'Quiz: shorter questions, new "So What?" action bullets per archetype, comparison chart (4 dimensions)',
      'Calculator: number input fix (backspace no longer snaps back), neg gearing toggle restored',
      'Calculator: growth assumptions in main view, exit selector on all 3 tabs',
      'Calculator: 6-chart overhaul — CF before/after neg gearing, equity vs cash invested, IRR sensitivity',
      'New module: Borrowing Power calculator with 4 inputs + bank calculator links',
      'New module: Stamp Duty calculator for QLD · NSW · VIC · WA with FHB concessions',
    ],
  },
  {
    version: '0.2',
    date: 'Mar 2026',
    changes: [
      'Added Module 1: Investor type quiz — 12 questions, 5 archetypes',
      'Added home screen with 3-module navigation',
      'Simplified Module 2 inputs to 7 core fields',
      'Added 3-scenario exit analysis side-by-side (Y5 / Y10 / Y15)',
      'Fixed chart bugs: Y0 outlay bar, cumulative CF includes sale proceeds at exit, all charts crop at exit year',
      'Fixed cash flow table: sticky first column + header row',
      'Added weekly and monthly cash flow rows to CF table',
      'Added version badge with changelog',
    ],
  },
  {
    version: '0.1',
    date: 'Mar 2026',
    changes: [
      'Initial launch: 20-year property cash flow calculator',
      'Two LVR scenarios (80% / 88%), 3 interest rate scenarios (stressed / base / best)',
      '4 charts: wealth build-up, annual CF, weekly cash position, cumulative CF',
      'IRR, equity multiple, net proceeds after CGT',
      'Itemised purchase, ongoing and selling costs',
    ],
  },
]
