"""
Original score for 'Zulia in two minutes' — modelled on the reference recording:
A minor, Am–F–C–G, ~72 bpm, warm and voice-led, no drums, swelling through the middle.
Instruments (all synthesised): felt piano, plucked nylon-string arpeggio, string pad,
a hummed lead ('oo' formants), low drone. 121 s, 48 kHz stereo.
Usage: python3 scripts/score.py public/media/zulia-score.wav
"""
import sys, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, lfilter

SR = 48000
DUR = 121.0
BPM = 72.0
BAR = 4 * 60 / BPM           # 3.333 s
t = np.arange(int(SR * DUR)) / SR
rng = np.random.default_rng(7)
mix = np.zeros_like(t)

A4 = 440.0
def hz(n): return A4 * 2 ** (n / 12)   # n = semitones from A4
# pitch names (semitones from A4)
A1, C2, D2, E2, F2, G2 = -36, -33, -31, -29, -28, -26
A2, C3, D3, E3, F3, G3 = -24, -21, -19, -17, -16, -14
A3, B3, C4, D4, E4, F4, G4 = -12, -10, -9, -7, -5, -4, -2
A4n, B4, C5, D5, E5, F5, G5 = 0, 2, 3, 5, 7, 8, 10

CH = {
    "Am": dict(root=A2, pad=[A2, E3, C4, E4], arp=[A3, C4, E4, A4n, E4, C4]),
    "F":  dict(root=F2, pad=[F2, C3, F3, A3, C4], arp=[F3, A3, C4, F4, C4, A3]),
    "C":  dict(root=C3, pad=[C3, G3, C4, E4, G4], arp=[C4, E4, G4, C5, G4, E4]),
    "G":  dict(root=G2, pad=[G2, D3, G3, B3, D4], arp=[G3, B3, D4, G4, D4, B3]),
}
# Bars: one chord per bar, starting at the end of the hush (bar 0 at t=0 is the hush)
# Film: hush 0–9 | map 9–30 | land 30–62 | stills 62–80 | mandate 80–92 | plan 92–108 | close 108–121
prog = ["Am", "F", "C", "G"]
n_bars = int(np.ceil(DUR / BAR)) + 1
bars = []
for b in range(n_bars):
    start = b * BAR
    if start < 9: name = "Am"
    elif start >= 113: name = "C" if start < 116.5 else "Am"
    else: name = prog[(b - 3) % 4]
    bars.append((start, start + BAR, name))

def add(n0, sig):
    n1 = min(len(mix), n0 + len(sig));
    if n1 > n0: mix[n0:n1] += sig[: n1 - n0]

# intensity curve follows the reference: quiet start, swell to a peak around 60–80%, gentle out
I = np.interp(t, [0, 9, 30, 48, 62, 80, 92, 104, 113, 121], [0.25, 0.4, 0.55, 0.7, 0.85, 1.0, 0.9, 0.8, 0.55, 0.0])

# ---------- string pad ----------
def pad_voice(f, s, e, g):
    n0, n1 = int(s * SR), int(min(e, DUR) * SR); tt = t[n0:n1]
    out = np.zeros_like(tt)
    for det, ph in ((-0.5, .1), (-0.2, .4), (0.1, .7), (0.4, .2)):
        ff = f * 2 ** (det / 100); vib = 1 + 0.002 * np.sin(2 * np.pi * 5 * tt + ph * 6.28)
        out += 2 * ((tt * ff * vib + ph) % 1) - 1
    out = sosfilt(butter(2, 1800, fs=SR, output="sos"), out / 4)
    env = np.minimum(np.clip((tt - s) / 1.8, 0, 1), np.clip((e - tt) / 1.2, 0, 1))
    return n0, out * env * g

for (s, e, name) in bars:
    if s >= DUR: break
    for i, n in enumerate(CH[name]["pad"]):
        add(*pad_voice(hz(n), s, e + 0.6, 0.05 if i else 0.07))

# ---------- felt piano (root + fifth on the bar, octave above on beat 3) ----------
def piano(f, s, g, dur=2.8):
    n0 = int(s * SR); L = int(dur * SR); tt = np.arange(L) / SR
    sig = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 3)
           + 0.12 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 5))
    env = (1 - np.exp(-tt * 120)) * np.exp(-tt * 1.4)
    return n0, sig * env * g

