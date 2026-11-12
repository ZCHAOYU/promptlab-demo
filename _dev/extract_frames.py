# -*- coding: utf-8 -*-
"""从视频里抽帧：用 PyAV 解码，PIL 存图。
为什么不用 ffmpeg：机器上那个 ffmpeg.exe 是 Trae 自带的精简版，
只有解码器，没有任何图片 muxer（连 image2 都不认），写不出图片文件。
用法：python _dev/extract_frames.py <video> <outdir> [每几秒一帧]
"""
import io
import os
import sys

import av
from PIL import Image

def main():
    video = sys.argv[1]
    outdir = sys.argv[2]
    step = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5
    width = int(sys.argv[4]) if len(sys.argv) > 4 else 900

    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if f.lower().endswith(('.jpg', '.png')):
            os.remove(os.path.join(outdir, f))

    container = av.open(video)
    stream = container.streams.video[0]
    duration = float(container.duration / av.time_base) if container.duration else 0.0
    print(f'duration={duration:.2f}s  {stream.codec_context.width}x{stream.codec_context.height}  fps={stream.average_rate}')

    ts = 0.0
    n = 0
    while ts < duration:
        # 关键帧附近不一定有画面，往后多找一帧
        try:
            container.seek(int(ts * 1_000_000), stream=stream, any_frame=False, backward=True)
        except Exception as e:
            print('seek fail', ts, e)
            ts += step
            continue
        frame = None
        for fr in container.decode(stream):
            frame = fr
            if fr.time is not None and fr.time >= ts - 0.05:
                break
        if frame is None:
            ts += step
            continue
        img = frame.to_image()
        w, h = img.size
        if w > width:
            img = img.resize((width, int(h * width / w)), Image.LANCZOS)
        n += 1
        name = f'f_{n:02d}_{ts:05.1f}s.jpg'
        img.convert('RGB').save(os.path.join(outdir, name), quality=82)
        print(f'  {name}')
        ts += step

    print(f'共 {n} 帧 -> {outdir}')

if __name__ == '__main__':
    main()
