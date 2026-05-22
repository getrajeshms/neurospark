/**
 * Brain Age Calculation
 *
 * Based on published norms from cognitive ageing research:
 * - Processing speed declines ~0.4% per year after 25
 * - Memory declines ~0.3% per year after 30
 * - Executive function declines ~0.35% per year after 30
 * - Working memory declines ~0.3% per year after 25
 * - Language relatively preserved until 60+
 *
 * Domain weights reflect their sensitivity to ageing:
 */

const DOMAIN_WEIGHTS = {
  processing:   0.22,   // Highest sensitivity to ageing
  memory:       0.20,
  working:      0.18,
  executive:    0.17,
  attention:    0.12,
  visuospatial: 0.07,
  language:     0.04,
};

/**
 * Expected score (%) for a healthy person at a given age
 * Based on normative decline curves
 */
function expectedScore(domainId, age) {
  const peaks = {
    processing:   { peak: 24, peakScore: 92, declinePerYear: 0.55 },
    memory:       { peak: 28, peakScore: 90, declinePerYear: 0.45 },
    working:      { peak: 25, peakScore: 91, declinePerYear: 0.45 },
    executive:    { peak: 30, peakScore: 90, declinePerYear: 0.40 },
    attention:    { peak: 28, peakScore: 89, declinePerYear: 0.35 },
    visuospatial: { peak: 26, peakScore: 88, declinePerYear: 0.38 },
    language:     { peak: 40, peakScore: 87, declinePerYear: 0.20 },
  };
  const d = peaks[domainId] || peaks.memory;
  const yearsAfterPeak = Math.max(0, age - d.peak);
  return Math.max(30, d.peakScore - yearsAfterPeak * d.declinePerYear);
}

/**
 * Convert raw score to cognitive age equivalent
 * Returns the age at which expectedScore(domain, age) === rawScore
 */
function scoreToAge(domainId, rawScore) {
  const peaks = {
    processing:   { peak: 24, peakScore: 92, declinePerYear: 0.55 },
    memory:       { peak: 28, peakScore: 90, declinePerYear: 0.45 },
    working:      { peak: 25, peakScore: 91, declinePerYear: 0.45 },
    executive:    { peak: 30, peakScore: 90, declinePerYear: 0.40 },
    attention:    { peak: 28, peakScore: 89, declinePerYear: 0.35 },
    visuospatial: { peak: 26, peakScore: 88, declinePerYear: 0.38 },
    language:     { peak: 40, peakScore: 87, declinePerYear: 0.20 },
  };
  const d = peaks[domainId] || peaks.memory;
  if (rawScore >= d.peakScore) return d.peak;
  const age = d.peak + (d.peakScore - rawScore) / d.declinePerYear;
  return Math.min(95, Math.max(18, Math.round(age)));
}

/**
 * Main brain age calculator
 * @param {Object} scores  - { domainId: { score: number } }
 * @param {number} actualAge
 * @returns {Object} full brain age report
 */
export function calculateBrainAge(scores, actualAge) {
  const domainIds = Object.keys(scores);
  if (domainIds.length === 0) return null;

  // Weighted composite score
  let totalWeight = 0;
  let weightedScore = 0;
  let domainAges = {};
  let domainExpected = {};

  domainIds.forEach(id => {
    const w = DOMAIN_WEIGHTS[id] || 0.1;
    const raw = scores[id].score;
    const exp = expectedScore(id, actualAge);
    totalWeight   += w;
    weightedScore += w * raw;
    domainAges[id]    = scoreToAge(id, raw);
    domainExpected[id] = Math.round(exp);
  });

  const compositeScore = Math.round(weightedScore / totalWeight);

  // Brain age = weighted average of domain ages
  let totalW2 = 0, weightedAge = 0;
  domainIds.forEach(id => {
    const w = DOMAIN_WEIGHTS[id] || 0.1;
    totalW2    += w;
    weightedAge += w * domainAges[id];
  });
  const brainAge = Math.round(weightedAge / totalW2);

  // Age gap
  const ageDiff = actualAge - brainAge; // positive = younger brain

  // Cognitive reserve index (0–100)
  const expectedComposite = domainIds.reduce((sum, id) => {
    const w = DOMAIN_WEIGHTS[id] || 0.1;
    return sum + w * expectedScore(id, actualAge);
  }, 0) / totalWeight;
  const reserveIndex = Math.round(Math.min(100, Math.max(0, (compositeScore / expectedComposite) * 100)));

  // Percentile estimate
  const percentile = scoreToPercentile(ageDiff);

  // Interpretation
  const interpretation = getInterpretation(ageDiff, compositeScore);

  // Per-domain analysis
  const domainAnalysis = domainIds.map(id => {
    const raw = scores[id].score;
    const exp = domainExpected[id];
    const diff = raw - exp;
    return {
      id,
      rawScore: raw,
      expectedScore: exp,
      diff,
      domainAge: domainAges[id],
      status: diff >= 10 ? 'above' : diff >= -5 ? 'normal' : diff >= -15 ? 'below' : 'low',
    };
  }).sort((a,b) => b.rawScore - a.rawScore);

  return {
    brainAge,
    actualAge,
    ageDiff,
    compositeScore,
    reserveIndex,
    percentile,
    interpretation,
    domainAnalysis,
    completedDomains: domainIds.length,
  };
}

