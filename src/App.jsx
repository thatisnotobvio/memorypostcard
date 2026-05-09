import { useState, useRef, useEffect, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { nanoid } from 'nanoid'


// ─── THEMES ────────────────────────────────────────────────────────
const THEMES = [
  {
    id: 'vintage', label: 'Vintage',
    swatch: 'linear-gradient(135deg, #8b6f4e, #c9a87c)',
    frontBg: 'linear-gradient(135deg, #8b6f4e 0%, #c9a87c 50%, #8b6f4e 100%)',
    overlay: 'linear-gradient(to top, rgba(45,28,14,0.72) 0%, rgba(45,28,14,0.12) 55%, rgba(45,28,14,0.04) 100%)',
    backBg: '#faf3e8', backColor: '#4a3728',
    locFont: "'Cormorant Garamond', serif",
    locStyle: { fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '22px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', letterSpacing: '0.06em', color: '#d4b896' },
    locColor: '#f5ede0', stampColor: '#c9b99a', postmarkColor: '#c9b99a', borderDecor: true, texture: 'vintage',
    exportBg: 'linear-gradient(160deg, #d4b896 0%, #a8865c 40%, #7a5c3a 100%)',
  },
  {
    id: 'modern', label: 'Modern',
    swatch: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    frontBg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    overlay: 'linear-gradient(135deg, rgba(15,15,30,0.15) 0%, rgba(15,15,30,0.6) 100%)',
    backBg: '#f8f8f8', backColor: '#1a1a2e',
    locFont: "'DM Sans', sans-serif",
    locStyle: { fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '20px' },
    tagStyle: { fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' },
    locColor: '#ffffff', stampColor: '#0f3460', postmarkColor: 'rgba(255,255,255,0.35)', borderDecor: false, texture: 'modern',
    exportBg: 'linear-gradient(160deg, #0d1117 0%, #1a1a2e 50%, #0f3460 100%)',
  },
  {
    id: 'botanical', label: 'Botanical',
    swatch: 'linear-gradient(135deg, #1e3a2f, #2d5a40)',
    frontBg: 'linear-gradient(145deg, #1e3a2f 0%, #2d5a40 50%, #1e3a2f 100%)',
    overlay: 'linear-gradient(to bottom, rgba(15,28,22,0.08) 0%, rgba(15,28,22,0.65) 100%)',
    backBg: '#f4f9f1', backColor: '#1e3a2f',
    locFont: "'Playfair Display', serif",
    locStyle: { fontWeight: 400, letterSpacing: '0.1em', fontSize: '20px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', color: '#a8d8b4' },
    locColor: '#e8f5e0', stampColor: '#2d5a40', postmarkColor: '#a8d8b4', borderDecor: false, texture: 'botanical',
    exportBg: 'linear-gradient(160deg, #0f2018 0%, #1e3a2f 50%, #2d5a40 100%)',
  },
  {
    id: 'coastal', label: 'Coastal',
    swatch: 'linear-gradient(135deg, #0ea5e9, #075985)',
    frontBg: 'linear-gradient(180deg, #0ea5e9 0%, #0369a1 50%, #075985 100%)',
    overlay: 'linear-gradient(to top, rgba(5,30,55,0.72) 0%, rgba(5,30,55,0.06) 65%)',
    backBg: '#f0f7ff', backColor: '#0369a1',
    locFont: "'DM Sans', sans-serif",
    locStyle: { fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '20px' },
    tagStyle: { fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(180,225,255,0.85)' },
    locColor: '#ffffff', stampColor: '#0369a1', postmarkColor: 'rgba(255,255,255,0.4)', borderDecor: false, texture: 'coastal',
    exportBg: 'linear-gradient(160deg, #0c2233 0%, #0369a1 50%, #0ea5e9 100%)',
  },
  {
    id: 'desert', label: 'Desert',
    swatch: 'linear-gradient(135deg, #c2703a, #e8944d)',
    frontBg: 'linear-gradient(160deg, #c2703a 0%, #e8944d 45%, #c2703a 100%)',
    overlay: 'linear-gradient(to top, rgba(60,25,8,0.7) 0%, rgba(60,25,8,0.05) 60%)',
    backBg: '#fdf5ec', backColor: '#7c3d14',
    locFont: "'Playfair Display', serif",
    locStyle: { fontWeight: 700, letterSpacing: '0.06em', fontSize: '22px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', color: '#fde8cc' },
    locColor: '#fff8f0', stampColor: '#c2703a', postmarkColor: 'rgba(255,240,210,0.5)', borderDecor: true, texture: 'desert',
    exportBg: 'linear-gradient(160deg, #6b2f0a 0%, #c2703a 50%, #e8944d 100%)',
  },
  {
    id: 'arctic', label: 'Arctic',
    swatch: 'linear-gradient(135deg, #b8d4e8, #4a90b8)',
    frontBg: 'linear-gradient(160deg, #b8d4e8 0%, #d8eaf5 50%, #a0c4e0 100%)',
    overlay: 'linear-gradient(to top, rgba(20,45,70,0.55) 0%, rgba(20,45,70,0.04) 60%)',
    backBg: '#f7fbff', backColor: '#1e3a52',
    locFont: "'Cormorant Garamond', serif",
    locStyle: { fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '20px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.75)' },
    locColor: '#ffffff', stampColor: '#4a90b8', postmarkColor: 'rgba(255,255,255,0.5)', borderDecor: false, texture: 'arctic',
    exportBg: 'linear-gradient(160deg, #9fc8e0 0%, #c8e4f5 50%, #e8f4fb 100%)',
  },
  {
    id: 'sakura', label: 'Sakura',
    swatch: 'linear-gradient(135deg, #f9a8d4, #db2777)',
    frontBg: 'linear-gradient(150deg, #f9a8d4 0%, #fce7f3 40%, #f0abcd 100%)',
    overlay: 'linear-gradient(to top, rgba(100,30,60,0.6) 0%, rgba(100,30,60,0.04) 60%)',
    backBg: '#fff5f8', backColor: '#831843',
    locFont: "'Playfair Display', serif",
    locStyle: { fontWeight: 700, letterSpacing: '0.08em', fontSize: '20px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,240,248,0.85)' },
    locColor: '#fff0f6', stampColor: '#db2777', postmarkColor: 'rgba(255,220,240,0.65)', borderDecor: true, texture: 'sakura',
    exportBg: 'linear-gradient(160deg, #fce7f3 0%, #f9a8d4 50%, #db2777 100%)',
  },
  {
    id: 'midnight', label: 'Midnight',
    swatch: 'linear-gradient(135deg, #0d0d1a, #7c3aed)',
    frontBg: 'linear-gradient(160deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)',
    overlay: 'linear-gradient(to top, rgba(5,3,12,0.8) 0%, rgba(5,3,12,0.1) 50%)',
    backBg: '#0f0f1e', backColor: '#c4b5fd',
    locFont: "'Cormorant Garamond', serif",
    locStyle: { fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '20px' },
    tagStyle: { fontStyle: 'italic', fontSize: '12px', color: 'rgba(196,181,253,0.65)' },
    locColor: '#e9d5ff', stampColor: '#7c3aed', postmarkColor: 'rgba(196,181,253,0.4)', borderDecor: false, texture: 'midnight',
    exportBg: 'linear-gradient(160deg, #050308 0%, #0d0d1a 50%, #1a0a2e 100%)',
  },
]

const STAMPS = [
  { id: 'classic', label: 'Classic' },
  { id: 'airmail', label: 'Air Mail' },
  { id: 'star', label: 'Star' },
  { id: 'wax', label: 'Wax Seal' },
]

// ─── SVG COMPONENTS ────────────────────────────────────────────────
function StampSVG({ id, color, size = 56 }) {
  if (id === 'classic') return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <rect x="4" y="4" width="52" height="52" stroke={color} strokeWidth="1.5" fill="none" opacity="0.55" strokeDasharray="3,2"/>
      <circle cx="30" cy="30" r="18" stroke={color} strokeWidth="1" fill="none" opacity="0.5"/>
      <text x="30" y="26" textAnchor="middle" fontFamily="serif" fontSize="6.5" fill={color} opacity="0.8" letterSpacing="2">POST</text>
      <text x="30" y="36" textAnchor="middle" fontFamily="serif" fontSize="8.5" fill={color} opacity="0.9" letterSpacing="1">CARD</text>
      <text x="30" y="44" textAnchor="middle" fontFamily="serif" fontSize="5" fill={color} opacity="0.65" letterSpacing="2">2025</text>
    </svg>
  )
  if (id === 'airmail') return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="26" stroke={color} strokeWidth="1.5" fill="none" opacity="0.45" strokeDasharray="4,2"/>
      <circle cx="30" cy="30" r="19" stroke={color} strokeWidth="0.8" fill="none" opacity="0.35"/>
      <text x="30" y="28" textAnchor="middle" fontFamily="serif" fontSize="7" fill={color} opacity="0.85" letterSpacing="1.5">AIR</text>
      <text x="30" y="38" textAnchor="middle" fontFamily="serif" fontSize="7" fill={color} opacity="0.85" letterSpacing="1.5">MAIL</text>
    </svg>
  )
  if (id === 'star') return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <polygon points="30,5 36,22 55,22 41,34 46,52 30,40 14,52 19,34 5,22 24,22" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5"/>
      <text x="30" y="34" textAnchor="middle" fontFamily="serif" fontSize="10" fill={color} opacity="0.75">✦</text>
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="24" fill={color} opacity="0.15"/>
      <circle cx="30" cy="30" r="20" stroke={color} strokeWidth="1.5" fill="none" opacity="0.45"/>
      <circle cx="30" cy="30" r="14" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3"/>
      <text x="30" y="35" textAnchor="middle" fontFamily="serif" fontSize="14" fill={color} opacity="0.65">✦</text>
    </svg>
  )
}

