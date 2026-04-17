import '../src/index.css'
import '../src/App.css'
import '../src/components/styles/About.css'
import '../src/components/styles/Career.css'
import '../src/components/styles/Contact.css'
import '../src/components/styles/Cursor.css'
import '../src/components/styles/Landing.css'
import '../src/components/styles/Loading.css'
import '../src/components/styles/Navbar.css'
import '../src/components/styles/SocialIcons.css'
import '../src/components/styles/style.css'
import '../src/components/styles/WhatIDo.css'
import '../src/components/styles/Work.css'
import '../src/components/styles/SkillConstellation.css'
import '../src/components/styles/GlobalBackground.css'
import '../src/components/styles/QuoteSection.css'
import '../src/components/styles/ScrollProgressBar.css'
import '../src/components/styles/SkillMatrix.css'
import '../src/components/styles/Certifications.css'
import '../src/components/styles/TechBlog.css'
import '../src/components/styles/GitHubContributions.css'
import { useEffect, useState } from 'react';
import gsap from 'gsap';

const ErrorOverlay = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const onError = (message, source, lineno, colno, err) => {
      setError({ message: err?.message || message, stack: err?.stack || `${source}:${lineno}:${colno}` });
      return false;
    };
    const onRejection = (ev) => {
      const reason = ev?.reason || ev;
      setError({ message: reason?.message || String(reason), stack: reason?.stack || '' });
    };

    window.addEventListener('error', (e) => onError(e.message, e.filename, e.lineno, e.colno, e.error));
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', (e) => onError(e.message, e.filename, e.lineno, e.colno, e.error));
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',color:'#fff',zIndex:99999,padding:20,fontFamily:'monospace',overflow:'auto'}}>
      <h2 style={{marginTop:0}}>Runtime Error (debug overlay)</h2>
      <div style={{whiteSpace:'pre-wrap'}}>{error.message}</div>
      {error.stack && <pre style={{marginTop:12,color:'#ddd'}}>{error.stack}</pre>}
      <div style={{marginTop:12}}>
        This overlay is temporary — remove after debugging.
      </div>
    </div>
  );
};

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    try {
      gsap.config({ nullTargetWarn: false });
    } catch (e) {
      // ignore if gsap not available on server
    }
  }, []);
  return (
    <>
      <Component {...pageProps} />
      <ErrorOverlay />
    </>
  );
}
