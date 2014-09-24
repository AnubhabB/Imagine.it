from datetime import datetime
from PIL import Image, ImageFilter, ImageEnhance, ImageOps, ImagePalette

class Enhance(object):

	def contrast(self,factorContrast,factorBrightness,imgName):
		tmpName = datetime.now()
		tmpName = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		imObj  = Image.open(imgName)
		contrastFactor   = float(factorContrast)/100
		brightFactor     = float(factorBrightness)/100
		if contrastFactor >= 0:
			contrastFactor = 1.0+contrastFactor
			enhObj = ImageEnhance.Contrast(imObj)
			enhObj.enhance(contrastFactor).save(savePath,'PNG')
		else:
			imObj.save(savePath,'PNG')

		if brightFactor >= 0:
			secondaryImObj = Image.open(savePath)
			brightFactor = 1.0 + brightFactor
			enhObj = ImageEnhance.Brightness(secondaryImObj)
			enhObj.enhance(brightFactor).save(savePath,'PNG')
		
		return tmpName+'.png'


	def hueSaturation(self,factorHue,factorSaturate,imgName):
		tmpName  = datetime.now()
		tmpName  = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		imObj    = Image.open(imgName)
		factorHue          = float(factorHue)
		factorSaturate     = float(factorSaturate)
		imObj     = imObj.convert('RGBA')
		enhObj = ImageEnhance.Color(imObj)
		enhObj.enhance(factorSaturate).convert('RGBA').save(savePath,'PNG')
		
		return tmpName+'.png'

	def blurImage(self,blurFactor,imgName):
		tmpName   = datetime.now()
		tmpName   = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath  = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		imObj     = Image.open(imgName)
		imObj     = imObj.convert('RGBA')
		factorBlur= int(blurFactor)
		enhObj    = imObj.filter(ImagineGaussianBlur(radius = factorBlur)).save(savePath,'PNG')

		return tmpName+'.png'

	def sharpenImage(self,imgName):
		tmpName   = datetime.now()
		tmpName   = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath  = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		imObj     = Image.open(imgName)
		imObj     = imObj.filter(ImageFilter.SHARPEN)
		imObj.save(savePath,'PNG')
		return tmpName+'.png'

	def blackWhite(self,imgName):
		tmpName   = datetime.now()
		tmpName   = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath  = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		imObj     = Image.open(imgName)
		imObj     = imObj.convert('LA')
		imObj.save(savePath,'PNG')
		return tmpName+'.png'

	def getSepia(self, imgName, rgbVal):
		# make sepia ramp (tweak color as necessary)
		redVal    = int(rgbVal.split(',')[0])
		greenVal  = int(rgbVal.split(',')[1])
		blueVal   = int(rgbVal.split(',')[2])
		tmpName   = datetime.now()
		tmpName   = ''.join(e for e in str(tmpName) if e.isalnum())
		savePath  = '/var/www/imagine/application/static/img/uploads/'+tmpName+'.png'
		sepia = make_linear_ramp((redVal, greenVal, blueVal))
		im = Image.open(imgName)
		# convert to grayscale
		if im.mode != "L":
			im = im.convert("L")
			# optional: apply contrast enhancement here, e.g
		im = ImageOps.autocontrast(im)
			# apply sepia palette
		im.putpalette(sepia)
			# convert back to RGB so we can save it as JPEG
			# (alternatively, save it in PNG or similar)
		im = im.convert("RGBA")
		im.save(savePath,'PNG')
		return tmpName+".png"


class ImagineGaussianBlur(ImageFilter.Filter):
	name = "GaussianBlur"
	def __init__(self, radius=2):
		self.radius = radius

	def filter(self, image):
		return image.gaussian_blur(self.radius)




def make_linear_ramp(white):
	# putpalette expects [r,g,b,r,g,b,...]
	ramp = []
	r, g, b = white
	for i in range(255):
		ramp.extend((r*i/255, g*i/255, b*i/255))
	return ramp