function TextureOverlay({ id }) {
  if (id === 'vintage') return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice">
      <defs><filter id="vg"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
      <rect width="480" height="240" opacity="0.06" filter="url(#vg)" fill="#c8a060"/>
    </svg>
  )
  if (id === 'botanical') return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" opacity="0.13">
      <ellipse cx="55" cy="38" rx="32" ry="16" fill="none" stroke="rgba(168,216,180,0.7)" strokeWidth="1" transform="rotate(-30 55 38)"/>
      <ellipse cx="420" cy="200" rx="38" ry="18" fill="none" stroke="rgba(168,216,180,0.6)" strokeWidth="1" transform="rotate(20 420 200)"/>
    </svg>
  )
  if (id === 'coastal') return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" opacity="0.16">
      {[0,1,2,3,4,5,6].map(i => (
        <path key={i} d={`M ${-40+i*80} 220 Q ${i*80} ${208+(i%3)*8} ${40+i*80} 220`} fill="none" stroke="white" strokeWidth="1.2"/>
      ))}
    </svg>
  )
  if (id === 'midnight') return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" opacity="0.45">
      {Array.from({length:28}).map((_,i)=>{
        const angle = i * 137.508 * Math.PI/180
        const r = 15 + (i%7)*20
        return <circle key={i} cx={240+Math.cos(angle)*r*2.2} cy={120+Math.sin(angle)*r} r={i%5===0?1.5:0.7} fill="rgba(196,181,253,0.7)"/>
      })}
    </svg>
  )
  if (id === 'sakura') return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 480 240" preserveAspectRatio="xMidYMid slice" opacity="0.2">
      {[{x:70,y:28},{x:180,y:70},{x:370,y:18},{x:440,y:130},{x:30,y:175},{x:310,y:200}].map((p,i)=>(
        <g key={i} transform={`translate(${p.x},${p.y})`}>
          <circle r="2.5" fill="rgba(255,255,255,0.8)"/>
          <circle r="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7"/>
        </g>
      ))}
    </svg>
  )
  return null
}