for (s, e, name) in bars:
    if s < 9 or s >= 116: continue
    r = CH[name]["root"]
    g = 0.16 * float(np.interp(s, t, I))
    add(*piano(hz(r), s, g)); add(*piano(hz(r + 7), s + 0.02, g * 0.6))
    add(*piano(hz(r + 12), s + BAR / 2, g * 0.7))

# ---------- plucked arpeggio (Karplus–Strong), from the land section onward ----------
def pluck(f, s, g, dur=1.6):
    n0 = int(s * SR); L = int(dur * SR)
    N = int(SR / f); buf = rng.uniform(-1, 1, N); out = np.zeros(L)
    for i in range(L):
        out[i] = buf[i % N]; buf[i % N] = 0.5 * (buf[i % N] + buf[(i + 1) % N]) * 0.996
    out = sosfilt(butter(2, 3000, fs=SR, output="sos"), out)
    return n0, out * g * np.exp(-np.arange(L) / SR * 1.2)

step = BAR / 6
for (s, e, name) in bars:
    if s < 30 or s >= 113: continue
    g = 0.12 * float(np.interp(s, t, I))
    for k, n in enumerate(CH[name]["arp"]):
        add(*pluck(hz(n), s + k * step, g * (1.0 if k == 0 else 0.75)))

# ---------- hummed lead ('oo' vowel) ----------
def hum(f, s, e, g):
    n0, n1 = int(s * SR), int(min(e, DUR) * SR); tt = t[n0:n1]
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt) * np.clip((tt - s) / 0.6, 0, 1)
    src = 2 * ((tt * f * vib) % 1) - 1
    # two formants for 'oo'
    out = np.zeros_like(src)
    for fc, bw, a in ((320, 80, 1.0), (850, 120, 0.35), (2400, 200, 0.08)):
        sos = butter(2, [max(50, fc - bw), fc + bw], btype="band", fs=SR, output="sos")
        out += a * sosfilt(sos, src)
    env = np.minimum(np.clip((tt - s) / 0.35, 0, 1), np.clip((e - tt) / 0.5, 0, 1))
    return n0, out * env * g

# melody in A minor pentatonic-ish, phrased like a sung line; (start, end, note)
lead = [
    # over the land (30–62): low, sparing
    (33, 36.5, E4), (36.5, 39, C4), (40, 43, D4), (43, 46.5, A3),
    (46.5, 50, C4), (50, 52.5, E4), (53, 56.5, G4), (56.5, 60, E4),
    # stills (62–80): the song opens up
    (63, 66, A4n), (66, 68, G4), (68, 71, E4), (72, 75, C5), (75, 77, A4n), (77, 80, G4),
    # mandate (80–92): peak, held
    (80, 85, C5), (85, 88, D5), (88, 92, E5),
    # plan (92–108): answering phrases
    (93, 96, C5), (96, 99, A4n), (100, 103, G4), (103, 106, E4),
    # close
    (113, 117, E4), (117, 121, A3),
]
for (s, e, n) in lead:
    g = 0.11 * float(np.interp(s, t, I))
    add(*hum(hz(n), s, e, g))

# ---------- drone ----------
drone = 0.6 * np.sin(2 * np.pi * hz(A1) * t) + 0.3 * np.sin(2 * np.pi * hz(A2) * t)
mix += drone * np.interp(t, [0, 6, 9, 30, 113, 121], [0.0, 0.1, 0.04, 0.03, 0.03, 0.0])

# ---------- room ----------
mix = sosfilt(butter(2, 4200, fs=SR, output="sos"), mix)
ir_len = int(2.0 * SR); ir = rng.normal(0, 1, ir_len) * np.exp(-np.arange(ir_len) / (0.6 * SR))
ir = sosfilt(butter(2, 2800, fs=SR, output="sos"), ir); ir /= np.abs(ir).sum() / 9
mix = 0.74 * mix + 0.26 * fftconvolve(mix, ir)[: len(mix)]

# master: overall intensity curve, soft limiter
mix *= np.interp(t, [0, 2, 118, 121], [0, 1, 1, 0]) * (0.6 + 0.4 * I)
mix = np.tanh(1.6 * mix / (np.max(np.abs(mix)) + 1e-9)) * 0.9

d = int(0.012 * SR)
L = mix; R = np.concatenate([np.zeros(d), mix[:-d]])
stereo = np.stack([0.9 * L + 0.1 * R, 0.9 * R + 0.1 * L], axis=1)
from scipy.io import wavfile
wavfile.write(sys.argv[1], SR, (stereo * 32767).astype(np.int16))
print("wrote", sys.argv[1])
