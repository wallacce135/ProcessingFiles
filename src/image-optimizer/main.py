from PIL import Image
import os
from os import walk

INPUT_PATH = "C:\\Работа\\python-image-optimizer\\input\\"    
OUTPUT_PATH = "C:\\Работа\\python-image-optimizer\\output\\"


def mainProccesss(filename):
    fullpath = INPUT_PATH + filename
    
    foo = Image.open(fullpath)
    width, height = foo.size
    foo = foo.convert('RGB')
    foo = foo.resize((width, height), Image.LANCZOS)
    foo.save(OUTPUT_PATH + filename, optimize=True, quality=50)



if __name__ == "__main__":
    
    print('IT FUCKIN WORKS!')

    # print(filenames)
    # mainProccesss(name)
