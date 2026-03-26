import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Magnetometer, Accelerometer, Pedometer } from 'expo-sensors';

// ─── Brand Colors ─────────────────────────────────────────────────
const C = {
  dark:    '#45b97c',
  mid:     '#b1d249',
  light:   '#d5e05b',
  black:   '#0f1a13',
  surface: '#1a2a1e',
  border:  '#2a3f2e',
  muted:   '#6b8f72',
  white:   '#f4f9f5',
  warn:    '#e8a020',
  danger:  '#e05050',
};

// ─── Translations ─────────────────────────────────────────────────
const T = {
  en: {
    appTitle:         'Campus Navigator',
    appSubtitle:      'Indoor AR Navigation',
    compassReady:     'Compass ready',
    connectingSensor: 'Connecting sensors',
    startNav:         'Start Navigation',
    selectClass:      'Select Classroom',
    selectWhere:      'Where do you need to go?',
    startEntrance:    'Start: Building entrance',
    back:             'Back',
    quit:             'Quit navigation',
    warmingUp:        'Warming up compass...',
    standStill:       'Stand still — escalator rising',
    escalatorShake:   'Movement detected — speeding up',
    onTrack:          'On track',
    faceRight:        'Face the correct direction',
    slightRight:      'Slight right',
    slightLeft:       'Slight left',
    turnRight:        'Turn right',
    turnLeft:         'Turn left',
    turnAround:       'Turn around',
    nextStep:         'Next Step',
    done:             'Done',
    arrived:          'You have arrived',
    arrivedAt:        'You are at',
    goTo:             'Go to',
    returnTo:         'Return to',
    fromHere:         'Starting from here',
    backHome:         'Back to home',
    stepOf:           'Step',
    of:               'of',
    steps:            'steps',
    navigatingTo:     'Navigating to',
  },
  nl: {
    appTitle:         'Campus Navigator',
    appSubtitle:      'Indoor AR Navigatie',
    compassReady:     'Kompas gereed',
    connectingSensor: 'Sensoren verbinden',
    startNav:         'Start Navigatie',
    selectClass:      'Selecteer Lokaal',
    selectWhere:      'Waar moet je zijn?',
    startEntrance:    'Start: Hoofdingang',
    back:             'Terug',
    quit:             'Navigatie stoppen',
    warmingUp:        'Kompas opwarmen...',
    standStill:       'Stilstaan — roltrap omhoog',
    escalatorShake:   'Beweging — versnellen',
    onTrack:          'Goede richting',
    faceRight:        'Draai naar de juiste richting',
    slightRight:      'Iets rechts',
    slightLeft:       'Iets links',
    turnRight:        'Rechts afslaan',
    turnLeft:         'Links afslaan',
    turnAround:       'Omkeren',
    nextStep:         'Volgende stap',
    done:             'Klaar',
    arrived:          'U bent aangekomen',
    arrivedAt:        'U bevindt zich bij',
    goTo:             'Ga naar',
    returnTo:         'Terug naar',
    fromHere:         'Vertrek vanaf hier',
    backHome:         'Terug naar start',
    stepOf:           'Stap',
    of:               'van',
    steps:            'stappen',
    navigatingTo:     'Navigeren naar',
  },
};

type Lang   = 'en' | 'nl';
type Screen = 'home' | 'select' | 'ar' | 'arrived';

type RouteStep = {
  instruction: { en: string; nl: string };
  distance:    string;
  direction:   number;
  steps:       number;
  tolerance:   number;
  escalator?:  boolean;
  manualOnly?: boolean;
};

