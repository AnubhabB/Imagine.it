from application import app
from flask import Flask, render_template, jsonify, redirect, url_for, request
from werkzeug import secure_filename
#import simplejson
import random
import base64
from .model import enhance
from datetime import datetime

ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']

@app.route("/")
def indexfunction():
	return render_template("index.html")

@app.route("/sync",methods=['POST'])
def sync():
	if request.method == 'POST':
		f    = request.files['file[]']
		rand = str(random.randrange(100000,999999))
		f.save('/var/www/imagine/application/static/img/uploads/'+rand+"_"+secure_filename(f.filename))
	return jsonify({'name':rand+"_"+secure_filename(f.filename),'session':rand})


@app.route("/syncState",methods=['POST'])
def syncState():
	if request.method =='POST':
		tmpName = datetime.now()
		tmpName = ''.join(e for e in str(tmpName) if e.isalnum())
		imgData = (request.json).replace("data:image/png;base64","")
		imgdata = base64.b64decode(imgData)
		with open('/var/www/imagine/application/static/img/uploads/'+tmpName+'.png', 'wb') as f:
			f.write(imgdata)
		del imgData
	return jsonify({'response':'success','name':tmpName+'.png'})


@app.route("/processEnhance",methods=['POST'])
def processEnhance():
	if request.method =='POST':
		uploadLayer = datetime.now()
		uploadLayer = ''.join(e for e in str(uploadLayer) if e.isalnum())
		path = '/var/www/imagine/application/static/img/uploads/'+uploadLayer+'.png'
		imageData = (request.json['imgData']).replace("data:image/png;base64","")

		imagedata = base64.b64decode(imageData)
		with open(path, 'wb') as f:
			f.write(imagedata)
		if request.json['action'] == 'brightness_contrast':
			factorContrast = request.json['contrastFactor']
			factorBrightness = request.json['brightnessFactor']
			En = enhance.Enhance()
			name = En.contrast(factorContrast,factorBrightness,path)
		elif request.json['action'] == 'hue_saturation':
			factorHue = request.json['hueFactor']
			factorSaturation = request.json['saturationFactor']
			En = enhance.Enhance()
			name = En.hueSaturation(factorHue,factorSaturation,path)
		elif request.json['action'] == 'gaussian_blur':
			factorBlur = request.json['blurFactor']
			En = enhance.Enhance()
			name = En.blurImage(factorBlur,path)
		elif request.json['action'] == 'simple_sharpen':
			En = enhance.Enhance()
			name = En.sharpenImage(path)
		elif request.json['action'] == 'simple_blacknwhite':
			En = enhance.Enhance()
			name = En.blackWhite(path)
		elif request.json['action'] == 'simple_sepia':
			rgbVal = request.json['sepia_rgb']
			En = enhance.Enhance()
			name = En.getSepia(path,rgbVal)

	return jsonify({'response':'success','name':name})
