"""
Original score for 'Zulia in two minutes'. Synthesised strings and low brass, 121 s, 48 kHz stereo.
Structure follows the film: hush (0-9), the map (9-30), the land (30-62), stills (62-80),
the mandate (80-92, lift), the plan (92-108, pulse), partners + close (108-121, resolve).
Usage: python3 scripts/score.py public/media/zulia-score.wav
"""
import sys, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 121.0
t = np.arange(int(SR * DUR)) / SR
rng = np.random.default_rng(42)

def note(f):  # midi-ish helper: f is Hz
    return f

A = 440.0
def hz(n):  # n = semitones from A4
    return A * 2 ** (n / 12)

# D minor -> F major lift. Chord timeline: (start, end, [semitones from A4]) low register.
D2, F2, G2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4 = (
    -31, -28, -26, -24, -23, -21, -19, -17, -16, -14, -12, -11, -9, -7, -5, -4, -2, 0)

chords = [
    (0, 9,   [D2, A2, D3]),                 # hush: open fifth
    (9, 20,  [D2, A2, D3, F3, A3]),         # Dm
    (20, 30, [Bb2, F3, Bb3, D4]),           # Bb
    (30, 40, [D2, A2, F3, A3, D4]),         # Dm
    (40, 48, [C3, G3, C4, E4]),             # C
    (48, 56, [Bb2, F3, D4, F4]),            # Bb
    (56, 62, [A2, E3, A3, C4 + 1]),         # A (C# via +1) tension
    (62, 70, [D2, A2, F3, D4]),             # Dm
    (70, 76, [G2, D3, Bb3, D4]),            # Gm
    (76, 80, [A2, E3, A3, C4 + 1]),         # A
    (80, 86, [F2, C3, F3, A3, C4]),         # F  — the lift
    (86, 92, [C3, G3, C4, E4, G4]),         # C
    (92, 98, [Bb2, F3, Bb3, D4, F4]),       # Bb
    (98, 104,[F2, C3, F3, A3, C4]),         # F
    (104,108,[G2, D3, G3, Bb3, D4]),        # Gm
    (108,113,[C3, G3, C4, E4]),             # C
    (113,121,[F2, C3, F3, A3, C4, F4]),     # F — resolve
]

def env(start, end, attack, release, tt):
    e = np.zeros_like(tt)
    i0, i1 = int(start * SR), int(end * SR)
    seg = tt[i0:i1] - start
    a = np.clip(seg / attack, 0, 1)
    r = np.clip((end - start - seg) / release, 0, 1)
    e[i0:i1] = np.minimum(a, r)
    return e

def string_voice(f, start, end, gain):
    """Detuned saw ensemble, lowpassed, slow attack: the string section."""
    n0, n1 = int(start * SR), int(end * SR)
    tt = t[n0:n1]
    out = np.zeros_like(tt)
    for det in (-0.6, -0.25, 0.0, 0.3, 0.55):
        ff = f * 2 ** (det / 100)
        ph = rng.uniform(0, 1)
        vib = 1 + 0.0025 * np.sin(2 * np.pi * 5.2 * tt + ph * 6.28)
        saw = 2 * ((tt * ff * vib + ph) % 1) - 1
        out += saw
    out /= 5
    e = np.minimum(np.clip((tt - start) / 2.8, 0, 1), np.clip((end - tt) / 2.2, 0, 1))
    return n0, out * e * gain

def brass_voice(f, start, end, gain):
    n0, n1 = int(start * SR), int(end * SR)
    tt = t[n0:n1]
    sq = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + 0.5 * np.sin(2 * np.pi * f * tt)
    e = np.minimum(np.clip((tt - start) / 1.6, 0, 1), np.clip((end - tt) / 2.5, 0, 1))
    return n0, sq * e * gain

mix = np.zeros_like(t)

# Strings
for (s, e, notes) in chords:
    for i, n in enumerate(notes):
        g = 0.09 if i == 0 else 0.07
        n0, sig = string_voice(hz(n), s, e + 0.8, g)
        mix[n0:n0 + len(sig)] += sig