// ─── Routes ──────────────────────────────────────────────────────
const ROUTES: Record<string, RouteStep[]> = {

  // ── Entrance → AC1.70 ────────────────────────────────────────
  'AC1.70': [
    { instruction: { en: 'Walk to the escalator',      nl: 'Loop naar de roltrap'         }, distance: '~4 steps',   direction: 262, steps: 4,  tolerance: 25 },
    { instruction: { en: 'Ride the escalator up',      nl: 'Roltrap omhoog'               }, distance: 'Stand still', direction: 262, steps: 0,  tolerance: 360, escalator: true },
    { instruction: { en: 'Walk straight',              nl: 'Loop rechtdoor'               }, distance: '~3 steps',   direction: 263, steps: 3,  tolerance: 25 },
    { instruction: { en: 'Turn left',                  nl: 'Sla links af'                 }, distance: '~5 steps',   direction: 177, steps: 5,  tolerance: 25 },
    { instruction: { en: 'Turn left to AC1.70',        nl: 'Links af naar AC1.70'         }, distance: '~6 steps',   direction: 93,  steps: 6,  tolerance: 25 },
    { instruction: { en: 'You have arrived at AC1.70', nl: 'U bent aangekomen bij AC1.70' }, distance: '',           direction: 93,  steps: 0,  tolerance: 360, manualOnly: true },
  ],

  // ── Entrance → AC1.30 ────────────────────────────────────────
  'AC1.30': [
    { instruction: { en: 'Walk to the escalator',      nl: 'Loop naar de roltrap'         }, distance: '~4 steps',   direction: 262, steps: 4,  tolerance: 25 },
    { instruction: { en: 'Ride the escalator up',      nl: 'Roltrap omhoog'               }, distance: 'Stand still', direction: 262, steps: 0,  tolerance: 360, escalator: true },
    { instruction: { en: 'Walk straight',              nl: 'Loop rechtdoor'               }, distance: '~3 steps',   direction: 263, steps: 3,  tolerance: 25 },
    { instruction: { en: 'Turn right, walk straight',  nl: 'Rechts af, rechtdoor lopen'   }, distance: '~4 steps',   direction: 347, steps: 4,  tolerance: 25 },
    { instruction: { en: 'Turn left, walk straight',   nl: 'Links af, rechtdoor lopen'    }, distance: '~43 steps',  direction: 260, steps: 43, tolerance: 25 },
    { instruction: { en: 'Turn right to AC1.30',       nl: 'Rechts af naar AC1.30'        }, distance: '~4 steps',   direction: 350, steps: 4,  tolerance: 25 },
    { instruction: { en: 'You have arrived at AC1.30', nl: 'U bent aangekomen bij AC1.30' }, distance: '',           direction: 350, steps: 0,  tolerance: 360, manualOnly: true },
  ],

  // ── AC1.70 → AC1.30 ──────────────────────────────────────────
  'AC1.70-to-AC1.30': [
    { instruction: { en: 'Turn right, walk straight',  nl: 'Rechts af, rechtdoor lopen'   }, distance: '~10 steps',  direction: 270, steps: 10, tolerance: 25 },
    { instruction: { en: 'Turn right, walk straight',  nl: 'Rechts af, rechtdoor lopen'   }, distance: '~9 steps',   direction: 347, steps: 9,  tolerance: 25 },
    { instruction: { en: 'Turn left, walk straight',   nl: 'Links af, rechtdoor lopen'    }, distance: '~43 steps',  direction: 247, steps: 43, tolerance: 25 },
    { instruction: { en: 'Turn right to AC1.30',       nl: 'Rechts af naar AC1.30'        }, distance: '~4 steps',   direction: 350, steps: 4,  tolerance: 25 },
    { instruction: { en: 'You have arrived at AC1.30', nl: 'U bent aangekomen bij AC1.30' }, distance: '',           direction: 350, steps: 0,  tolerance: 360, manualOnly: true },
  ],

  // ── AC1.30 → AC1.70 ──────────────────────────────────────────
  'AC1.30-to-AC1.70': [
    { instruction: { en: 'Walk straight',              nl: 'Loop rechtdoor'               }, distance: '~4 steps',   direction: 170, steps: 4,  tolerance: 25 },
    { instruction: { en: 'Turn left, walk straight',   nl: 'Links af, rechtdoor lopen'    }, distance: '~43 steps',  direction: 90,  steps: 43, tolerance: 25 },
    { instruction: { en: 'Turn right, walk straight',  nl: 'Rechts af, rechtdoor lopen'   }, distance: '~9 steps',   direction: 165, steps: 9,  tolerance: 25 },
    { instruction: { en: 'Turn left, walk straight',   nl: 'Links af, rechtdoor lopen'    }, distance: '~7 steps',   direction: 90,  steps: 7,  tolerance: 25 },
    { instruction: { en: 'You have arrived at AC1.70', nl: 'U bent aangekomen bij AC1.70' }, distance: '',           direction: 90,  steps: 0,  tolerance: 360, manualOnly: true },
  ],
};

