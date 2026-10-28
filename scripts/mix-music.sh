#!/usr/bin/env bash
# Loops public/media/zulia-theme.m4a to fill the film and muxes it in.
set -e
IN=public/media/zulia-theme.m4a
ffmpeg -v error -y -i "$IN" -ss 0 -t 95 -ar 48000 -ac 2 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=92:d=3" /tmp/segA.wav
ffmpeg -v error -y -i "$IN" -ss 0 -t 40 -ar 48000 -ac 2 -af "afade=t=in:st=0:d=3" /tmp/segB.wav
ffmpeg -v error -y -i /tmp/segA.wav -i /tmp/segB.wav -filter_complex "[0:a][1:a]acrossfade=d=4:c1=tri:c2=tri[a]" -map "[a]" /tmp/loop.wav
ffmpeg -v error -y -i /tmp/loop.wav -t 121 -af "afade=t=out:st=116:d=5,loudnorm=I=-16:TP=-1.5:LRA=11" /tmp/music.wav
ffmpeg -v error -y -i public/media/zulia-film.mp4 -i /tmp/music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest /tmp/zf.mp4
mv /tmp/zf.mp4 public/media/zulia-film.mp4
echo "remixed public/media/zulia-film.mp4"