# Low drone throughout, swelling with the film
drone = 0.5 * np.sin(2 * np.pi * hz(D2 - 12) * t) + 0.3 * np.sin(2 * np.pi * hz(D2) * t)
drone_env = np.interp(t, [0, 9, 30, 62, 80, 92, 113, 121], [0.15, 0.35, 0.5, 0.45, 0.2, 0.3, 0.1, 0.0])
# drone follows the key change to F at 80s
drone_f = 0.5 * np.sin(2 * np.pi * hz(F2 - 12) * t) + 0.3 * np.sin(2 * np.pi * hz(F2) * t)
key_mix = np.interp(t, [0, 79, 81, 121], [0, 0, 1, 1])
mix += (drone * (1 - key_mix) + drone_f * key_mix) * drone_env * 0.35

# Low brass at the lift (80) and the resolve (113)
for (s, e, n, g) in [(80, 92, F2, 0.10), (86, 92, C3, 0.06), (113, 121, F2, 0.12), (113, 121, C3, 0.07)]:
    n0, sig = brass_voice(hz(n), s, e, g)
    mix[n0:n0 + len(sig)] += sig

# Melody: a slow cello line over the map and the stills, violin over the lift
melody = [
    (10, 14, A3), (14, 18, F3), (18, 22, G3), (22, 28, D3),
    (32, 36, D4), (36, 40, C4), (40, 46, A3), (48, 52, F3), (52, 56, G3), (56, 62, A3),
    (64, 68, D4), (68, 72, F4), (72, 76, E4), (76, 80, E4 + 1),
    (80, 84, A4), (84, 88, G4), (88, 92, F4),
    (113, 117, A4), (117, 121, F4),
]
for (s, e, n) in melody:
    n0, sig = string_voice(hz(n), s, e + 0.4, 0.12)
    mix[n0:n0 + len(sig)] += sig

# Pulse under the plan (92-108): soft low plucks every 0.75 s
for k in range(int((108 - 92) / 0.75)):
    s = 92 + k * 0.75
    n0 = int(s * SR); L = int(0.6 * SR)
    tt = np.arange(L) / SR
    f = hz([Bb2, F2, G2, F2][(k // 8) % 4])
    pl = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 6) * 0.18
    mix[n0:n0 + L] += pl

# Gentle noise bed (wind) for the first 9 s and the stills
wind = sosfilt(butter(4, [200, 1200], btype="band", fs=SR, output="sos"), rng.normal(0, 1, len(t)))
wind_env = np.interp(t, [0, 2, 9, 12, 62, 64, 80, 82, 121], [0, 0.05, 0.05, 0.0, 0.0, 0.04, 0.04, 0.0, 0.0])
mix += wind * wind_env

# Tone: lowpass the whole thing like a distant hall, then a cheap reverb
mix = sosfilt(butter(2, 3800, fs=SR, output="sos"), mix)
ir_len = int(2.4 * SR)
ir = rng.normal(0, 1, ir_len) * np.exp(-np.arange(ir_len) / (0.7 * SR))
ir = sosfilt(butter(2, 2500, fs=SR, output="sos"), ir); ir /= np.abs(ir).sum() / 8
wet = fftconvolve(mix, ir)[: len(mix)]
mix = 0.72 * mix + 0.28 * wet

# Master envelope: fade in, slight duck under the mandate text, final fade
master = np.interp(t, [0, 3, 115, 121], [0, 1, 1, 0])
mix *= master
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.85

# stereo: slight width via delayed copy
d = int(0.011 * SR)
left = mix
right = np.concatenate([np.zeros(d), mix[:-d]])
stereo = np.stack([0.95 * left + 0.05 * right, 0.95 * right + 0.05 * left], axis=1)

from scipy.io import wavfile
wavfile.write(sys.argv[1], SR, (stereo * 32767).astype(np.int16))
print("wrote", sys.argv[1])
