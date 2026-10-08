import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

export const transitionNames = ['Întoarcere pe Pământ', 'Desprindere de orbită', 'Zbor printre planete', 'Eclipsă lunară', 'Furtună marțiană', 'Deschiderea sasului', 'Survol orbital', 'Ascensiunea rachetei', 'Deschiderea oglinzii Webb', 'Nașterea unei nebuloase'];
const effects = ['return', 'orbit', 'planets', 'eclipse', 'dust', 'airlock', 'station', 'rocket', 'mirror', 'bloom'];
const planets = ['#af9b85', '#dcaf72', '#6da4c8', '#a4593a', '#c5a37e', '#c8b58c', '#93c2c6', '#456bb4'];

export default function ChapterTransition({ number, title, image }: { number: number; title: string; image: string }) {
  const index = number - 1;
  const effect = effects[index];
  return <motion.div className={`cinematic-transition fx-${effect}`} data-effect={effect} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 7, times: [0, .12, .78, 1] }}>
    <div className="fx-stars">{Array.from({ length: 65 }, (_, i) => <i key={i} style={{ left: `${i * 37.73 % 100}%`, top: `${i * 19.71 % 100}%` }}/>)}</div>
    {effect === 'return' && <div className="fx-return-earth"><img src="/images/earth.webp" alt=""/><div/></div>}
    {effect === 'orbit' && <><div className="fx-orbit-earth"><img src="/images/earth.webp" alt=""/></div><div className="fx-orbit-path"><i/></div><div className="fx-orbit-horizon"/></>}
    {effect === 'planets' && <div className="fx-solar"><div className="fx-sun"/>{planets.map((color, i) => <div className={`fx-planet planet-${i}`} key={i} style={{ '--planet-color': color, '--i': i } as CSSProperties}><i/>{i === 5 && <b/>}</div>)}</div>}
    {effect === 'eclipse' && <div className="fx-eclipse"><div className="fx-lunar-glow"/><div className="fx-lunar-disc"/><div className="fx-lunar-shadow"/><div className="fx-corona"/></div>}
    {effect === 'dust' && <><img className="fx-mars-ground" src="/images/mars.webp" alt=""/><div className="fx-dust-clouds">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties}/>)}</div><div className="fx-dust-particles">{Array.from({ length: 70 }, (_, i) => <i key={i} style={{ left: `${i * 17.3 % 100}%`, top: `${i * 29.7 % 100}%`, animationDelay: `${i % 10 * .13}s` }}/>)}</div></>}
    {effect === 'airlock' && <><img className="fx-airlock-view" src="/images/crew.webp" alt=""/><div className="fx-airlock-door door-left"><i/><b/></div><div className="fx-airlock-door door-right"><i/><b/></div><div className="fx-airlock-frame"/></>}
    {effect === 'station' && <><img className="fx-station-earth" src="/images/earth.webp" alt=""/><img className="fx-station-photo" src="/images/iss.webp" alt=""/><div className="fx-tracking-reticle"><i/><span>URMĂRIRE ORBITALĂ · ISS</span></div></>}
    {effect === 'rocket' && <><div className="fx-rocket-clouds"/><div className="fx-rocket-vehicle"><div className="fx-rocket-body"><i/><b/></div><div className="fx-rocket-fire"/></div><div className="fx-launch-count"><span>3</span><span>2</span><span>1</span><span>LANSARE</span></div></>}
    {effect === 'mirror' && <><div className="fx-webb-mirror">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties}/>)}</div><img className="fx-webb-universe" src="/images/nebula.webp" alt=""/><div className="fx-webb-scan"/></>}
    {effect === 'bloom' && <><img className="fx-bloom-nebula" src="/images/nebula.webp" alt=""/><div className="fx-bloom-cloud cloud-one"/><div className="fx-bloom-cloud cloud-two"/><div className="fx-bloom-cloud cloud-three"/><div className="fx-bloom-star"/></>}
    <div className="fx-shade"/>
    <div className="fx-caption"><span>{transitionNames[index].toLocaleUpperCase('ro')}</span><strong>{title}</strong><div className="fx-timing"><i/></div><small>CAPITOLUL {String(number).padStart(2, '0')} · TRANZIȚIE CINEMATICĂ · 7 SECUNDE</small></div>
    <img className="fx-destination" src={`/images/${image}.webp`} alt=""/>
  </motion.div>;
}