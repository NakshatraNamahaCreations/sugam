/* Ambient bed for the site.
 *
 * Two backends behind one interface:
 *   - a file, when AMBIENCE_FILE in data/site.js points at a real track
 *   - otherwise a generative Web Audio patch, synthesised in the browser
 *
 * The patch is built out of the subject matter. Under a musical bed sit
 * synthesised plant textures — the press stamping, the plasma torch, the
 * zinc bath sizzling, a train crossing the finished structure — scheduled
 * against whichever chapter the reader is in. Manufacturing stamps, the
 * galvanizing section boils, the project chapter has trains passing.
 *
 * Voices are never restarted between chapters: harmony, filter, delay,
 * tempo and every bus level glide over 2.6 s, so it stays one continuous
 * piece rather than a playlist.
 *
 * Audio never starts on its own. start() is only ever called from a user
 * gesture, and resolves false if the context could not actually be brought
 * up, so the button never shows "on" over silence.
 *
 * Gain staging note: every voice sits in a register a laptop or phone
 * speaker can reproduce. Hanging the weight on a 55 Hz drone measures fine
 * and plays as nothing on small speakers.
 */

const SUB = 55; // support only — felt on real speakers, absent on small ones
const BASS = [110, 110.4]; // A2 and a detuned twin, this is what carries

const CROSSFADE = 2.6;
const MASTER = 0.55;
const FADE_IN = 1.8;
const FADE_OUT = 1.2;
const FILE_VOLUME = 0.4;

/* A tonal centre of A throughout, so the chapters are one piece. What moves
   is the mode, the register, the tempo, the space — and which of the plant
   textures are running.

   levels : bus gains, crossfaded on chapter change
   tex    : continuous textures (sizzle, plant hum)
   fx     : one-shot plant events, [minGap, maxGap] in ms */
const MOODS = {
  /* the default: open, no third in the melody, neither major nor minor */
  steel: {
    pad: [220, 277.18, 329.63],
    padType: 'sawtooth',
    padCut: 900,
    scale: [440, 493.88, 587.33, 659.25, 880],
    melodyType: 'triangle',
    decay: 2.8,
    noteGap: [2200, 4800],
    metalGap: [9000, 18000],
    delay: 0.44,
    feedback: 0.34,
    levels: { melody: 0.3, metal: 0.13, air: 0.035, pad: 0.17, fx: 0.12 },
    tex: { sizzle: 0, hum: 0.015 },
    fx: { plate: [14000, 26000] },
  },

  /* manufacturing: minor, tighter, and the line is running */
  plant: {
    pad: [220, 261.63, 329.63],
    padType: 'sawtooth',
    padCut: 1150,
    scale: [440, 523.25, 587.33, 659.25, 783.99],
    melodyType: 'square',
    decay: 1.8,
    noteGap: [1200, 2600],
    metalGap: [3500, 8000],
    delay: 0.28,
    feedback: 0.3,
    levels: { melody: 0.22, metal: 0.18, air: 0.03, pad: 0.13, fx: 0.26 },
    tex: { sizzle: 0, hum: 0.05 },
    fx: { press: [2400, 3400], torch: [7000, 13000] },
  },

  /* galvanizing: the warm section — major, slow, and the bath is boiling */
  furnace: {
    pad: [220, 277.18, 329.63],
    padType: 'triangle',
    padCut: 620,
    scale: [440, 554.37, 659.25, 739.99, 880],
    melodyType: 'sine',
    decay: 4.2,
    noteGap: [3500, 7000],
    metalGap: [14000, 24000],
    delay: 0.62,
    feedback: 0.42,
    levels: { melody: 0.28, metal: 0.07, air: 0.045, pad: 0.2, fx: 0.2 },
    tex: { sizzle: 0.055, hum: 0.025 },
    fx: { bubble: [700, 2200] },
  },

  /* site execution and galleries: suspended, wide, trains going over */
  site: {
    pad: [220, 293.66, 329.63],
    padType: 'sawtooth',
    padCut: 1000,
    scale: [440, 587.33, 659.25, 880, 1174.66],
    melodyType: 'triangle',
    decay: 3.4,
    noteGap: [3000, 6500],
    metalGap: [10000, 20000],
    delay: 0.66,
    feedback: 0.38,
    levels: { melody: 0.26, metal: 0.11, air: 0.06, pad: 0.16, fx: 0.22 },
    tex: { sizzle: 0, hum: 0 },
    fx: { train: [17000, 30000] },
  },

  /* company and enquiry: settle down, get out of the way of the form */
  close: {
    pad: [220, 261.63, 329.63],
    padType: 'triangle',
    padCut: 700,
    scale: [440, 523.25, 587.33, 659.25],
    melodyType: 'sine',
    decay: 3.6,
    noteGap: [4000, 8000],
    metalGap: [20000, 35000],
    delay: 0.5,
    feedback: 0.3,
    levels: { melody: 0.2, metal: 0.06, air: 0.03, pad: 0.14, fx: 0.05 },
    tex: { sizzle: 0, hum: 0 },
    fx: {},
  },
};

