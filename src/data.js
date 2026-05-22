export const DOMAINS = [
  { id:'memory',       name:'Episodic Memory',      shortName:'Memory',    desc:'Recall sequences & pattern recognition',     detail:'Tests your ability to encode, store and retrieve sequential information — a key early marker for cognitive decline.', icon:'🧩', color:'#1D9E75', bg:'#E1F5EE', game:'sequence',  neuropsych:'Corsi Block Test',          duration:'2 min' },
  { id:'attention',    name:'Sustained Attention',  shortName:'Attention', desc:'Focus & response inhibition (Stroop task)',   detail:'Measures your ability to maintain focus and suppress automatic responses — related to frontal lobe function.',        icon:'🎯', color:'#185FA5', bg:'#E6F1FB', game:'stroop',    neuropsych:'Stroop Colour-Word',        duration:'2 min' },
  { id:'working',      name:'Working Memory',       shortName:'Working',   desc:'Hold & manipulate digit sequences',            detail:'Assesses your capacity to hold information in mind and work with it — strongly linked to overall cognitive health.',   icon:'🔢', color:'#534AB7', bg:'#EEEDFE', game:'digit',     neuropsych:'Digit Span (WAIS-IV)',      duration:'2 min' },
  { id:'processing',   name:'Processing Speed',     shortName:'Speed',     desc:'Visual reaction time & accuracy',              detail:'Quantifies how quickly you detect and respond to stimuli. Slowing speed is one of the earliest signs of cognitive ageing.', icon:'⚡', color:'#BA7517', bg:'#FAEEDA', game:'reaction',  neuropsych:'Simple Reaction Time',      duration:'1 min' },
  { id:'executive',    name:'Executive Function',   shortName:'Executive', desc:'Rule-switching & cognitive flexibility',       detail:'Evaluates your ability to switch between mental rules — reflecting prefrontal cortex integrity.',                       icon:'🔀', color:'#993C1D', bg:'#FAECE7', game:'switching', neuropsych:'Trail Making Test B',       duration:'2 min' },
  { id:'visuospatial', name:'Visuospatial',         shortName:'Spatial',   desc:'Pattern matching & spatial reasoning',         detail:'Tests perception of spatial relationships and visual pattern recognition — parietal and occipital functions.',          icon:'🔷', color:'#0F6E56', bg:'#dcf0e8', game:'pattern',   neuropsych:'Visual Pattern Test',       duration:'2 min' },
  { id:'language',     name:'Language & Fluency',   shortName:'Language',  desc:'Semantic categorisation & word fluency',       detail:"Measures semantic memory and language processing speed — areas vulnerable in early Alzheimer's disease.",              icon:'💬', color:'#3B6D11', bg:'#EAF3DE', game:'category',  neuropsych:'Semantic Fluency (VF)',     duration:'2 min' },
];

export const scoreTag = (score) => {
  if (score == null) return { label: 'Not done', cls: 'tag-na' };
  if (score >= 75)   return { label: 'Good',     cls: 'tag-good' };
  if (score >= 50)   return { label: 'Average',  cls: 'tag-avg' };
  return                    { label: 'Low',      cls: 'tag-low' };
};

export const scoreColor = (score) => {
  if (score == null) return 'var(--text3)';
  if (score >= 75)   return 'var(--brand)';
  if (score >= 50)   return 'var(--amber)';
  return 'var(--red)';
};