function scoreToPercentile(ageDiff) {
  // ageDiff = actualAge - brainAge; higher = better
  if (ageDiff >= 15) return 95;
  if (ageDiff >= 10) return 85;
  if (ageDiff >= 5)  return 72;
  if (ageDiff >= 0)  return 58;
  if (ageDiff >= -5) return 42;
  if (ageDiff >= -10)return 28;
  if (ageDiff >= -15)return 15;
  return 8;
}

function getInterpretation(ageDiff, compositeScore) {
  if (ageDiff >= 10) return {
    headline: 'Exceptional Cognitive Health',
    summary: 'Your cognitive performance is significantly above average for your age group. Your brain is functioning like someone considerably younger.',
    color: '#0F6E56',
    emoji: '🌟',
  };
  if (ageDiff >= 5) return {
    headline: 'Above Average',
    summary: 'Your brain is performing better than most people your age. You show strong cognitive reserve across multiple domains.',
    color: '#1D9E75',
    emoji: '✅',
  };
  if (ageDiff >= -5) return {
    headline: 'Age-Appropriate',
    summary: 'Your cognitive performance is consistent with healthy ageing for your age group. Most domains are within expected ranges.',
    color: '#185FA5',
    emoji: '👍',
  };
  if (ageDiff >= -10) return {
    headline: 'Mild Decline Noted',
    summary: 'Some cognitive domains are performing slightly below expectations for your age. This may reflect lifestyle factors and is worth monitoring.',
    color: '#BA7517',
    emoji: '⚠️',
  };
  return {
    headline: 'Significant Decline — Follow Up Recommended',
    summary: 'Several cognitive domains show performance below age expectations. We recommend discussing these results with a healthcare professional.',
    color: '#A32D2D',
    emoji: '🔴',
  };
}

