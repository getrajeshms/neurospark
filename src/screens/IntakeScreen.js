import { useState } from 'react';

const EDUCATION = ['No formal education', 'Primary school', 'Secondary school', 'Diploma / Vocational', 'Bachelor\'s degree', 'Postgraduate degree'];
const GENDER    = ['Male', 'Female', 'Non-binary / Other', 'Prefer not to say'];

export default function IntakeScreen({ navigate, onIntake }) {
  const [form, setForm] = useState({ name:'', age:'', gender:'', education:'', assessor:'' });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())           e.name      = 'Name is required';
    if (!form.age || form.age < 18 || form.age > 100) e.age = 'Enter a valid age (18–100)';
    if (!form.gender)                e.gender    = 'Please select';
    if (!form.education)             e.education = 'Please select';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStart = () => {
    if (!validate()) return;
    onIntake({ ...form, age: parseInt(form.age), date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) });
    navigate('domains');
  };

  const inputStyle = (err) => ({
    width:'100%', padding:'12px 14px', borderRadius:12,
    border:`1.5px solid ${err ? 'var(--red)' : 'var(--border)'}`,
    fontSize:14, fontFamily:'inherit', color:'var(--text)',
    background:'var(--card)', outline:'none',
    transition:'border .2s',
  });
  const labelStyle = { fontSize:12, fontWeight:500, color:'var(--text2)', marginBottom:6, display:'block' };
  const errStyle   = { fontSize:11, color:'var(--red)', marginTop:4 };

  return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={() => navigate('home')}>← Home</button>
        <span style={{fontSize:15, fontWeight:500}}>Participant Info</span>
        <div style={{width:70}}/>
      </nav>

      <div style={{padding:'20px 20px 8px'}}>
        <div style={{fontSize:15, fontWeight:500, color:'var(--navy)', marginBottom:4}}>Before we begin</div>
        <p style={{fontSize:13, color:'var(--text2)', lineHeight:1.6}}>
          This information is used to personalise your report and calculate your Brain Age. All data stays on your device.
        </p>
      </div>

      <div style={{padding:'12px 20px 24px', display:'flex', flexDirection:'column', gap:16}}>

        {/* Name */}
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle(errors.name)} placeholder="e.g. Rajesh Kumar" value={form.name} onChange={e=>set('name',e.target.value)}/>
          {errors.name && <div style={errStyle}>{errors.name}</div>}
        </div>

        {/* Age */}
        <div>
          <label style={labelStyle}>Age *</label>
          <input style={inputStyle(errors.age)} type="number" min={18} max={100} placeholder="e.g. 45" value={form.age} onChange={e=>set('age',e.target.value)}/>
          {errors.age && <div style={errStyle}>{errors.age}</div>}
        </div>

        {/* Gender */}
        <div>
          <label style={labelStyle}>Gender *</label>
          <select style={{...inputStyle(errors.gender), appearance:'none'}} value={form.gender} onChange={e=>set('gender',e.target.value)}>
            <option value="">Select gender</option>
            {GENDER.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
          {errors.gender && <div style={errStyle}>{errors.gender}</div>}
        </div>

        {/* Education */}
        <div>
          <label style={labelStyle}>Highest Education *</label>
          <select style={{...inputStyle(errors.education), appearance:'none'}} value={form.education} onChange={e=>set('education',e.target.value)}>
            <option value="">Select education level</option>
            {EDUCATION.map(e=><option key={e} value={e}>{e}</option>)}
          </select>
          {errors.education && <div style={errStyle}>{errors.education}</div>}
        </div>

        {/* Assessor (optional) */}
        <div>
          <label style={labelStyle}>Assessor Name <span style={{color:'var(--text3)'}}>(optional)</span></label>
          <input style={inputStyle(false)} placeholder="e.g. Dr. Murali Krishna" value={form.assessor} onChange={e=>set('assessor',e.target.value)}/>
        </div>

        {/* Info box */}
        <div className="card" style={{background:'var(--brand-light)', border:'1px solid var(--brand-mid)', padding:'14px'}}>
          <div style={{fontSize:12, fontWeight:500, color:'var(--brand)', marginBottom:6}}>What happens next?</div>
          <div style={{fontSize:12, color:'var(--text2)', lineHeight:1.6}}>
            You'll complete 7 short cognitive games (≈15 min total). After finishing, you'll receive a detailed report including your <strong>Brain Age</strong> compared to your actual age.
          </div>
        </div>

        <button className="btn-primary" onClick={handleStart} style={{marginTop:4}}>
          Begin Assessment →
        </button>
      </div>

      <p className="disclaimer">
        ⚠ NeuroSpark is not a clinical diagnostic tool. For research use only.
      </p>
    </div>
  );
}