export const DEFAULT_MOOD = 'steel';

/* Keyed on the data-chapter values the sections carry. */
export const MOOD_BY_CHAPTER = {
  Hero: 'steel',
  Credentials: 'steel',
  Technology: 'steel',
  Comparison: 'steel',
  Types: 'steel',
  Manufacturing: 'plant',
  Galvanizing: 'furnace',
  Project: 'site',
  'Composite deck': 'steel',
  Applications: 'site',
  Specifications: 'steel',
  Gallery: 'site',
  Company: 'close',
  Enquire: 'close',
};

export function moodForChapter(chapter) {
  return MOOD_BY_CHAPTER[chapter] || DEFAULT_MOOD;
}

function makeNoiseBuffer(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buf;
}

function lfo(ctx, { rate, depth, target }) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = rate;
  const amount = ctx.createGain();
  amount.gain.value = depth;
  osc.connect(amount);
  amount.connect(target);
  osc.start();
  return osc;
}

function bus(ctx, gain, destination) {
  const g = ctx.createGain();
  g.gain.value = gain;
  g.connect(destination);
  return g;
}

function createGenerative() {
  let ctx = null;
  let master = null;
  let delay = null;
  let feedback = null;
  let padFilter = null;
  let padOscs = [];
  let buses = null;
  let noiseBuf = null;
  let sources = [];
  let timers = [];
  let fxTimers = [];
  let fxGen = 0;

  let moodName = DEFAULT_MOOD;
  let mood = MOODS[DEFAULT_MOOD];
  let melodyIndex = 2;

  const between = ([lo, hi]) => lo + Math.random() * (hi - lo);

  /* every automated change goes through here, so nothing ever jumps */
  function ramp(param, value, seconds) {
    const t = ctx.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + seconds);
  }

  function noiseSource() {
    const n = ctx.createBufferSource();
    n.buffer = noiseBuf;
    n.loop = true;
    return n;
  }

  /* short envelope helper: 0 -> peak -> 0 */
  function hit(at, attack, decay, peak = 1) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    return g;
  }

  /* ---- plant textures, one shots -------------------------------------- */

  /* the corrugation press coming down: a body thump plus the plate impact */
  function press(at) {
    const body = ctx.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(120, at);
    body.frequency.exponentialRampToValueAtTime(42, at + 0.18);
    const bodyEnv = hit(at, 0.006, 0.32, 0.9);
    body.connect(bodyEnv);
    bodyEnv.connect(buses.fx);
    body.start(at);
    body.stop(at + 0.4);

    const n = noiseSource();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, at);
    lp.frequency.exponentialRampToValueAtTime(320, at + 0.14);
    const nEnv = hit(at, 0.004, 0.17, 0.5);
    n.connect(lp);
    lp.connect(nEnv);
    nEnv.connect(buses.fx);
    n.start(at);
    n.stop(at + 0.3);

    /* the plate ringing after the strike */
    const ring = ctx.createOscillator();
    ring.type = 'triangle';
    ring.frequency.value = 494;
    const ringEnv = hit(at + 0.01, 0.008, 0.9, 0.18);
    ring.connect(ringEnv);
    ringEnv.connect(buses.fx);
    ringEnv.connect(delay);
    ring.start(at);
    ring.stop(at + 1);
  }

  /* plasma torch: a bandpassed rush that opens and closes */
  function torch(at) {
    const n = noiseSource();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.6;
    bp.frequency.setValueAtTime(2200, at);
    bp.frequency.linearRampToValueAtTime(3400, at + 0.7);
    bp.frequency.linearRampToValueAtTime(2000, at + 1.6);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(0.4, at + 0.22);
    env.gain.setValueAtTime(0.4, at + 1.1);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);

    n.connect(bp);
    bp.connect(env);
    env.connect(buses.fx);
    n.start(at);
    n.stop(at + 2);
  }

  /* zinc bath: a blip rising through the melt */
  function bubble(at) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    const f = 150 + Math.random() * 180;
    o.frequency.setValueAtTime(f, at);
    o.frequency.exponentialRampToValueAtTime(f * 2.6, at + 0.09);
    const env = hit(at, 0.006, 0.12, 0.5);
    o.connect(env);
    env.connect(buses.fx);
    o.start(at);
    o.stop(at + 0.2);
  }

  /* a galvanized plate set down on the stack */
  function plate(at) {
    const n = noiseSource();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3200;
    bp.Q.value = 0.8;
    const nEnv = hit(at, 0.003, 0.22, 0.35);
    n.connect(bp);
    bp.connect(nEnv);
    nEnv.connect(buses.fx);
    n.start(at);
    n.stop(at + 0.4);

    [587.33, 880, 1174.66].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * (1 + Math.random() * 0.01);
      const env = hit(at, 0.004, 1.6 - i * 0.35, 0.22 / (i + 1));
      o.connect(env);
      env.connect(buses.fx);
      env.connect(delay);
      o.start(at);
      o.stop(at + 1.8);
    });
  }

  /* a train crossing the finished structure: rumble swelling past, with
     rail joints going over underneath */
  function train(at) {
    const n = noiseSource();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 0.9;
    lp.frequency.setValueAtTime(160, at);
    lp.frequency.linearRampToValueAtTime(900, at + 3.4);
    lp.frequency.linearRampToValueAtTime(150, at + 8);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.linearRampToValueAtTime(0.75, at + 3.2);
    env.gain.linearRampToValueAtTime(0.0001, at + 8);

    n.connect(lp);
    lp.connect(env);
    env.connect(buses.fx);
    n.start(at);
    n.stop(at + 8.2);

    /* rail joints, closest in the middle of the pass */
    for (let i = 0; i < 14; i += 1) {
      const t = at + 1.4 + i * 0.42;
      const near = 1 - Math.abs(i - 7) / 8;
      const c = ctx.createOscillator();
      c.type = 'square';
      c.frequency.value = 120;
      const cEnv = hit(t, 0.003, 0.09, 0.14 * near);
      c.connect(cEnv);
      cEnv.connect(buses.fx);
      c.start(t);
      c.stop(t + 0.12);
    }
  }

  const FX = { press, torch, bubble, plate, train };

  /* Restart the one shot schedules for the current mood. The generation
     counter retires loops belonging to the chapter we just left. */
  function startFx() {
    fxGen += 1;
    const gen = fxGen;
    fxTimers.forEach(clearTimeout);
    fxTimers = [];

    Object.entries(mood.fx || {}).forEach(([key, gap]) => {
      if (!FX[key]) return;
      const run = () => {
        if (gen !== fxGen || !ctx) return;
        FX[key](ctx.currentTime + 0.05);
        fxTimers.push(setTimeout(run, between(gap)));
      };
      fxTimers.push(setTimeout(run, 500 + Math.random() * gap[0]));
    });
  }

  function applyMood(seconds) {
    if (!ctx) return;
    padOscs.forEach((osc, i) => {
      ramp(osc.frequency, mood.pad[i], seconds);
      osc.type = mood.padType;
    });
    ramp(padFilter.frequency, mood.padCut, seconds);
    ramp(delay.delayTime, mood.delay, seconds);
    ramp(feedback.gain, mood.feedback, seconds);
    Object.entries(mood.levels).forEach(([name, level]) => {
      if (buses[name]) ramp(buses[name].gain, level, seconds);
    });
    Object.entries(mood.tex).forEach(([name, level]) => {
      if (buses[name]) ramp(buses[name].gain, level, seconds);
    });
    melodyIndex = Math.min(melodyIndex, mood.scale.length - 1);
    startFx();
  }

  /* ---- musical voices --------------------------------------------------- */

  function pluck({ freq, at, decay, type, target }) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const detuned = ctx.createOscillator();
    detuned.type = type;
    detuned.frequency.value = freq * 1.003;

    const env = hit(at, 0.06, decay);
    osc.connect(env);
    detuned.connect(env);
    env.connect(target);
    env.connect(delay);

    osc.start(at);
    detuned.start(at);
    osc.stop(at + decay + 0.1);
    detuned.stop(at + decay + 0.1);
  }

  /* two operator FM, which is what gives the struck-metal edge */
  function strike(at) {
    const freq = mood.scale[Math.floor(Math.random() * mood.scale.length)] * 2;
    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = freq;

    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = freq * 2.74;
    const modDepth = ctx.createGain();
    modDepth.gain.setValueAtTime(freq * 1.8, at);
    modDepth.gain.exponentialRampToValueAtTime(freq * 0.02, at + 1.2);
    mod.connect(modDepth);
    modDepth.connect(carrier.frequency);

    const env = hit(at, 0.008, 3.2);
    carrier.connect(env);
    env.connect(buses.metal);
    env.connect(delay);

    carrier.start(at);
    mod.start(at);
    carrier.stop(at + 3.4);
    mod.stop(at + 3.4);
  }

  /* slow random walk, so it reads as a line rather than scattered notes */
  function melodyLoop() {
    const step = Math.random() < 0.5 ? -1 : 1;
    melodyIndex = Math.max(0, Math.min(mood.scale.length - 1, melodyIndex + step));
    pluck({
      freq: mood.scale[melodyIndex],
      at: ctx.currentTime + 0.05,
      decay: mood.decay,
      type: mood.melodyType,
      target: buses.melody,
    });
    timers.push(setTimeout(melodyLoop, between(mood.noteGap)));
  }

  function metalLoop() {
    strike(ctx.currentTime + 0.05);
    timers.push(setTimeout(metalLoop, between(mood.metalGap)));
  }

  return {
    get state() {
      return ctx ? ctx.state : 'closed';
    },

    get mood() {
      return moodName;
    },

    setMood(name) {
      const next = MOODS[name] ? name : DEFAULT_MOOD;
      if (next === moodName) return;
      moodName = next;
      mood = MOODS[next];
      applyMood(CROSSFADE);
    },

    /* resolves true only if sound is actually running */
    async start() {
      if (ctx) return ctx.state === 'running';

      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      ctx = new Ctx();
      noiseBuf = makeNoiseBuffer(ctx);

      master = ctx.createGain();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ctx.destination);

      /* an exponential ramp needs a scheduled starting point, otherwise its
         origin is the timeline start rather than now */
      const t0 = ctx.currentTime;
      master.gain.cancelScheduledValues(t0);
      master.gain.setValueAtTime(0.0001, t0);
      master.gain.exponentialRampToValueAtTime(MASTER, t0 + FADE_IN);

      delay = ctx.createDelay(1);
      delay.delayTime.value = mood.delay;
      feedback = ctx.createGain();
      feedback.gain.value = mood.feedback;
      const echoLevel = ctx.createGain();
      echoLevel.gain.value = 0.4;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(echoLevel);
      echoLevel.connect(master);

      buses = {
        sub: bus(ctx, 0.16, master),
        bass: bus(ctx, 0.2, master),
        pad: bus(ctx, mood.levels.pad, master),
        air: bus(ctx, mood.levels.air, master),
        melody: bus(ctx, mood.levels.melody, master),
        metal: bus(ctx, mood.levels.metal, master),
        fx: bus(ctx, mood.levels.fx, master),
        sizzle: bus(ctx, mood.tex.sizzle, master),
        hum: bus(ctx, mood.tex.hum, master),
      };

      /* sub — support for speakers that can render it, silent elsewhere */
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.value = SUB;
      subOsc.connect(buses.sub);
      subOsc.start();
      sources.push(subOsc);

      /* bass — the weight the mix actually rests on */
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 620;
      bassFilter.connect(buses.bass);
      BASS.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.5;
        osc.connect(g);
        g.connect(bassFilter);
        osc.start();
        sources.push(osc);
      });

      /* pad — the voice that carries the chapter change */
      padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = mood.padCut;
      padFilter.Q.value = 2.5;
      padFilter.connect(buses.pad);
      padOscs = mood.pad.map((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = mood.padType;
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.3;
        osc.connect(g);
        g.connect(padFilter);
        osc.start();
        sources.push(osc);
        sources.push(lfo(ctx, { rate: 0.03 + i * 0.011, depth: 0.16, target: g.gain }));
        return osc;
      });
      sources.push(lfo(ctx, { rate: 0.015, depth: 480, target: padFilter.frequency }));

      /* air */
      const air = noiseSource();
      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.value = 1100;
      airFilter.Q.value = 1.4;
      air.connect(airFilter);
      airFilter.connect(buses.air);
      air.start();
      sources.push(air);
      sources.push(lfo(ctx, { rate: 0.021, depth: 560, target: airFilter.frequency }));

      /* molten zinc, running only in the galvanizing chapter */
      const sizzle = noiseSource();
      const sizzleFilter = ctx.createBiquadFilter();
      sizzleFilter.type = 'highpass';
      sizzleFilter.frequency.value = 3600;
      sizzle.connect(sizzleFilter);
      sizzleFilter.connect(buses.sizzle);
      sizzle.start();
      sources.push(sizzle);
      sources.push(lfo(ctx, { rate: 0.35, depth: 900, target: sizzleFilter.frequency }));

      /* plant hum: mains and its harmonics, loudest on the shop floor */
      const humFilter = ctx.createBiquadFilter();
      humFilter.type = 'lowpass';
      humFilter.frequency.value = 400;
      humFilter.connect(buses.hum);
      [50, 100, 150].forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'sawtooth';
        osc.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.6 : 0.22 / i;
        osc.connect(g);
        g.connect(humFilter);
        osc.start();
        sources.push(osc);
      });

      /* Chrome hands back a suspended context more often than not, even
         inside a click. Without this the graph plays to nobody. */
      try {
        await ctx.resume();
      } catch {
        /* fall through to the state check */
      }
      if (ctx.state !== 'running') return false;

      /* first note lands straight away, so the toggle is audibly doing something */
      pluck({
        freq: mood.scale[melodyIndex],
        at: ctx.currentTime + 0.15,
        decay: mood.decay,
        type: mood.melodyType,
        target: buses.melody,
      });
      timers.push(setTimeout(melodyLoop, between(mood.noteGap)));
      timers.push(setTimeout(metalLoop, 4000));
      startFx();
      return true;
    },

    stop() {
      if (!ctx) return;
      fxGen += 1;
      timers.concat(fxTimers).forEach(clearTimeout);
      timers = [];
      fxTimers = [];

      const dying = ctx;
      const end = dying.currentTime + FADE_OUT;
      master.gain.cancelScheduledValues(dying.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), dying.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, end);
      sources.forEach((n) => {
        try {
          n.stop(end + 0.05);
        } catch {
          /* already stopped */
        }
      });

      sources = [];
      padOscs = [];
      master = null;
      delay = null;
      feedback = null;
      padFilter = null;
      buses = null;
      noiseBuf = null;
      ctx = null;
      setTimeout(() => dying.close().catch(() => {}), (FADE_OUT + 0.3) * 1000);
    },

    suspend() {
      if (ctx && ctx.state === 'running') ctx.suspend();
    },

    resume() {
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
  };
}