// What to show on the arrived screen per route
const ARRIVED_OPTIONS: Record<string, { room: string; nextRoute: string; isReturn: boolean }> = {
  'AC1.70':           { room: 'AC1.70', nextRoute: 'AC1.70-to-AC1.30', isReturn: false },
  'AC1.30':           { room: 'AC1.30', nextRoute: 'AC1.30-to-AC1.70', isReturn: true  },
  'AC1.70-to-AC1.30': { room: 'AC1.30', nextRoute: 'AC1.30-to-AC1.70', isReturn: true  },
  'AC1.30-to-AC1.70': { room: 'AC1.70', nextRoute: 'AC1.70-to-AC1.30', isReturn: false },
};

// Friendly display name per route key (for top bar label)
const ROUTE_DISPLAY: Record<string, { en: string; nl: string }> = {
  'AC1.70':           { en: 'AC1.70', nl: 'AC1.70' },
  'AC1.30':           { en: 'AC1.30', nl: 'AC1.30' },
  'AC1.70-to-AC1.30': { en: 'AC1.30', nl: 'AC1.30' },
  'AC1.30-to-AC1.70': { en: 'AC1.70', nl: 'AC1.70' },
};

// ─── Maths ───────────────────────────────────────────────────────
const circularAverage = (angles: number[]): number => {
  const sin = angles.reduce((s, a) => s + Math.sin((a * Math.PI) / 180), 0);
  const cos = angles.reduce((s, a) => s + Math.cos((a * Math.PI) / 180), 0);
  let avg = Math.atan2(sin / angles.length, cos / angles.length) * (180 / Math.PI);
  if (avg < 0) avg += 360;
  return avg;
};

const angleDiff = (target: number, current: number): number => {
  let d = target - current;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
};

const tiltCompensatedHeading = (
  mag: { x: number; y: number; z: number },
  acc: { x: number; y: number; z: number }
): number => {
  const norm = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
  if (norm === 0) return 0;
  const ax = acc.x / norm, ay = acc.y / norm, az = acc.z / norm;
  const pitch = Math.asin(-ax);
  const roll  = Math.atan2(ay, az);
  const mx2   =  mag.x * Math.cos(pitch) + mag.z * Math.sin(pitch);
  const my2   =  mag.x * Math.sin(roll) * Math.sin(pitch)
               + mag.y * Math.cos(roll)
               - mag.z * Math.sin(roll) * Math.cos(pitch);
  let h = Math.atan2(-my2, mx2) * (180 / Math.PI);
  if (h < 0) h += 360;
  return h;
};

// ─── Constants ───────────────────────────────────────────────────
const ESCALATOR_SECONDS   = 20;
const SENSOR_INTERVAL     = 50;
const LOW_PASS_ALPHA      = 0.6;
const PEAK_THRESHOLD      = 1.05;
const STEP_COOLDOWN_MS    = 350;
const ESCALATOR_SHAKE_MAG = 1.3;

