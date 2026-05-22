import { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import A1Badge from '../components/A1Badge';
import { DOMAINS, scoreColor } from '../data';
import { calculateBrainAge, getDomainInterpretation, getRecommendations } from '../brainAge';

export default function ReportScreen({ navigate, scores, sessions, participant }) {
  const report = calculateBrainAge(scores, participant?.age || 40);
  const printRef = useRef();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { window.scrollTo(0,0); }, []);

  if (!report) return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('domains')}>← Back</button>
        <span style={{fontSize:15,fontWeight:500}}>Report</span>
        <div style={{width:70}}/>
      </nav>
      <div style={{padding:40,textAlign:'center',color:'var(--text2)'}}>Complete at least one domain to generate a report.</div>
    </div>
  );

  const recs = getRecommendations(report.domainAnalysis, report.ageDiff);
  const brainYounger = report.ageDiff > 0;
  const brainSame    = Math.abs(report.ageDiff) <= 2;

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      
      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      const W = 210, margin = 20;
      let y = 20;

      const brand = [29,158,117];
      const navy  = [4,44,83];
      const text2 = [90,122,110];

      // Header bar
      doc.setFillColor(...brand);
      doc.rect(0, 0, W, 18, 'F');
      doc.setTextColor(255,255,255);
      doc.setFontSize(14); doc.setFont('helvetica','bold');
      doc.text('NeuroSpark', margin, 12);
      doc.setFontSize(9); doc.setFont('helvetica','normal');
      doc.text('Cognitive Assessment Report', margin+36, 12);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}`, W-margin, 12, {align:'right'});
      y = 28;

      // Participant block
      doc.setFillColor(241,247,244);
      doc.roundedRect(margin, y, W-2*margin, 28, 3, 3, 'F');
      doc.setTextColor(...navy); doc.setFontSize(11); doc.setFont('helvetica','bold');
      doc.text(participant?.name || 'Participant', margin+6, y+8);
      doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(...text2);
      doc.text(`Age: ${participant?.age}   |   Gender: ${participant?.gender}   |   Education: ${participant?.education}`, margin+6, y+15);
      if (participant?.assessor) doc.text(`Assessor: ${participant.assessor}`, margin+6, y+22);
      doc.text(`Assessment Date: ${participant?.date || new Date().toLocaleDateString()}`, W-margin-6, y+22, {align:'right'});
      y += 34;

      // Brain Age hero
      doc.setFillColor(...navy);
      doc.roundedRect(margin, y, W-2*margin, 36, 4, 4, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(11); doc.setFont('helvetica','bold');
      doc.text('BRAIN AGE', margin+8, y+10);
      doc.setFontSize(26); doc.setFont('helvetica','bold');
      doc.text(`${report.brainAge}`, margin+8, y+28);
      doc.setFontSize(10); doc.setFont('helvetica','normal');
      doc.text(`Chronological Age: ${report.actualAge}`, margin+40, y+22);
      const diffText = brainSame ? 'Same as chronological age'
        : brainYounger ? `${Math.abs(report.ageDiff)} years YOUNGER than body age`
        : `${Math.abs(report.ageDiff)} years OLDER than body age`;
      doc.setFontSize(9);
      doc.setTextColor(brainSame ? 200 : brainYounger ? 90 : 255, brainSame ? 200 : brainYounger ? 220 : 180, brainSame ? 200 : brainYounger ? 170 : 100);
      doc.text(diffText, margin+40, y+30);
      doc.setTextColor(200,200,200);
      doc.text(`Composite Score: ${report.compositeScore}%   |   Percentile: ${report.percentile}th   |   Cognitive Reserve: ${report.reserveIndex}`, margin+8, y+34);
      y += 42;

      // Interpretation
      doc.setTextColor(...navy); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text('Overall Interpretation', margin, y+6); y += 10;
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(...text2);
      const lines = doc.splitTextToSize(`${report.interpretation.headline}: ${report.interpretation.summary}`, W-2*margin);
      doc.text(lines, margin, y); y += lines.length*5 + 6;

      // Domain scores table
      doc.setTextColor(...navy); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text('Domain Scores', margin, y); y += 7;
      doc.setFillColor(241,247,244);
      doc.rect(margin, y, W-2*margin, 7, 'F');
      doc.setTextColor(...text2); doc.setFontSize(8); doc.setFont('helvetica','bold');
      doc.text('Domain', margin+3, y+5);
      doc.text('Score', margin+70, y+5);
      doc.text('Expected', margin+95, y+5);
      doc.text('Brain Age', margin+122, y+5);
      doc.text('Status', margin+148, y+5);
      y += 9;

      report.domainAnalysis.forEach((d, i) => {
        const domain = DOMAINS.find(x=>x.id===d.id);
        if (i%2===0) { doc.setFillColor(250,252,251); doc.rect(margin,y-1,W-2*margin,8,'F'); }
        doc.setTextColor(...text2); doc.setFont('helvetica','normal'); doc.setFontSize(8);
        doc.text(domain?.name||d.id, margin+3, y+5);
        doc.text(`${d.rawScore}%`, margin+70, y+5);
        doc.text(`${d.expectedScore}%`, margin+95, y+5);
        doc.text(`${d.domainAge} yrs`, margin+122, y+5);
        const statusColor = d.status==='above'?[29,158,117]:d.status==='normal'?[24,95,165]:d.status==='below'?[186,117,23]:[163,45,45];
        doc.setTextColor(...statusColor);
        doc.text(d.status.charAt(0).toUpperCase()+d.status.slice(1), margin+148, y+5);
        y += 8;
      });
      y += 4;

      // Domain interpretations
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setTextColor(...navy); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text('Domain-by-Domain Analysis', margin, y); y += 8;

      report.domainAnalysis.forEach(d => {
        const domain = DOMAINS.find(x=>x.id===d.id);
        const interp = getDomainInterpretation(d.id, d.rawScore, d.expectedScore, report.actualAge);
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(241,247,244);
        doc.roundedRect(margin, y, W-2*margin, 5, 1, 1, 'F');
        doc.setTextColor(...navy); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text(`${domain?.icon||''} ${domain?.name||d.id}  —  ${d.rawScore}%`, margin+3, y+4);
        y += 7;
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(...text2);
        const iLines = doc.splitTextToSize(interp, W-2*margin);
        doc.text(iLines, margin+3, y);
        y += iLines.length*4.5 + 5;
      });

      // Recommendations
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setTextColor(...navy); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text('Recommendations', margin, y); y += 8;
      recs.forEach(r => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...navy);
        doc.text(`${r.icon} ${r.title}`, margin+3, y);
        y += 5;
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(...text2);
        const rLines = doc.splitTextToSize(r.desc, W-2*margin-6);
        doc.text(rLines, margin+6, y);
        y += rLines.length*4.5 + 5;
      });

      // Footer with A1Intercept branding
      const pageCount = doc.internal.getNumberOfPages();
      for (let i=1; i<=pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(4, 44, 83);
        doc.rect(0, 284, W, 13, 'F');
        doc.setTextColor(160,185,175); doc.setFontSize(6); doc.setFont('helvetica','normal');
        doc.text('Not a diagnostic tool. For research use only.', margin, 290);
        doc.setTextColor(255,255,255); doc.setFontSize(7.5); doc.setFont('helvetica','bold');
        doc.text('NeuroSpark', W/2, 289, {align:'center'});
        doc.setTextColor(29,158,117); doc.setFontSize(6); doc.setFont('helvetica','normal');
        doc.text('Cognitive Assessment Platform', W/2, 293, {align:'center'});
        doc.setTextColor(160,185,175); doc.setFontSize(6.5); doc.setFont('helvetica','normal');
        doc.text(`Built by A1Intercept Technologies  |  Page ${i} of ${pageCount}`, W-margin, 293, {align:'right'});
      }

      setDownloading(false);
      doc.save(`NeuroSpark_Report_${(participant?.name||'Participant').replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      setDownloading(false); console.error("PDF error:", err);
      alert('PDF generation failed. Try printing instead (Ctrl+P).');
    }
  };

  const statusColor = { above:'var(--brand)', normal:'var(--navy-mid)', below:'var(--amber)', low:'var(--red)' };
  const statusLabel = { above:'Above Average', normal:'Normal Range', below:'Slightly Below', low:'Needs Attention' };

  return (
    <div className="fade-up" ref={printRef}>
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('dashboard')}>← Dashboard</button>
        <span style={{fontSize:14,fontWeight:500}}>Cognitive Report</span>
        <button onClick={handleDownloadPDF} disabled={downloading} style={{background:downloading?'var(--text3)':'var(--brand)',color:'#fff',border:'none',borderRadius:10,padding:'7px 12px',fontSize:12,fontWeight:500,cursor:downloading?'default':'pointer',fontFamily:'inherit'}}>
          {downloading?'Generating…':'⬇ PDF'}
        </button>
      </nav>

      <div style={{padding:'0 20px 24px'}}>

        {/* Participant info strip */}
        <div style={{background:'var(--navy)',borderRadius:16,padding:'16px',margin:'16px 0',color:'#fff'}}>
          <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>{participant?.name}</div>
          <div style={{fontSize:12,opacity:.7,lineHeight:1.8}}>
            Age: {participant?.age} &nbsp;·&nbsp; {participant?.gender} &nbsp;·&nbsp; {participant?.education}<br/>
            {participant?.assessor && `Assessor: ${participant.assessor} · `}Date: {participant?.date}
          </div>
        </div>

        {/* Brain Age hero card */}
        <div style={{background:`linear-gradient(135deg, var(--navy) 0%, #185FA5 100%)`,borderRadius:20,padding:'24px 20px',marginBottom:16,color:'#fff',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,.05)'}}/>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:.6,textTransform:'uppercase',opacity:.7,marginBottom:8}}>Brain Age Assessment</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:20,marginBottom:12}}>
            <div>
              <div style={{fontSize:11,opacity:.6,marginBottom:2}}>Brain Age</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:56,lineHeight:1,color:'#fff'}}>{report.brainAge}</div>
            </div>
            <div style={{paddingBottom:8}}>
              <div style={{fontSize:11,opacity:.6,marginBottom:2}}>Body Age</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,lineHeight:1,opacity:.8}}>{report.actualAge}</div>
            </div>
            <div style={{paddingBottom:8,flex:1}}>
              <div style={{
                background: brainSame ? 'rgba(255,255,255,.15)' : brainYounger ? 'rgba(29,158,117,.4)' : 'rgba(163,45,45,.4)',
                borderRadius:12, padding:'8px 12px', textAlign:'center',
              }}>
                <div style={{fontSize:18,fontWeight:700}}>{brainSame?'≈':brainYounger?`-${report.ageDiff}`:`+${Math.abs(report.ageDiff)}`}</div>
                <div style={{fontSize:10,opacity:.8}}>{brainSame?'Same':'years'}</div>
                <div style={{fontSize:10,opacity:.7}}>{brainSame?'as body age':brainYounger?'younger':'older'}</div>
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {[['Composite',report.compositeScore+'%'],['Percentile',report.percentile+'th'],['Reserve',report.reserveIndex+'']].map(([k,v])=>(
              <div key={k} style={{background:'rgba(255,255,255,.1)',borderRadius:10,padding:'8px',textAlign:'center'}}>
                <div style={{fontSize:15,fontWeight:600}}>{v}</div>
                <div style={{fontSize:10,opacity:.7,marginTop:2}}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation banner */}
        <div style={{background:report.interpretation.color+'18',border:`1px solid ${report.interpretation.color}44`,borderRadius:14,padding:'14px 16px',marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:600,color:report.interpretation.color,marginBottom:6}}>
            {report.interpretation.emoji} {report.interpretation.headline}
          </div>
          <p style={{fontSize:13,color:'var(--text)',lineHeight:1.6}}>{report.interpretation.summary}</p>
        </div>

        {/* Domain scores */}
        <div className="card" style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,color:'var(--text3)',letterSpacing:.5,textTransform:'uppercase',marginBottom:14}}>Domain Scores vs Expected</div>
          {report.domainAnalysis.map(d=>{
            const domain = DOMAINS.find(x=>x.id===d.id);
            return (
              <div key={d.id} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:16}}>{domain?.icon}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:500}}>{domain?.name}</div>
                      <div style={{fontSize:10,color:'var(--text3)'}}>Brain age: {d.domainAge} yrs</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:15,fontWeight:600,color:scoreColor(d.rawScore)}}>{d.rawScore}%</div>
                    <span style={{fontSize:10,color:statusColor[d.status]}}>{statusLabel[d.status]}</span>
                  </div>
                </div>
                {/* Dual bar: actual vs expected */}
                <div style={{position:'relative',height:8,background:'var(--border)',borderRadius:4,marginBottom:2}}>
                  <div style={{position:'absolute',left:0,top:0,height:8,width:`${d.expectedScore}%`,background:'var(--border-mid)',borderRadius:4}}/>
                  <div style={{position:'absolute',left:0,top:0,height:8,width:`${d.rawScore}%`,background:domain?.color||'var(--brand)',borderRadius:4,opacity:.85}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text3)'}}>
                  <span>Your score: {d.rawScore}%</span>
                  <span>Expected for age: {d.expectedScore}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed domain interpretations */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:'var(--navy)',marginBottom:12}}>Domain-by-Domain Analysis</div>
          {report.domainAnalysis.map(d=>{
            const domain = DOMAINS.find(x=>x.id===d.id);
            const interp = getDomainInterpretation(d.id, d.rawScore, d.expectedScore, report.actualAge);
            return (
              <div key={d.id} className="card" style={{marginBottom:10,borderLeft:`3px solid ${statusColor[d.status]}`}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <div style={{width:34,height:34,borderRadius:10,background:domain?.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{domain?.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{domain?.name}</div>
                    <div style={{fontSize:11,color:statusColor[d.status],fontWeight:500}}>{statusLabel[d.status]} · {d.rawScore}%</div>
                  </div>
                </div>
                <p style={{fontSize:12,color:'var(--text2)',lineHeight:1.6}}>{interp}</p>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,color:'var(--navy)',marginBottom:12}}>Personalised Recommendations</div>
          {recs.map((r,i)=>(
            <div key={i} className="card" style={{marginBottom:10,display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{fontSize:26,flexShrink:0}}>{r.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>{r.title}</div>
                <p style={{fontSize:12,color:'var(--text2)',lineHeight:1.6}}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Download & actions */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <button className="btn-primary" onClick={handleDownloadPDF} disabled={downloading} style={{opacity:downloading?0.7:1}}>{downloading ? "⏳ Generating PDF…" : "⬇ Download PDF Report"}</button>
          <button className="btn-secondary" onClick={handlePrint}>🖨 Print Report</button>
          <button className="btn-secondary" onClick={()=>navigate('domains')}>Retake Assessment</button>
        </div>

      </div>
      <A1Badge />
      <p className="disclaimer">⚠ NeuroSpark is not a clinical diagnostic tool. This report is for research and informational purposes only. Do not make medical decisions based on these results without consulting a qualified healthcare professional.</p>
    </div>
  );
}