function GlareLayer({ rotX, rotY }) {
  const gx = 50 + rotY * 0.6
  const gy = 50 - rotX * 1.2
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:10, pointerEvents:'none', borderRadius:10,
      background:`radial-gradient(ellipse 55% 45% at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, transparent 80%)`,
      mixBlendMode:'screen',
    }}/>
  )
}

// ─── SIDE PANEL SECTION ────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="sp-section">
      <button className="sp-section-header" onClick={() => setOpen(o => !o)}>
        <span className="sp-section-title">{title}</span>
        <span className="sp-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && <div className="sp-section-body">{children}</div>}
    </div>
  )
}

// ─── POSTCARD FACES (shared between 3D view + export canvas) ───────
function PostcardFront({ theme, stamp, photo, location, tagline, glareRotX = 0, glareRotY = 0, forExport = false }) {
  return (
    <div className="front-inner" style={{ background: theme.frontBg }}>
      {photo && <img className="photo-layer" src={photo} alt="postcard" crossOrigin="anonymous"/>}
      <div className="overlay-layer" style={{ background: theme.overlay }}/>
      <TextureOverlay id={theme.texture}/>
      {theme.borderDecor && <div className="border-decor" style={{ borderColor: theme.postmarkColor }}/>}
      {!forExport && <GlareLayer rotX={glareRotX} rotY={glareRotY}/>}
      <div className="stamp-pos"><StampSVG id={stamp} color={theme.postmarkColor} size={60}/></div>
      <div className="front-text">
        <div style={{ fontFamily: theme.locFont, color: theme.locColor, ...theme.locStyle }}>
          {location || 'Your Destination'}
        </div>
        <div style={{ fontFamily: theme.locFont, marginTop: 4, ...theme.tagStyle }}>{tagline}</div>
      </div>
    </div>
  )
}

