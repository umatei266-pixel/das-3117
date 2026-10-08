import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Expand, Grid2X2, Minimize, Pause, Play, X } from 'lucide-react';
import { chapters } from '../lib/chapters';
import ChapterTransition, { transitionNames } from './chapter-transition';

const duration = 45000;
const pad = (n: number) => String(n).padStart(2, '0');
const stars = Array.from({ length: 85 }, (_, i) => ({ x: (i * 37.71) % 100, y: (i * 19.33) % 100, size: i % 7 === 0 ? 2 : 1, delay: (i % 9) / 2 }));

export default function SpacePresentation() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState(1);
  const [overlay, setOverlay] = useState<'text' | 'chapters' | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const progressRef = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef(0);
  const reduced = useReducedMotion();
  const chapter = chapters[current];
  const advance = (direction: number) => {
    setDirection(direction);
    setCurrent(n => Math.max(0, Math.min(chapters.length - 1, n + direction)));
    setProgress(0); progressRef.current = 0;
  };

  useEffect(() => {
    if (!playing || overlay) return;
    const start = performance.now() - progressRef.current * duration;
    const interval = window.setInterval(() => {
      const value = (performance.now() - start) / duration;
      if (value >= 1) {
        if (current === chapters.length - 1) setPlaying(false);
        else setCurrent(n => n + 1);
        setProgress(0); progressRef.current = 0;
      } else { setProgress(value); progressRef.current = value; }
    }, 80);
    return () => clearInterval(interval);
  }, [playing, current, overlay]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOverlay(null); return; }
      if (overlay) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
      if (event.code === 'Space') { event.preventDefault(); setPlaying(p => !p); }
      if (event.key.toLowerCase() === 'f') void toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay]);

  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);

  useEffect(() => {
    chapters.forEach(c => { const image = new Image(); image.src = `/images/${c.image}.webp`; });
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
    } catch { setNotice('Ecranul complet nu este disponibil în acest browser.'); }
  }

  return (
    <div className={`presentation ${fullscreen ? 'is-fullscreen' : ''}`} ref={root}>
      <header className="masthead">
        <button className="brand" onClick={() => { setCurrent(0); setProgress(0); progressRef.current = 0; }} aria-label="Prima scenă">
          <span className="brand-symbol"><Compass size={24} strokeWidth={1.1}/></span>
          <span>SĂPTĂMÂNA <b>SPAȚIULUI</b></span>
        </button>
        <div className="edition"><span className="status-dot"/> O EXPEDIȚIE ÎN 10 CAPITOLE</div>
        <button className="chapters-button" onClick={() => setOverlay('chapters')}><Grid2X2 size={15}/> <span>Capitole</span></button>
      </header>

      <main className="stage-wrap">
        <div className="stage" onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { const delta = touch.current - e.changedTouches[0].clientX; if (Math.abs(delta) > 50) advance(delta > 0 ? 1 : -1); }}>
          <div className="star-field" aria-hidden="true">{stars.map((star, i) => <i key={i} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}/>)}</div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div className={`scene scene-${chapter.style} text-on-slide`} key={current} custom={direction} variants={{ enter: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reduced ? .15 : 1 } }, leave: { opacity: 0, transition: { duration: reduced ? .15 : .5 } } }} initial="enter" animate="visible" exit="leave">
              <div className="image-wrap"><img className="scene-image" src={`/images/${chapter.image}.webp`} alt={chapter.credit} /></div>
              {(chapter.style === 'planet' || chapter.style === 'finale') && <div className="orbit" aria-hidden="true"><span/></div>}
              {chapter.style === 'finale' && <img className="final-earth" src="/images/earth.webp" alt="Pământul"/>}
              <div className="scene-shade"/>
              <div className="scene-topline"><span>EXPLORĂM NECUNOSCUTUL</span><span>{pad(current + 1)} <i>/</i> {pad(chapters.length)}</span></div>
              <div className="scene-copy">
                <motion.div className="chapter-label" initial={{opacity:0, y: 12}} animate={{opacity:1, y:0}} transition={{delay:0.25, duration:0.7}}><span/> {chapter.label}</motion.div>
                <h1>{chapter.title.split('\n').map((line, i) => <motion.span key={line} initial={{opacity:0, y:reduced ? 0 : 28}} animate={{opacity:1, y:0}} transition={{delay:0.4 + i * 0.12, duration:0.85}}>{line}</motion.span>)}</h1>
                <div className="slide-paragraphs">{chapter.paragraphs.map((paragraph, i) => <motion.p key={i} initial={{opacity: 0, y: reduced ? 0 : 15}} animate={{opacity: 1, y: 0}} transition={{delay: reduced ? 0 : 0.35 + i * 0.12, duration: 0.6}}>{paragraph}</motion.p>)}</div>
                <motion.div className="scene-fact" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1, duration:1}}>{chapter.fact}</motion.div>
                {current === 0 && <motion.button className="explore-button" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}} onClick={() => advance(1)}>Începe explorarea <ArrowRight size={17}/></motion.button>}
                {current === 9 && <motion.button className="explore-button" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}} onClick={() => { setCurrent(0); setProgress(0); progressRef.current = 0; setPlaying(false); }}>Reia călătoria <ArrowRight size={17}/></motion.button>}
              </div>
              {chapter.style === 'planet' && <motion.div className="planet-tag" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}><span className="tag-line"/><span>PĂMÂNTUL<br/><small>LOCUL DIN CARE ÎNCEPE TOTUL</small></span></motion.div>}
              {chapter.style === 'launch' && <div className="countdown" aria-label="Numărătoare inversă"><span>3</span><span>2</span><span>1</span><span>LANSARE</span></div>}
              {chapter.style === 'nebula' && <img className="webb-inset" src="/images/webb.webp" alt="Ilustrație NASA a telescopului James Webb"/>}
              <div className="scene-footer"><span>{current === 0 ? 'PLANETA NOASTRĂ. ÎNCEPUTUL CĂLĂTORIEI.' : chapter.short.toLocaleUpperCase('ro')}</span><span className="image-credit">IMAGINI: {chapter.credit.startsWith('NASA,') ? 'NASA / ESA / CSA' : chapter.credit.startsWith('NASA/JPL') ? 'NASA / JPL' : 'NASA'}</span></div>
            </motion.div>
          </AnimatePresence>
          {!reduced && <ChapterTransition key={`cinema-${current}`} number={current + 1} title={chapter.short} image={chapter.image}/>}
          <div className="stage-corner top-left"/><div className="stage-corner bottom-right"/>
        </div>
      </main>

      <section className="player" aria-label="Comenzi de prezentare">
        <div className="progress-rail">{chapters.map((c, i) => <button key={c.short} aria-label={`Capitolul ${i + 1}: ${c.short}`} aria-current={i === current ? 'step' : undefined} className={i <= current ? 'visited' : ''} onClick={() => {setCurrent(i); setProgress(0); progressRef.current = 0;}}><span style={{width: i < current ? '100%' : i === current ? `${playing ? Math.max(4,progress*100) : 100}%` : '0%'}}/></button>)}</div>
        <div className="player-row">
          <div className="play-group"><button className="play-button" aria-label={playing ? 'Pauză' : 'Redare automată'} title="Redare automată / pauză (Spațiu)" onClick={() => setPlaying(p => !p)}>{playing ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}</button><div className="now-playing"><span>CAPITOLUL {pad(current+1)}</span><strong>{chapter.short}</strong><small className="transition-description">{transitionNames[current]} · 7 s</small></div></div>
          <div className="navigation"><button className="icon-button" aria-label="Capitolul anterior" disabled={current===0} onClick={() => advance(-1)}><ArrowLeft size={19}/></button><span>{pad(current+1)} <i>/</i> {pad(chapters.length)}</span><button className="icon-button" aria-label="Capitolul următor" disabled={current===9} onClick={() => advance(1)}><ArrowRight size={19}/></button></div>
          <div className="tools"><button className="text-button" onClick={() => setOverlay('text')}><BookOpen size={16}/><span>Text complet</span></button><span className="tool-divider"/><button className="icon-button" aria-label={fullscreen ? 'Ieși din ecran complet' : 'Ecran complet'} title="Ecran complet (F)" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize size={18}/> : <Expand size={18}/>}</button></div>
        </div>
      </section>
      <footer className="page-footer"><span>CURIOZITATEA ESTE DOAR ÎNCEPUTUL.</span><span><kbd>←</kbd><kbd>→</kbd> Navighează <span className="footer-separator">/</span> <kbd>spațiu</kbd> Redare / pauză</span></footer>
      {notice && <output className="notice">{notice}<button aria-label="Închide mesajul" onClick={() => setNotice('')}><X size={16}/></button></output>}

      <AnimatePresence>{overlay && <motion.div className="overlay-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setOverlay(null)}>
        <motion.dialog open aria-modal="true" aria-label={overlay==='text' ? 'Textul complet al capitolului' : 'Toate capitolele'} className={overlay==='text' ? 'text-drawer' : 'chapter-modal'} initial={{opacity:0, y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:24}} onClick={e => e.stopPropagation()}>
          <div className="modal-heading"><span>{overlay==='text' ? `CAPITOLUL ${pad(current+1)} / TEXT COMPLET` : 'EXPEDIȚIA / 10 CAPITOLE'}</span><button className="icon-button" aria-label="Închide" onClick={() => setOverlay(null)}><X size={22}/></button></div>
          {overlay==='text' ? <><h2>{chapter.label}</h2><div className="full-text">{chapter.paragraphs.map((p,i) => <p key={i}>{p}</p>)}</div><div className="source-credit"><Check size={14}/><span>Traducere integrală în limba română, după materialul furnizat.</span></div><a className="source-link" href={chapter.source} target="_blank" rel="noreferrer">{chapter.credit} <ArrowRight size={14}/></a><div className="drawer-navigation"><button disabled={current===0} onClick={() => advance(-1)}><ArrowLeft size={16}/> Anterior</button><button disabled={current===9} onClick={() => advance(1)}>Următorul <ArrowRight size={16}/></button></div></> : <><h2>Alege următoarea destinație.</h2><div className="chapter-grid">{chapters.map((c,i) => <button className={current===i ? 'selected' : ''} key={i} onClick={() => { setCurrent(i); setProgress(0); progressRef.current = 0; setOverlay(null); }}><img src={`/images/${c.image}.webp`} alt=""/><span className="thumb-number">{pad(i+1)}</span><span className="thumb-title">{c.short}</span>{i===current && <span className="thumb-current">ACUM</span>}</button>)}</div></>}
        </motion.dialog>
      </motion.div>}</AnimatePresence>
    </div>
  );
}