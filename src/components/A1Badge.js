const LOGO_URL = "https://media.licdn.com/dms/image/v2/D4E0BAQG0Xbxb-A1d3A/company-logo_100_100/B4EZrfgBSpGcAQ-/0/1764686305433/a1intercept_technologies_logo?e=1769040000&v=beta&t=5-E0hPVsihDfrCvfwTxWDo-_t3YffuR9ZInxsvWVhZU";

export default function A1Badge({ style = {} }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '10px 0 18px',
      ...style,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '5px 14px 5px 6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <img
          src={LOGO_URL}
          alt="A1Intercept Technologies"
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 400, letterSpacing: .3 }}>
            Built by
          </div>
          <div style={{ fontSize: 11, color: 'var(--navy)', fontWeight: 600, letterSpacing: .2 }}>
            A1Intercept Technologies
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact inline version — for nav bars or tight spaces */
export function A1BadgeInline({ style = {} }) {
  return (
    <a
      href="https://www.linkedin.com/company/a1intercept-technologies"
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        textDecoration: 'none',
        ...style,
      }}
    >
      <img
        src={LOGO_URL}
        alt="A1Intercept Technologies"
        style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
        onError={e => { e.target.style.display = 'none'; }}
      />
      <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500 }}>
        A1Intercept Technologies
      </span>
    </a>
  );
}
