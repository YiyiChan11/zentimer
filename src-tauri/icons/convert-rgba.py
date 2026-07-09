import os, glob
from PIL import Image

ICON_DIR = os.path.dirname(os.path.abspath(__file__))

def color_type_desc(path):
    with open(path, 'rb') as f:
        b = f.read(26)
    # PNG sig(8) + len(4) + 'IHDR'(4) + w(4) + h(4) + bitdepth(1) + colortype(1)
    ct = b[25]
    return {0:'Gray',2:'RGB',3:'Palette',4:'Gray+Alpha',6:'RGBA'}.get(ct, f'?{ct}')

ok = True
for p in sorted(glob.glob(os.path.join(ICON_DIR, '*.png'))):
    im = Image.open(p).convert('RGBA')   # force truecolor + alpha => color type 6
    im.save(p)
    ct = color_type_desc(p)
    status = 'RGBA OK' if 'RGBA' in ct else '*** STILL NOT RGBA ***'
    if 'RGBA' not in ct:
        ok = False
    print(f"{os.path.basename(p).ljust(20)} -> {ct}  {status}")

print('\nALL_RGBA_OK' if ok else '\nFAILED_SOME_NOT_RGBA')