function PostcardBack({ theme, stamp, location, message, glareRotX = 0, glareRotY = 0, forExport = false }) {
  return (
    <div className="back-inner" style={{ background: theme.backBg, color: theme.backColor }}>
      <div className="back-left">
        <div>
          <div className="back-msg-label" style={{ fontFamily: theme.locFont, color: theme.backColor }}>Message</div>
          <p className="back-msg" style={{ fontFamily: theme.locFont, color: theme.backColor }}>
            {message || 'Your message here...'}
          </p>
        </div>
        <div className="back-from" style={{ fontFamily: theme.locFont, color: theme.backColor, opacity: 0.45 }}>{location}</div>
      </div>
      <div className="back-divider" style={{ background: theme.backColor, opacity: 0.18 }}/>
      <div className="back-right">
        <div className="stamp-corner"><StampSVG id={stamp} color={theme.backColor} size={44}/></div>
        <div className="addr-lines">
          {[90,78,65,85,70].map((w,i) => (
            <div key={i} className="addr-line" style={{ width:`${w}%`, background: theme.backColor, opacity: 0.18, marginTop: i===3?14:0 }}/>
          ))}
        </div>
      </div>
      {!forExport && <GlareLayer rotX={-glareRotX} rotY={-glareRotY}/>}
    </div>
  )
}

// ─── EXPORT CANVAS (hidden, rendered for html2canvas) ──────────────
// Renders the reference-style layout: blurred bg + tilted front over back
function ExportCanvas({ theme, stamp, photo, location, tagline, message, canvasRef }) {
  return (
    <div ref={canvasRef} className="export-canvas" style={{ position:'fixed', left:'-9999px', top:0, width:640, height:800 }}>
      {/* Blurred background */}
      <div className="export-bg" style={{ background: theme.exportBg }}>
        {photo && (
          <img src={photo} alt="" crossOrigin="anonymous" style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', filter:'blur(58px) brightness(0.55) saturate(1.2)',
            transform:'scale(1.08)',
          }}/>
        )}
        {/* grain overlay */}
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.18)', mixBlendMode:'multiply' }}/>
      </div>

      {/* BACK card — slightly lower, subtle tilt */}
      <div className="export-back-wrap">
        <div className="export-card export-back-card">
          <PostcardBack theme={theme} stamp={stamp} location={location} message={message} forExport/>
        </div>
      </div>

      {/* FRONT card — on top, opposite tilt, overlapping */}
      <div className="export-front-wrap">
        <div className="export-card export-front-card">
          <PostcardFront theme={theme} stamp={stamp} photo={photo} location={location} tagline={tagline} forExport/>
        </div>
      </div>

      {/* Branding */}
      <div className="export-brand">✦ POSTCARD</div>
    </div>
  )
}

