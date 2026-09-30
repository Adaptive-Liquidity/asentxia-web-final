// Asentxia Systems homepage copy.
// Gate 1 (Claim & Source Audit) passed 2026-09-30 with two required revisions,
// applied here: marquee supporting line ("...nothing decorative." only) and the
// video-section H2 ("Evidence by design. Control by default."). Canon wording
// "surrounding it" restored in the hero sub. Do not harden designed-to framing
// (8e, proof record, scoped permissions, pause/resume/revoke, approve-before-act)
// into present-tense live claims — see audit record and Locked Facts §5b / 3c.
export const home = {
  eyebrow: 'Asentxia Systems · Distributed Cognitive Architecture',
  title: 'Machine-native infrastructure for autonomous intelligence.',
  sub: 'Intelligence is becoming persistent in ambition while the systems surrounding it remain fragmented and temporary. Asentxia builds the architecture, the runtime, and the computers designed for the intelligence itself — beginning with Staxions, private cloud computers for AI assistants.',
  emailPlaceholder: 'Work email',
  emailNote: 'Opening your email client — write to contact@asentxia.com and we’ll take it from there.',
  providerCta: 'Become a Provider',
  userCta: 'Become a User',
  ringLabels: ['Environment', 'State', 'Authority', 'Execution', 'Evidence', 'Coordination', 'Cognition Boundary'],
  sceneFoot: ['ASENTXIA SYSTEMS', 'SCROLL TO ENTER THE SYSTEM ↓', 'DCA · CONTINUUM · STAXIONS'],
  lock: 'All of Asentxia, on command.',
  walkMeta: 'YOUR ASSISTANT / ITS OWN COMPUTER',
  demoNote: 'Demonstration · Conceptual interface',
  walkthrough: [
    {title: 'Hand off the task.', body: 'Your assistant works from its own Staxion — a private cloud computer that belongs to it, not a shared session.', kind: 'handoff'},
    {title: 'Review the action before it runs.', body: 'Consequential actions are prepared, scoped, and held for approval at the boundary — designed so intent never becomes effect without authority.', kind: 'approve'},
    {title: 'The result returns to one thread.', body: 'No tabs, no dashboards, no rebuilt context. The work completes on its computer; the outcome returns to the conversation.', kind: 'result'},
  ],
  accordionMeta: 'STAXIONS / PRIVATE CLOUD COMPUTERS',
  accordionTitle: 'Say what you need and the work gets done.',
  accordionIntro: 'Private cloud computers for AI assistants, designed around governed action.',
  accordion: [
    {title: 'Its own private cloud computer', body: 'Each assistant gets its own isolated, VM-backed computer.',
      prompt: 'Set up my assistant’s computer.', rows: [['Computer', 'atlas-02'], ['Assistant', 'Your AI'], ['Isolation', 'VM-backed']]},
    {title: 'Connect from anywhere', body: 'Your assistant reaches its computer over authenticated HTTPS/MCP.',
      prompt: 'Connect to its computer.', rows: [['Channel', 'HTTPS / MCP'], ['Authentication', 'Required'], ['Reach', 'Remote']]},
    {title: 'See what it sees', body: 'A live view of what your assistant’s browser sees.',
      prompt: 'Show me its browser.', rows: [['View', 'Live browser'], ['Source', 'Accessibility tree'], ['Mode', 'Observation']]},
    {title: 'Checkpoint and restore', body: 'Checkpoint the workspace; restore fails closed if anything is off.',
      prompt: 'Checkpoint the workspace.', rows: [['Checkpoint', 'Saved'], ['Restore rule', 'Fail-closed'], ['Scope', 'Workspace']]},
    {title: 'Memory that stays', body: 'Memory that stays with the assistant, designed to persist beyond any single session.',
      prompt: 'Keep this project in memory.', rows: [['Memory', 'Stays with the assistant'], ['Boundary', 'Beyond a single session']]},
  ],
  galaxyEyebrow: 'ONE PRINCIPAL / A WIDER FIELD',
  galaxy: 'The whole environment answers to your assistant.',
  galaxyNote: 'The actions Staxions is designed around — nothing decorative.',
  capabilities: ['Isolated VM-backed computer', 'Authenticated remote access', 'Live browser observation', 'Workspace checkpoint', 'Fail-closed restore', 'Scoped signed permissions', 'Signed proof record', 'Pause and resume authority', 'Revoke a grant', 'Approval before action'],
  trustMeta: 'EVIDENCE / CONTROL',
  trustTitle: 'Evidence by design. Control by default.',
  trustBody: 'Two properties the architecture is designed to guarantee: every action leaves an inspectable record, and consequential action waits for authority.',
  tiles: [
    {title: 'Every action traces back to its source.', sub: 'From proposed action to ordered record — inspectable by someone other than the system itself.', poster: '/videos/evidence.svg', video: '/videos/evidence.mp4', kind: 'evidence'},
    {title: 'Nothing happens without your approval.', sub: 'Consequential actions are held at the Effect Boundary until approved.', poster: '/videos/approve.svg', video: '/videos/approve.mp4', kind: 'approve'},
  ],
  furtherMeta: 'GO FURTHER WITH ASENTXIA',
  further: [
    {title: 'DCA', meta: '01 / THE ARCHITECTURE', body: 'The reference architecture: seven responsibilities around a persistent principal — Environment, State, Authority, Execution, Evidence, Coordination, Cognition Boundary.', href: '/architecture/'},
    {title: 'Continuum', meta: '02 / THE RUNTIME', body: 'The flagship implementation: a persistent machine-native runtime, built and evidenced in stages.', href: '/continuum/'},
    {title: 'Staxions', meta: '03 / THE OFFER', body: 'The launch offer: private cloud computers for AI assistants.', href: '#closing'},
  ],
  closingTitle: 'The principal persists. The components may change.',
  closingLine: 'Bring your assistant. We built the environment.',
  ringsNote: 'Three rings, one system — a quiet model of Environment, Authority, and Evidence.',
  footerTag: 'Architecture for persistent, governed autonomous intelligence.',
  legal: '© Asentxia Systems. Capability availability and maturity vary by release. Research descriptions are not representations of production availability.',
  contact: 'contact@asentxia.com',
};
