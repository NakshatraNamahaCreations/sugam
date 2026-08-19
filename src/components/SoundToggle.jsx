'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createAmbience, moodForChapter } from '@/lib/ambience';
import { SOUND_EVENT, SOUND_OFF_EVENT } from '@/components/Intro';
import { useActiveChapter } from '@/hooks/useScrollFx';
import { AMBIENCE_FILE } from '@/data/site';

const STORAGE_KEY = 'sugam:sound';

export default function SoundToggle() {
  const engine = useRef(null);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const { label: chapter } = useActiveChapter();
  const mood = moodForChapter(chapter);
  /* held in a ref so enable() keeps stable identity as the reader scrolls */
  const moodRef = useRef(mood);
  moodRef.current = mood;

  const enable = useCallback(async () => {
    if (!engine.current) engine.current = createAmbience(AMBIENCE_FILE);
    /* only claim "on" if audio is genuinely running — a blocked or suspended
       context used to leave the button lit over silence */
    engine.current.setMood(moodRef.current);
    const started = await engine.current.start();
    if (!started) {
      engine.current.stop();
      setFailed(true);
      return;
    }
    setFailed(false);
    setOn(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'on');
    } catch {
      /* private mode */
    }
  }, []);

  const disable = useCallback(() => {
    engine.current?.stop();
    setOn(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'off');
    } catch {
      /* private mode */
    }
  }, []);

  /* A returning listener who left sound on gets it back — but still only
     after they touch the page, because playback needs a user gesture. */
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    if (stored !== 'on') return undefined;

    const wake = () => {
      enable();
      teardown();
    };
    const teardown = () => {
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
    window.addEventListener('pointerdown', wake, { once: true });
    window.addEventListener('keydown', wake, { once: true });
    return teardown;
  }, [enable]);

  /* The intro's START click asks for sound. Handling it here keeps one
     engine, and the event is dispatched inside that click so the gesture
     still counts for autoplay. */
  useEffect(() => {
    const wake = () => enable();
    const hush = () => disable();
    window.addEventListener(SOUND_EVENT, wake);
    window.addEventListener(SOUND_OFF_EVENT, hush);
    return () => {
      window.removeEventListener(SOUND_EVENT, wake);
      window.removeEventListener(SOUND_OFF_EVENT, hush);
    };
  }, [enable, disable]);

  /* Follow the reader: each chapter crossfades to its own mood. */
  useEffect(() => {
    if (on) engine.current?.setMood(mood);
  }, [on, mood]);

  /* Do not keep playing into a tab nobody is looking at. */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) engine.current?.suspend();
      else if (on) engine.current?.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [on]);

  useEffect(() => () => engine.current?.stop(), []);

  return (
    <button
      className={['sound', on && 'on'].filter(Boolean).join(' ')}
      onClick={() => (on ? disable() : enable())}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      title={failed ? 'Your browser blocked audio playback' : on ? 'Sound on' : 'Sound off'}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 9.5h3.6L12 6v12l-4.4-3.5H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M15.4 9.2a4 4 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path className="wave" d="M17.9 6.8a7.5 7.5 0 0 1 0 10.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        ) : (
          <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
