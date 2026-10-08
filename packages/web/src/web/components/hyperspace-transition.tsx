import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

const trails = Array.from({ length: 100 }, (_, i) => ({
  angle: i * 137.508 % 360,
  delay: (i % 13) * 0.027,
  length: 80 + (i * 43 % 180),
  offset: 20 + (i * 17 % 180),
  width: i % 5 === 0 ? 2 : 1,
}));

export default function HyperspaceTransition({ number, title, image }: { number: number; title: string; image: string }) {
  return <motion.div className="hyperspace" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 2.8, times: [0, .12, .7, 1] }}>
    <div className="warp-nebula"/>
    <div className="warp-destination"><img src={`/images/${image}.webp`} alt=""/></div>
    <div className="warp-core"/>
    <div className="warp-trails">{trails.map((t, i) => <div className="warp-ray" key={i} style={{ '--angle': `${t.angle}deg`, '--delay': `${t.delay}s`, '--length': `${t.length}px`, '--offset': `${t.offset}px`, '--width': `${t.width}px` } as CSSProperties}><i/></div>)}</div>
    <div className="warp-rings">{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ animationDelay: `${i * .19}s` }}/>)}</div>
    <div className="warp-flare"/>
    <div className="warp-title"><span>SALT ÎN HIPERSPAȚIU / {String(number).padStart(2, '0')}</span><strong>{title}</strong><i/></div>
    <div className="warp-vignette"/>
  </motion.div>;
}