// ─── Chevron Arrow Component ─────────────────────────────────────
function ChevronArrow({ color }: { color: string }) {
  const anim1 = useRef(new Animated.Value(0.15)).current;
  const anim2 = useRef(new Animated.Value(0.15)).current;
  const anim3 = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    // One master loop: 1 on → 2 on → 3 on → all off → repeat
    const sequence = Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1,    duration: 150, useNativeDriver: true }),
        Animated.timing(anim2, { toValue: 1,    duration: 150, useNativeDriver: true }),
        Animated.timing(anim3, { toValue: 1,    duration: 150, useNativeDriver: true }),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(anim1, { toValue: 0.15, duration: 200, useNativeDriver: true }),
          Animated.timing(anim2, { toValue: 0.15, duration: 200, useNativeDriver: true }),
          Animated.timing(anim3, { toValue: 0.15, duration: 200, useNativeDriver: true }),
        ]),
        Animated.delay(300),
      ])
    );
    sequence.start();
    return () => sequence.stop();
  }, []);

  const chevronStyle = {
    fontSize: 130,
    lineHeight: 130,
    color,
    marginTop: -32,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    transform: [{ rotate: '-90deg' }],
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.Text style={[chevronStyle, { opacity: anim3 }]}>❯</Animated.Text>
      <Animated.Text style={[chevronStyle, { opacity: anim2 }]}>❯</Animated.Text>
      <Animated.Text style={[chevronStyle, { opacity: anim1 }]}>❯</Animated.Text>
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────
export default function Index() {
  const [lang, setLang]           = useState<Lang>('en');
  const [screen, setScreen]       = useState<Screen>('home');
  const [selectedRoom, setRoom]   = useState('');
  const [stepIndex, setStepIndex] = useState(0);

  const [heading, setHeading]         = useState<number | null>(null);
  const [sensorReady, setSensorReady] = useState(false);

  const [pedoSteps, setPedoSteps]   = useState(0);
  const [accelSteps, setAccelSteps] = useState(0);
  const [pedoAvail, setPedoAvail]   = useState<boolean | null>(null);
  const stepCount = Math.max(pedoSteps, accelSteps);

  const [escalatorSecs, setEscalatorSecs]   = useState(ESCALATOR_SECONDS);
  const [escalatorShaking, setEscShaking]   = useState(false);
  const escalatorRef  = useRef<any>(null);
  const escalatorRate = useRef(1000);

  const magRef        = useRef<{ x: number; y: number; z: number } | null>(null);
  const accRef        = useRef<{ x: number; y: number; z: number } | null>(null);
  const buffer        = useRef<number[]>([]);
  const smoothedMag   = useRef(1.0);
  const peakDetected  = useRef(false);
  const lastStepMs    = useRef(0);
  const accelStepsRef = useRef(0);

  const arrowAnim = useRef(new Animated.Value(0)).current;

  const stepIndexRef = useRef(stepIndex);
  const roomRef      = useRef(selectedRoom);
  const screenRef    = useRef(screen);
  stepIndexRef.current = stepIndex;
  roomRef.current      = selectedRoom;
  screenRef.current    = screen;

  const advancingRef  = useRef(false);
  const stepStartTime = useRef(Date.now());
  const [permission, requestPermission] = useCameraPermissions();
  const t = T[lang];

  const advanceStep = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    const total = ROUTES[roomRef.current]?.length ?? 0;
    if (stepIndexRef.current < total - 1) {
      setStepIndex(i => i + 1);
      setTimeout(() => { advancingRef.current = false; }, 400);
    } else {
      setTimeout(() => { setScreen('arrived'); advancingRef.current = false; }, 500);
    }
  }, []);

  // ── Compass + accel step detection ────────────────────────────
  useEffect(() => {
    Magnetometer.setUpdateInterval(SENSOR_INTERVAL);
    Accelerometer.setUpdateInterval(SENSOR_INTERVAL);

    const magSub = Magnetometer.addListener((mag) => {
      magRef.current = mag;
      const acc = accRef.current;
      if (!acc) return;
      const raw = tiltCompensatedHeading(mag, acc);
      buffer.current = [...buffer.current.slice(-9), raw];
      setHeading(circularAverage(buffer.current));
      setSensorReady(true);
    });

    const accSub = Accelerometer.addListener((acc) => {
      accRef.current = acc;
      if (screenRef.current !== 'ar') return;

      const step = ROUTES[roomRef.current]?.[stepIndexRef.current];
      const mag  = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);

      // Escalator shake detectie
      if (step?.escalator && mag > ESCALATOR_SHAKE_MAG) {
        setEscShaking(true);
        escalatorRate.current = 400;
        setTimeout(() => { setEscShaking(false); escalatorRate.current = 1000; }, 2000);
      }

      // Stap tellen
      if (!step || step.escalator || step.steps === 0 || step.manualOnly) return;
      const rawMag = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      smoothedMag.current = LOW_PASS_ALPHA * smoothedMag.current + (1 - LOW_PASS_ALPHA) * rawMag;
      const now = Date.now();
      if (smoothedMag.current > PEAK_THRESHOLD) {
        peakDetected.current = true;
      } else if (peakDetected.current) {
        peakDetected.current = false;
        if (now - lastStepMs.current >= STEP_COOLDOWN_MS) {
          lastStepMs.current = now;
          accelStepsRef.current += 1;
          setAccelSteps(accelStepsRef.current);
        }
      }
    });

    return () => { magSub.remove(); accSub.remove(); };
  }, []);

  // ── Reset tellers per stap ────────────────────────────────────
  useEffect(() => {
    advancingRef.current  = false;
    accelStepsRef.current = 0;
    setAccelSteps(0);
    setPedoSteps(0);
    smoothedMag.current  = 1.0;
    peakDetected.current = false;
    lastStepMs.current   = 0;
    stepStartTime.current = Date.now();
  }, [stepIndex]);

  // ── Pedometer ─────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'ar') return;
    let pedoSub: any;
    const start = async () => {
      const avail = await Pedometer.isAvailableAsync();
      setPedoAvail(avail);
      if (!avail) return;
      pedoSub = Pedometer.watchStepCount(r => setPedoSteps(r.steps));
    };
    start();
    return () => pedoSub?.remove();
  }, [screen, stepIndex]);

  // ── Auto-advance via stappen ───────────────────────────────────
  useEffect(() => {
    if (screen !== 'ar') return;
    const step = ROUTES[selectedRoom]?.[stepIndex];
    if (!step || step.steps === 0 || step.escalator || step.manualOnly) return;
    // Guard: eerste 1500ms negeren — voorkomt dat resterende stappen van vorige stap direct doorgaan
    if (Date.now() - stepStartTime.current < 1500) return;
    if (stepCount >= step.steps) advanceStep();
  }, [stepCount, screen, selectedRoom, stepIndex, advanceStep]);

  // ── Roltrap aftelling ─────────────────────────────────────────
  useEffect(() => {
    const step = screen === 'ar' ? ROUTES[selectedRoom]?.[stepIndex] : null;
    if (!step?.escalator) return;
    setEscalatorSecs(ESCALATOR_SECONDS);
    escalatorRate.current = 1000;
    const tick = () => {
      setEscalatorSecs(s => {
        if (s <= 1) { clearTimeout(escalatorRef.current); advanceStep(); return 0; }
        escalatorRef.current = setTimeout(tick, escalatorRate.current);
        return s - 1;
      });
    };
    escalatorRef.current = setTimeout(tick, 1000);
    return () => clearTimeout(escalatorRef.current);
  }, [screen, stepIndex, advanceStep]);

  // ── Pijl animatie ─────────────────────────────────────────────
  useEffect(() => {
    if (heading === null || screen !== 'ar') return;
    const step = ROUTES[selectedRoom]?.[stepIndex];
    if (!step) return;
    const diff     = angleDiff(step.direction, heading);
    const rotation = Math.max(-90, Math.min(90, diff));
    Animated.spring(arrowAnim, {
      toValue: rotation, useNativeDriver: true, tension: 40, friction: 8,
    }).start();
  }, [heading, stepIndex]);

  const startRoute = (room: string) => {
    setRoom(room); setStepIndex(0); setPedoSteps(0);
    setAccelSteps(0); accelStepsRef.current = 0;
    advancingRef.current = false; setScreen('ar');
  };

  // ── AR Screen ─────────────────────────────────────────────────
  if (screen === 'ar') {
    const step       = ROUTES[selectedRoom][stepIndex];
    const isLastStep = stepIndex === ROUTES[selectedRoom].length - 1;
    const total      = ROUTES[selectedRoom].length;

    if (heading === null) {
      return (
        <View style={styles.arContainer}>
          <CameraView style={StyleSheet.absoluteFillObject} />
          <View style={styles.overlay}>
            <View style={styles.arrowWrapper}>
              <Text style={styles.calibrateText}>{t.warmingUp}</Text>
            </View>
          </View>
        </View>
      );
    }

    const diff    = angleDiff(step.direction, heading);
    const absDiff = Math.abs(diff);
    const onTrack = step.manualOnly || absDiff <= step.tolerance;
    const stepProgress = step.steps > 0 ? Math.min(stepCount / step.steps, 1) : 0;

    let instructionText: string;
    let arrowColor: string;
    let statusText: string;

    if (step.escalator) {
      instructionText = escalatorShaking ? t.escalatorShake : t.standStill;
      arrowColor      = C.mid;
      statusText      = '';
    } else if (step.manualOnly) {
      instructionText = step.instruction[lang];
      arrowColor      = C.dark;
      statusText      = t.onTrack;
    } else if (onTrack) {
      instructionText = step.instruction[lang];
      arrowColor      = C.dark;
      statusText      = t.onTrack;
    } else if (absDiff <= 45) {
      instructionText = diff > 0 ? t.slightRight : t.slightLeft;
      arrowColor      = C.light;
      statusText      = t.faceRight;
    } else if (absDiff <= 100) {
      instructionText = diff > 0 ? t.turnRight : t.turnLeft;
      arrowColor      = C.warn;
      statusText      = t.faceRight;
    } else {
      instructionText = t.turnAround;
      arrowColor      = C.danger;
      statusText      = t.faceRight;
    }

    return (
      <View style={styles.arContainer}>
        <CameraView style={StyleSheet.absoluteFillObject} />
        <View style={[styles.tintOverlay, { backgroundColor: arrowColor + '18' }]} />

        <View style={styles.overlay}>
          {/* Bovenste balk — bestemming + stap teller */}
          <View style={styles.topBar}>
            <View style={styles.debugBar}>
              {/* Navigatie label — toont de bestemming */}
              <Text style={styles.debugText}>
                {t.navigatingTo} {ROUTE_DISPLAY[selectedRoom]?.[lang] ?? selectedRoom}
              </Text>
              {/* Stap teller — pedo en accel stappen */}
              <Text style={styles.debugText}>
                Pedo:{pedoAvail === null ? '…' : pedoAvail ? 'ON' : 'OFF'}  Accel:{accelSteps}  Best:{stepCount}/{step.steps}
              </Text>
              {/* DEBUG — kompas graden, verwijder voor productie / uncomment to re-enable
              <Text style={styles.debugText}>
                {Math.round(heading)}° → {step.direction}°  |  Δ{Math.round(diff)}°
              </Text>
              */}
            </View>
            <TouchableOpacity style={styles.langToggle} onPress={() => setLang(l => l === 'en' ? 'nl' : 'en')}>
              <Text style={styles.langToggleText}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          {/* Voortgang stippen */}
          <View style={styles.dotsRow}>
            {ROUTES[selectedRoom].map((_, i) => (
              <View key={i} style={[
                styles.dot,
                i < stepIndex   && { backgroundColor: C.dark },
                i === stepIndex && { backgroundColor: C.mid, width: 24, borderRadius: 4 },
              ]} />
            ))}
          </View>

          {/* Pijl of roltrap */}
          <View style={styles.arrowWrapper}>
            {step.escalator ? (
              <View style={styles.escalatorBox}>
                <View style={[styles.escalatorCircle, { borderColor: arrowColor }]}>
                  <Text style={[styles.escalatorTimer, { color: arrowColor }]}>{escalatorSecs}</Text>
                  <Text style={[styles.escalatorSub, { color: C.muted }]}>sec</Text>
                </View>
              </View>
            ) : (
              <Animated.View style={{
                transform: [{
                  rotate: arrowAnim.interpolate({
                    inputRange: [-90, 90],
                    outputRange: ['-90deg', '90deg'],
                  }),
                }],
              }}>
                <ChevronArrow color={arrowColor} />
              </Animated.View>
            )}
          </View>

          {/* Onderste kaart */}
          <View style={styles.bottomCard}>
            <View style={styles.stepRow}>
              <Text style={styles.stepLabel}>{t.stepOf} {stepIndex + 1} {t.of} {total}</Text>
              {step.steps > 0 && !step.escalator && (
                <Text style={[styles.stepLabel, { color: onTrack ? C.dark : C.muted }]}>
                  {stepCount} / {step.steps} {t.steps}
                </Text>
              )}
            </View>

            {step.steps > 0 && !step.escalator && (
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, {
                  width: `${stepProgress * 100}%` as any,
                  backgroundColor: arrowColor,
                }]} />
              </View>
            )}

            <Text style={styles.instruction}>{instructionText}</Text>

            {statusText !== '' && (
              <View style={[styles.statusPill, { backgroundColor: arrowColor + '22' }]}>
                <View style={[styles.statusDot, { backgroundColor: arrowColor }]} />
                <Text style={[styles.statusText, { color: arrowColor }]}>{statusText}</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.nextButton, { backgroundColor: C.dark }]} onPress={advanceStep}>
              <Text style={styles.nextButtonText}>{isLastStep ? t.done : t.nextStep}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen('home')}>
              <Text style={styles.quitText}>{t.quit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── Selecteer Scherm ──────────────────────────────────────────
  if (screen === 'select') {
    return (
      <View style={styles.darkContainer}>
        <TouchableOpacity style={styles.langToggleFloating} onPress={() => setLang(l => l === 'en' ? 'nl' : 'en')}>
          <Text style={styles.langToggleText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
        <View style={styles.selectHeader}>
          <Text style={styles.darkTitle}>{t.selectClass}</Text>
          <Text style={styles.darkSubtitle}>{t.selectWhere}</Text>
        </View>
        <View style={styles.roomList}>
          <TouchableOpacity style={styles.roomCard} onPress={() => startRoute('AC1.70')}>
            <View style={[styles.roomAccent, { backgroundColor: C.dark }]} />
            <View style={styles.roomCardText}>
              <Text style={styles.roomNumber}>AC1.70</Text>
              <Text style={styles.roomSub}>{t.startEntrance}</Text>
            </View>
            <Text style={styles.roomArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roomCard} onPress={() => startRoute('AC1.30')}>
            <View style={[styles.roomAccent, { backgroundColor: C.mid }]} />
            <View style={styles.roomCardText}>
              <Text style={styles.roomNumber}>AC1.30</Text>
              <Text style={styles.roomSub}>{t.startEntrance}</Text>
            </View>
            <Text style={styles.roomArrow}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.darkQuit}>← {t.back}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Aangekomen Scherm ─────────────────────────────────────────
  if (screen === 'arrived') {
    const opt = ARRIVED_OPTIONS[selectedRoom];
    return (
      <View style={styles.darkContainer}>
        <TouchableOpacity style={styles.langToggleFloating} onPress={() => setLang(l => l === 'en' ? 'nl' : 'en')}>
          <Text style={styles.langToggleText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
        <View style={[styles.arrivedBadge, { borderColor: C.dark }]}>
          <Text style={[styles.arrivedCheck, { color: C.dark }]}>✓</Text>
        </View>
        <Text style={styles.darkTitle}>{t.arrived}</Text>
        <Text style={[styles.darkSubtitle, { color: C.dark }]}>{t.arrivedAt} {opt?.room}</Text>

        {opt && (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: C.dark, width: '100%', marginTop: 32 }]}
            onPress={() => startRoute(opt.nextRoute)}
          >
            <Text style={styles.nextButtonText}>
              {opt.isReturn ? t.returnTo : t.goTo} {opt.isReturn ? 'AC1.70' : 'AC1.30'}
            </Text>
            <Text style={[styles.nextButtonText, { fontSize: 12, opacity: 0.7, fontWeight: '400' }]}>
              {t.fromHere}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.darkQuit}>{t.backHome}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Home Scherm ───────────────────────────────────────────────
  return (
    <View style={styles.darkContainer}>
      <TouchableOpacity style={styles.langToggleFloating} onPress={() => setLang(l => l === 'en' ? 'nl' : 'en')}>
        <Text style={styles.langToggleText}>{lang.toUpperCase()}</Text>
      </TouchableOpacity>
      <View style={styles.logoMark}>
        <View style={[styles.logoInner, { borderColor: C.dark }]}>
          <Text style={[styles.logoArrow, { color: C.dark }]}>↑</Text>
        </View>
      </View>
      <Text style={styles.darkTitle}>{t.appTitle}</Text>
      <Text style={styles.darkSubtitle}>{t.appSubtitle}</Text>
      <View style={styles.sensorStatus}>
        <View style={[styles.statusDot, { backgroundColor: sensorReady ? C.dark : C.muted }]} />
        <Text style={[styles.statusText, { color: sensorReady ? C.dark : C.muted }]}>
          {sensorReady ? t.compassReady : t.connectingSensor}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: C.dark, width: '100%', marginTop: 16 }]}
        onPress={() => setScreen('select')}
      >
        <Text style={styles.nextButtonText}>{t.startNav}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  darkContainer:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 28, backgroundColor: C.black },
  darkTitle:          { fontSize: 30, fontWeight: '700', color: C.white, letterSpacing: -0.5, textAlign: 'center' },
  darkSubtitle:       { fontSize: 14, color: C.muted, textAlign: 'center', letterSpacing: 0.3 },
  darkQuit:           { textAlign: 'center', color: C.muted, marginTop: 8, fontSize: 13 },
  langToggle:         { backgroundColor: C.surface, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  langToggleFloating: { position: 'absolute', top: 56, right: 24, zIndex: 99, backgroundColor: C.surface, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  langToggleText:     { color: C.white, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  logoMark:           { marginBottom: 8 },
  logoInner:          { width: 72, height: 72, borderRadius: 36, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  logoArrow:          { fontSize: 36 },
  sensorStatus:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  statusDot:          { width: 7, height: 7, borderRadius: 4 },
  statusText:         { fontSize: 13, letterSpacing: 0.2 },
  selectHeader:       { alignItems: 'center', marginBottom: 8, marginTop: 40 },
  roomList:           { width: '100%', gap: 12, marginTop: 8 },
  roomCard:           { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  roomAccent:         { width: 5, alignSelf: 'stretch' },
  roomCardText:       { flex: 1, padding: 18, gap: 3 },
  roomNumber:         { color: C.white, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  roomSub:            { color: C.muted, fontSize: 12 },
  roomArrow:          { color: C.muted, fontSize: 20, paddingRight: 18 },
  arrivedBadge:       { width: 80, height: 80, borderRadius: 40, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  arrivedCheck:       { fontSize: 40, fontWeight: '300' },
  arContainer:        { flex: 1, backgroundColor: '#000' },
  tintOverlay:        { ...StyleSheet.absoluteFillObject },
  overlay:            { flex: 1, justifyContent: 'space-between', paddingTop: 50 },
  topBar:             { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, gap: 8 },
  debugBar:           { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10, gap: 2 },
  debugText:          { color: C.dark, fontSize: 11, textAlign: 'center', fontFamily: 'monospace' },
  dotsRow:            { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  dot:                { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  arrowWrapper:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  arrow:              { fontSize: 130, lineHeight: 140 },
  escalatorBox:       { alignItems: 'center', gap: 8 },
  escalatorCircle:    { width: 140, height: 140, borderRadius: 70, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  escalatorTimer:     { fontSize: 52, fontWeight: '200', lineHeight: 58 },
  escalatorSub:       { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
  calibrateText:      { color: C.white, fontSize: 16, textAlign: 'center', letterSpacing: 0.5 },
  bottomCard:         { backgroundColor: C.black, padding: 24, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: 10, borderTopWidth: 1, borderColor: C.border },
  stepRow:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepLabel:          { fontSize: 12, color: C.muted, letterSpacing: 0.3 },
  progressTrack:      { height: 4, backgroundColor: C.surface, borderRadius: 2, overflow: 'hidden' },
  progressFill:       { height: 4, borderRadius: 2 },
  instruction:        { fontSize: 22, fontWeight: '700', color: C.white, letterSpacing: -0.3 },
  statusPill:         { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start' },
  nextButton:         { borderRadius: 14, padding: 16, gap: 2 },
  nextButtonText:     { color: C.black, fontWeight: '700', textAlign: 'center', fontSize: 16, letterSpacing: 0.2 },
  quitText:           { textAlign: 'center', color: C.muted, fontSize: 13 },
});