// ─── SHARE MODAL ───────────────────────────────────────────────────
function ShareModal({ onClose, imageDataUrl, location, message, theme }) {
  const [copied, setCopied] = useState(false)
  const shareText = `📮 Postcard from ${location}\n\n${message}\n\n— Sent with love`
  const uniqueId = crypto.randomUUID()
  const uniqueLink = `${window.location.origin}/p/${uniqueId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(uniqueLink)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const shareNative = async () => {
    if (imageDataUrl && navigator.share) {
      try {
        const res = await fetch(imageDataUrl)
        const blob = await res.blob()
        const file = new File([blob], 'postcard.png', { type: 'image/png' })
        await navigator.share({ title: `Postcard from ${location}`, text: shareText, files: [file] })
        return
      } catch(_) {}
    }
    if (navigator.share) {
      try { await navigator.share({ title: `Postcard from ${location}`, text: shareText }) } catch(_) {}
    } else {
      await navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {imageDataUrl && (
          <img src={imageDataUrl} alt="Postcard export" className="modal-preview"/>
        )}

        <div className="modal-body">
          <div className="modal-title">Share this postcard</div>
          <p className="modal-sub">Your postcard is ready. Share the image or copy a link.</p>

          <div className="modal-link-row">
            <div className="modal-link-pill">{uniqueLink}</div>
            <button className="modal-copy-btn" onClick={copyLink}>
              {copied ? '✓ Copied' : 'Copy link'}
            </button>
          </div>

          <div className="modal-actions">
            {imageDataUrl && (
              <a className="sp-btn" href={imageDataUrl} download={`postcard-${location.replace(/\s/g,'-').toLowerCase()}.png`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download image
              </a>
            )}
            <button className="sp-btn sp-btn-primary" onClick={shareNative}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 1l3 3-3 3M1 7v1a4 4 0 004 4h8M10 1H5a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [themeId, setThemeId]   = useState('vintage')
  const [stampId, setStampId]   = useState('classic')
  const [photo, setPhoto]       = useState(null)
  const [location, setLocation] = useState('Paris, France')
  const [tagline, setTagline]   = useState('Greetings from afar')
  const [message, setMessage]   = useState('Wish you were here with me, standing in this golden light. Every cobblestone, every café, every quiet morning reminds me of you.')
  const [transform, setTransform] = useState({ rotX: 0, rotY: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [notification, setNotification] = useState('')
  const [isExporting, setIsExporting]   = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [exportedImage, setExportedImage]   = useState(null)

  const phys = useRef({ rotX:0, rotY:0, velX:0, velY:0, active:false, lastX:0, lastY:0, animId:null })
  const frontRef    = useRef(null)
  const backRef     = useRef(null)
  const exportRef   = useRef(null)
  const fileRef     = useRef(null)

  const theme = THEMES.find(t => t.id === themeId)
  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 2600) }

  // ── physics drag ──
  const startInertia = useCallback(() => {
    const p = phys.current
    const FRICTION = 0.90, REST_PULL = 0.018, MIN_VEL = 0.02
    const tick = () => {
      p.velX *= FRICTION; p.velY *= FRICTION
      p.velX += -p.rotX * REST_PULL
      p.rotX += p.velX; p.rotY += p.velY
      p.rotX = Math.max(-55, Math.min(55, p.rotX))
      setTransform({ rotX: p.rotX, rotY: p.rotY })
      if (Math.abs(p.velX) > MIN_VEL || Math.abs(p.velY) > MIN_VEL)
        p.animId = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(p.animId); p.animId = requestAnimationFrame(tick)
  }, [])

  const onDown = useCallback((e) => {
    e.preventDefault()
    const p = phys.current, pt = e.touches ? e.touches[0] : e
    p.active = true; p.lastX = pt.clientX; p.lastY = pt.clientY
    p.velX = 0; p.velY = 0
    cancelAnimationFrame(p.animId); setIsDragging(true)
  }, [])

  const onMove = useCallback((e) => {
    const p = phys.current; if (!p.active) return
    const pt = e.touches ? e.touches[0] : e
    const dx = pt.clientX - p.lastX, dy = pt.clientY - p.lastY
    p.lastX = pt.clientX; p.lastY = pt.clientY
    p.velY = dx * 0.45; p.velX = -dy * 0.3
    p.rotY += p.velY; p.rotX += p.velX
    p.rotX = Math.max(-55, Math.min(55, p.rotX))
    setTransform({ rotX: p.rotX, rotY: p.rotY })
  }, [])

  const onUp = useCallback(() => {
    const p = phys.current; if (!p.active) return
    p.active = false; setIsDragging(false); startInertia()
  }, [startInertia])

  useEffect(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [onMove, onUp])

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── export: renders the hidden ExportCanvas with html2canvas ──
  const buildExportImage = async () => {
    if (!exportRef.current) return null
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 640,
        height: 800,
      })
      return canvas.toDataURL('image/png')
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    const dataUrl = await buildExportImage()
    setIsExporting(false)
    if (dataUrl) {
      const link = document.createElement('a')
      link.download = `postcard-${location.replace(/\s/g,'-').toLowerCase()}.png`
      link.href = dataUrl; link.click()
      notify('Postcard saved!')
    } else {
      notify('Export failed — try again')
    }
  }

  const handleShare = async () => {
    setIsExporting(true)
    const dataUrl = await buildExportImage()
    setIsExporting(false)
    setExportedImage(dataUrl)
    setShowShareModal(true)
  }

  const shadowX = (transform.rotY % 360) * 0.05
  const shadowBlur = 40 + Math.abs(transform.rotX) * 0.3
  const shadowOpacity = 0.2 + Math.abs(transform.rotX) * 0.002
  const normalizedRotY = ((transform.rotY % 360) + 360) % 360
  const showingBack = normalizedRotY > 90 && normalizedRotY < 270
  const glareRotX = showingBack ? -transform.rotX : transform.rotX
  const glareRotY = showingBack ? -(transform.rotY % 180) : (transform.rotY % 180)

  return (
    <div className="layout">
      {notification && <div className="notif">{notification}</div>}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          imageDataUrl={exportedImage}
          location={location}
          message={message}
          theme={theme}
        />
      )}

      {/* Hidden export canvas — always rendered off-screen */}
      <ExportCanvas
        theme={theme} stamp={stampId} photo={photo}
        location={location} tagline={tagline} message={message}
        canvasRef={exportRef}
      />

      {/* ── LEFT: canvas ── */}
      <div className="canvas-area">
        <div className="canvas-logo">✦ POSTCARD</div>

        <div className={`scene ${isDragging ? 'grabbing' : ''}`} onMouseDown={onDown} onTouchStart={onDown}>
          <div className="card-shadow" style={{
            transform: `translateX(${shadowX}px) scaleX(1.05)`,
            filter: `blur(${shadowBlur}px)`,
            opacity: shadowOpacity,
          }}/>
          <div className="card-wrap" style={{ transform: `rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg)` }}>

            <div className="face face-front" ref={frontRef}>
              <PostcardFront theme={theme} stamp={stampId} photo={photo} location={location} tagline={tagline}
                glareRotX={glareRotX} glareRotY={glareRotY}/>
            </div>
            <div className="face face-back" ref={backRef}>
              <PostcardBack theme={theme} stamp={stampId} location={location} message={message}
                glareRotX={glareRotX} glareRotY={glareRotY}/>
            </div>
          </div>
        </div>

        <div className="canvas-hint">
          <div className="export-actions">
              <button className="sp-btn" onClick={handleExport} disabled={isExporting}>
                {isExporting
                  ? <><span className="sp-spinner"/>Generating…</>
                  : <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Download</>
                }
              </button>
              <button className="sp-btn sp-btn-primary" onClick={handleShare} disabled={isExporting}>
                {isExporting
                  ? <><span className="sp-spinner sp-spinner-light"/>Generating…</>
                  : <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 1l3 3-3 3M1 7v1a4 4 0 004 4h8M10 1H5a4 4 0 00-4 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Share</>
                }
              </button>
            </div>
        </div>
      </div>

      {/* ── RIGHT: side panel ── */}
      <aside className="side-panel">
        <div className="sp-inner">

          <Section title="Style">
            <div className="theme-grid">
              {THEMES.map(t => (
                <button key={t.id}
                  className={`theme-card ${themeId === t.id ? 'active' : ''}`}
                  onClick={() => setThemeId(t.id)}>
                  <div className="theme-swatch" style={{ background: t.swatch }}/>
                  <span className="theme-card-label">{t.label}</span>
                  {themeId === t.id && (
                    <div className="theme-check">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Stamp">
            <div className="stamp-grid">
              {STAMPS.map(s => (
                <button key={s.id}
                  className={`stamp-card ${stampId === s.id ? 'active' : ''}`}
                  onClick={() => setStampId(s.id)}>
                  <StampSVG id={s.id} color={stampId === s.id ? theme.stampColor : '#aaa'} size={36}/>
                  <span className="stamp-card-label">{s.label}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Photo">
            <div className="photo-upload-area" onClick={() => fileRef.current.click()}>
              {photo
                ? <img src={photo} alt="uploaded" className="photo-preview"/>
                : (
                  <div className="photo-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>Click to upload photo</span>
                    <span className="photo-sub">JPG, PNG, WEBP</span>
                  </div>
                )}
            </div>
            {photo && <button className="sp-text-btn" onClick={() => { setPhoto(null); fileRef.current.value = '' }}>Remove photo</button>}
            <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} style={{ display:'none' }}/>
          </Section>

          <Section title="Text">
            <div className="sp-label">Location</div>
            <input className="sp-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Paris, France"/>
            <div className="sp-label">Tagline</div>
            <input className="sp-input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Greetings from afar"/>
            <div className="sp-label">Message</div>
            <textarea className="sp-input sp-textarea" value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write something heartfelt..." rows={5}/>
          </Section>

        </div>
      </aside>
    </div>
  )
}
