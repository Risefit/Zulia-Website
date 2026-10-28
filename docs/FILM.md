# Zulia in two minutes — script and storyboard

Running time 2:00. The rendered cut is `public/media/zulia-film.mp4` (silent). Voice-over below is
written to be read slowly by one voice — Christo, or a Ugandan narrator — at about 110 words a minute.
Music: a single sustained instrument (cello, kora or nyatiti) that lifts at 1:20. No percussion until the plan sequence.

| Time | Picture | Voice-over | On-screen text |
|---|---|---|---|
| 0:00–0:09 | Black. Contour lines fade up. The mark, then the word. | *(silence, then music enters)* | Zulia · 4° North · 34° East · Uganda |
| 0:09–0:30 | Animated map: Africa, zoom to Uganda, zoom to Zulia with the park overlap and the summit. | In the far north-east of Uganda, where the country meets South Sudan and Kenya, there is a reserve that almost no one has seen. | In the far north-east of Uganda, / where the country meets South Sudan and Kenya, / lies a reserve almost no one has seen. |
| 0:30–0:48 | Aerial: the green plains from the aircraft, the wing in frame. | One thousand and twenty-nine square kilometres. Gazetted in 1942, in the last years of the Protectorate. Never managed. Never developed. Never, until now, properly looked at. | 1,029 square kilometres. / Gazetted in 1942. / Never managed. Never developed. |
| 0:48–1:02 | Aerial: the inselberg rising from the savanna. | These are the Zulia hills: granite rising to two thousand one hundred and forty-nine metres, the water tower of the whole Kidepo valley. Rivers of sand and borassus palm. The dry-season range of Kidepo's elephant, buffalo, giraffe and lion. | The Kidepo water tower / Granite hills rising to 2,149 metres… |
| 1:02–1:20 | Three stills, six seconds each: riverbed, palm pool, rangers on the kopje. | For eighty years it was too remote to reach and too insecure to manage. And so, by accident, it is still intact. | Too remote to reach. / Too insecure to manage. / And so, still intact. |
| 1:20–1:32 | Dark contour ground, text only. Music lifts. | In 2022 the National Forestry Authority granted Zulia Conservancy a fifty-year licence to manage the whole reserve. Not to own it. To bring it back. | In 2022 the National Forestry Authority… / Not to own it. To bring it back. |
| 1:32–1:48 | Aerial: the Kidepo River in flood, darkened. Six lines build. | Protect it. Water it. Count it. Share it with the people who live around it. Open it, lightly, to those who will walk it and ride it and sleep under it. And build it with partners who want to be here in fifty years, not five. | Protect it. / Water it. / Count it. / Share it with its neighbours. / Open it, lightly. / Build it with partners. |
| 1:48–1:55 | Sand ground, text. | If that is you, we would like to talk. | We are looking for / Lodge operators · Hunting outfitters / Conservation funds · Livestock partners / Researchers · Aviators |
| 1:55–2:00 | Mark, name, URL. | *(music resolves)* | Zulia Conservancy / zuliaconservancy.org |

## Re-rendering

The film is a web page (`/film?record=1`) driven by a master clock, so any copy, timing or media change is a code
change in `src/components/Film.tsx`, followed by:

```
npm run dev            # in one terminal
npm run film           # in another: records 1920×1080 via Playwright and writes public/media/zulia-film.mp4
```

Add the voice-over and music afterwards in any editor, or with ffmpeg:

```
ffmpeg -i public/media/zulia-film.mp4 -i vo.wav -i music.wav \
  -filter_complex "[1:a]adelay=9000|9000[vo];[2:a]volume=0.35[m];[vo][m]amix=inputs=2:duration=first[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -shortest public/media/zulia-film.mp4
```

## Shots still wanted

- Wildlife on the Zulia side of the river (the current cut uses no wildlife footage; the site's wildlife stills are Kidepo Creative Commons images).
- Dawn over the Turkana escarpment from the summit, for the title and the close.
- People: a Dodoth kraal, a community meeting, the NFA Kaabong sector team.
- A drone orbit of a kopje and a borassus river bend.