export function getDomainInterpretation(domainId, score, expectedSc, actualAge) {
  const interpretations = {
    memory: {
      above: `Excellent episodic memory — significantly above the expected ${expectedSc}% for age ${actualAge}. Strong encoding and retrieval mechanisms suggest well-preserved hippocampal function.`,
      normal: `Episodic memory is within normal range for your age (expected ~${expectedSc}%). Recall and sequence retention are functioning as anticipated.`,
      below: `Episodic memory is slightly below age expectations (${expectedSc}%). Mild difficulty with sequence recall may reflect early attentional or encoding changes.`,
      low: `Episodic memory shows notable difficulty compared to age norms (${expectedSc}%). This domain is particularly sensitive to early cognitive decline and warrants follow-up.`,
    },
    attention: {
      above: `Sustained attention and inhibitory control are excellent — well above the ${expectedSc}% norm for your age. Strong frontal lobe regulation.`,
      normal: `Attention performance is age-appropriate (expected ~${expectedSc}%). You maintain focus and suppress distracting information effectively.`,
      below: `Attention is slightly below age norms (${expectedSc}%). Mild difficulty with response inhibition may reflect reduced frontal efficiency.`,
      low: `Attention and inhibitory control show significant difficulty relative to norms (${expectedSc}%). Stroop performance suggests frontal-executive involvement.`,
    },
    working: {
      above: `Working memory capacity is above average for your age (norm ~${expectedSc}%). You demonstrate strong ability to hold and manipulate information.`,
      normal: `Working memory is functioning within expected limits for age ${actualAge} (expected ~${expectedSc}%). Digit span performance is consistent with healthy ageing.`,
      below: `Working memory is slightly below age expectations (${expectedSc}%). Reduced digit span may reflect modest changes in short-term memory capacity.`,
      low: `Working memory shows significant reduction compared to age norms (${expectedSc}%). This finding, combined with other domains, may warrant clinical follow-up.`,
    },
    processing: {
      above: `Processing speed is excellent — well above the ${expectedSc}% norm for age ${actualAge}. Fast and accurate responses reflect strong neural processing efficiency.`,
      normal: `Processing speed is age-appropriate (expected ~${expectedSc}%). Reaction time and accuracy are consistent with healthy cognitive ageing.`,
      below: `Processing speed is slightly below expectations (${expectedSc}%). Slowing reaction time is common with ageing but worth monitoring.`,
      low: `Processing speed is notably reduced relative to norms (${expectedSc}%). Significant slowing of reaction time is often one of the earliest markers of cognitive change.`,
    },
    executive: {
      above: `Executive function and cognitive flexibility are excellent — above the ${expectedSc}% norm for your age. Strong rule-switching suggests preserved prefrontal cortex function.`,
      normal: `Executive function is within normal range (expected ~${expectedSc}%). Cognitive flexibility and rule-switching are age-appropriate.`,
      below: `Executive function is slightly below age expectations (${expectedSc}%). Mild difficulty with rule-switching may reflect modest prefrontal changes.`,
      low: `Executive function shows notable difficulty compared to norms (${expectedSc}%). Rule-switching challenges may reflect reduced prefrontal cortex efficiency.`,
    },
    visuospatial: {
      above: `Visuospatial ability is above average for your age (norm ~${expectedSc}%). Pattern recognition and spatial reasoning are well-preserved.`,
      normal: `Visuospatial performance is age-appropriate (expected ~${expectedSc}%). Pattern matching and spatial reasoning are consistent with healthy ageing.`,
      below: `Visuospatial ability is slightly below age expectations (${expectedSc}%). Mild pattern recognition difficulty may reflect attentional or perceptual changes.`,
      low: `Visuospatial performance is notably below age norms (${expectedSc}%). Difficulty with pattern recognition may warrant further assessment.`,
    },
    language: {
      above: `Language and semantic fluency are excellent — above the ${expectedSc}% norm for your age. Strong categorical knowledge and word retrieval.`,
      normal: `Language performance is age-appropriate (expected ~${expectedSc}%). Semantic categorisation and word fluency are well-maintained.`,
      below: `Language fluency is slightly below age expectations (${expectedSc}%). Mild difficulty with semantic categorisation can occur with age.`,
      low: `Language and semantic fluency show notable difficulty relative to norms (${expectedSc}%). Word retrieval challenges are associated with early cognitive change.`,
    },
  };
  const domain = interpretations[domainId] || interpretations.memory;
  const status = score >= expectedSc + 10 ? 'above' : score >= expectedSc - 5 ? 'normal' : score >= expectedSc - 15 ? 'below' : 'low';
  return domain[status];
}

export function getRecommendations(domainAnalysis, ageDiff) {
  const recs = [];
  const lowDomains = domainAnalysis.filter(d => d.status === 'low' || d.status === 'below');

  if (lowDomains.some(d => d.id === 'memory' || d.id === 'working')) {
    recs.push({ icon:'🧩', title:'Memory Training', desc:'Daily memory exercises such as learning new skills, reading, or practicing mnemonics can strengthen hippocampal networks.' });
  }
  if (lowDomains.some(d => d.id === 'processing' || d.id === 'attention')) {
    recs.push({ icon:'🏃', title:'Aerobic Exercise', desc:'Regular aerobic activity (30 min, 5 days/week) is the single most evidence-based intervention for improving processing speed and attention.' });
  }
  if (lowDomains.some(d => d.id === 'executive' || d.id === 'switching')) {
    recs.push({ icon:'🎯', title:'Dual-Task Activities', desc:'Activities requiring simultaneous tasks (e.g., dancing, team sports, musical instruments) strengthen executive function and cognitive flexibility.' });
  }
  if (ageDiff < -5) {
    recs.push({ icon:'🩺', title:'Clinical Follow-Up', desc:'Given these results, we recommend discussing your cognitive health with a qualified neurologist or geriatrician for a comprehensive evaluation.' });
  }
  recs.push({ icon:'😴', title:'Sleep Hygiene', desc:'Consistent 7–8 hours of quality sleep is essential for memory consolidation and cognitive maintenance.' });
  recs.push({ icon:'🥗', title:'Mediterranean Diet', desc:'Evidence strongly supports a plant-rich diet with omega-3s for preserving cognitive health and reducing dementia risk.' });

  return recs.slice(0, 4);
}