function createFilePlayer(src) {
  let el = null;
  let fade = null;

  function rampTo(target, seconds, done) {
    clearInterval(fade);
    const steps = Math.max(1, Math.round(seconds * 30));
    const from = el.volume;
    let i = 0;
    fade = setInterval(() => {
      i += 1;
      el.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)));
      if (i >= steps) {
        clearInterval(fade);
        if (done) done();
      }
    }, 1000 / 30);
  }

  return {
    get state() {
      return el && !el.paused ? 'running' : 'suspended';
    },
    get mood() {
      return null;
    },
    setMood() {
      /* a supplied track plays as delivered; chapters are generative only */
    },
    async start() {
      if (!el) {
        el = new Audio(src);
        el.loop = true;
        el.preload = 'none';
      }
      el.volume = 0;
      try {
        await el.play();
      } catch {
        return false;
      }
      rampTo(FILE_VOLUME, FADE_IN);
      return true;
    },
    stop() {
      if (!el) return;
      rampTo(0, FADE_OUT, () => el.pause());
    },
    suspend() {
      if (el) el.pause();
    },
    resume() {
      if (el && el.volume > 0) el.play().catch(() => {});
    },
  };
}

export function createAmbience(src) {
  return src ? createFilePlayer(src) : createGenerative();
}
