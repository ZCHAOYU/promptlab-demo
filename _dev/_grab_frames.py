# -*- coding: utf-8 -*-
"""按时间间隔抽帧（2026-11-11）"""
import io
import os
import sys

import av

src = sys.argv[1]
outdir = sys.argv[2]
step = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1280

os.makedirs(outdir, exist_ok=True)
container = av.open(src)
stream = container.streams.video[0]
stream.thread_type = 'AUTO'

next_t = 0.0
n = 0
for frame in container.decode(stream):
    t = float(frame.pts * stream.time_base) if frame.pts is not None else 0.0
    if t + 1e-6 < next_t:
        continue
    img = frame.to_image()
    if img.width > width:
        ratio = width / float(img.width)
        img = img.resize((width, int(img.height * ratio)))
    name = 'f_%02d_%05.1fs.jpg' % (n + 1, t)
    img.save(os.path.join(outdir, name), quality=82)
    n += 1
    next_t += step

print('抽出 %d 帧 -> %s' % (n, outdir))
