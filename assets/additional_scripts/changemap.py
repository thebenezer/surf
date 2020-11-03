import os
from PIL import Image, ImageDraw
import random
import math
import numpy as np


image = Image.open("world.jpg").convert("L")
width, height = image.size

# Creating a list that contains all the pixels corresponding
pixels = np.asarray(image)

blank_image = Image.new("RGBA", (width, height), color=(0,0,0,0))
# new_pixels = np.full((height,width),255)
draw = ImageDraw.Draw(blank_image)

for i in range(height):
    for j in range(width):
        if(pixels[i][j]<5):
            draw.point([j,i],(0,0,0))
            # new_pixels[i][j]=0

# blank_image = Image.fromarray(new_pixels)
# pixel_map2 = blank_image.load()
# print("Blank : ", blank_image.format, blank_image.size, blank_image.mode)

blank_image.show()
blank_image.save(f"new_world3.png")
