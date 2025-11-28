import type { Card } from '../types';

const medicalDecks = ['Cardiology', 'Neurology', 'Pharmacology', 'Anatomy', 'Pathology'];

const medicalTags = [
  'High-Yield', 'Step 1', 'Step 2', 'Step 3', 'Clinical', 'Basic Science',
  'Mechanism', 'Side Effects', 'Diagnosis', 'Treatment', 'Pathophysiology',
  'Pharmacokinetics', 'Toxicity', 'First Aid', 'Boards', 'Shelf Exam'
];

const sampleQuestions = [
  { front: 'What are the ECG findings in acute MI?', back: 'ST elevation, pathologic Q waves, T wave inversion' },
  { front: 'MOA of ACE inhibitors', back: 'Inhibit angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II' },
  { front: 'Classic triad of Parkinson\'s disease', back: 'Resting tremor, rigidity, bradykinesia' },
  { front: 'Most common cause of lobar pneumonia', back: 'Streptococcus pneumoniae' },
  { front: 'What is Beck\'s triad?', back: 'Hypotension, JVD, muffled heart sounds - seen in cardiac tamponade' },
  { front: 'Side effects of beta blockers', back: 'Bradycardia, bronchospasm, fatigue, erectile dysfunction, masks hypoglycemia' },
  { front: 'First-line treatment for hypertension in diabetic patients', back: 'ACE inhibitors or ARBs' },
  { front: 'Mechanism of warfarin', back: 'Inhibits vitamin K epoxide reductase, reducing synthesis of vitamin K-dependent clotting factors (II, VII, IX, X)' },
  { front: 'Classic presentation of appendicitis', back: 'Periumbilical pain migrating to RLQ, anorexia, nausea, fever, rebound tenderness at McBurney\'s point' },
  { front: 'Horner syndrome triad', back: 'Ptosis, miosis, anhidrosis' },
  { front: 'First-line antibiotic for community-acquired pneumonia', back: 'Azithromycin or doxycycline (outpatient); ceftriaxone + azithromycin (inpatient)' },
  { front: 'Virchow\'s triad for thrombosis', back: 'Stasis, hypercoagulability, endothelial injury' },
  { front: 'Treatment for status epilepticus', back: 'Benzodiazepines (lorazepam or diazepam), then phenytoin or fosphenytoin' },
  { front: 'Signs of digoxin toxicity', back: 'Nausea, vomiting, yellow-green vision, arrhythmias, confusion' },
  { front: 'Characteristics of nephrotic syndrome', back: 'Proteinuria >3.5g/day, hypoalbuminemia, edema, hyperlipidemia, lipiduria' },
];

export function generateMockCards(count: number): Card[] {
  const cards: Card[] = [];
  const now = Date.now();
  
  for (let i = 1; i <= count; i++) {
    const sample = sampleQuestions[i % sampleQuestions.length];
    const deck = medicalDecks[i % medicalDecks.length];
    const numTags = Math.floor(Math.random() * 4) + 1;
    const tags = Array.from({ length: numTags }, () => 
      medicalTags[Math.floor(Math.random() * medicalTags.length)]
    ).filter((tag, index, arr) => arr.indexOf(tag) === index);
    
    // Create realistic distribution of card stats
    const daysAgo = Math.floor(Math.random() * 180); // Cards created in last 6 months
    const modifiedDaysAgo = Math.floor(Math.random() * daysAgo);
    const reviews = Math.floor(Math.random() * 50);
    const ease = 1.3 + Math.random() * 2.2; // 1.3 to 3.5
    const lapses = Math.floor(Math.random() * (reviews / 3));
    const interval = reviews > 0 ? Math.floor(Math.random() * 365) : 0;
    const suspended = Math.random() < 0.05; // 5% suspended
    
    cards.push({
      id: i,
      deck,
      front: `${sample.front} ${i > sampleQuestions.length ? `(Card ${i})` : ''}`,
      back: sample.back,
      tags,
      created: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      modified: new Date(now - modifiedDaysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reviews,
      ease: Number(ease.toFixed(2)),
      lapses,
      interval,
      suspended,
    });
  }
  
  return cards;
}
