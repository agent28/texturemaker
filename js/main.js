var canvas = document.getElementById('pcanv');
canvas.width = 1024;
canvas.height = 1024;
var context = canvas.getContext('2d');

var t1 = new Image();
var t2 = new Image();
var t3 = new Image();

var mask1 = new Image();
var mask2 = new Image();

t1.src = "img/t1.jpg";
t2.src = "img/t2.jpg";
t3.src = "img/t3.jpg";
mask1.src = "img/m1.png";
mask2.src = "img/m2.png";

var limages = [t1, t2, t3, mask1, mask2];

var images = [];
var imagesData = [];

var maskData;
var maskData2;

var cantest = new THREE.Texture(canvas);
var cmaterial = new THREE.MeshPhongMaterial( { map: cantest} );

imagesLoaded(limages, init());

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function refreshArrays() {

	images = [];
	imagesData = [];

    context.drawImage(t3, 0, 0);
    images.push(context.getImageData(0, 0, 1024,  1024));
    imagesData.push(images[0].data);

    context.drawImage(t1, 0, 0);
    images.push(context.getImageData(0, 0, 1024,  1024));
    imagesData.push(images[1].data);

    context.drawImage(t2, 0, 0);
    images.push(context.getImageData(0, 0, 1024,  1024));
    imagesData.push(images[2].data);

}

function init() {
    context.globalAlpha = 1.0;

    context.drawImage(mask1, 0, 0);
    var image = context.getImageData(0, 0, 1024,  1024);
    maskData = image.data;
    context.clearRect(0, 0, 1024, 1024);
    context.drawImage(mask2, 0, 0);
    image = context.getImageData(0, 0, 1024,  1024);
    maskData2 = image.data;

    refreshArrays();

    context.drawImage(t3, 0, 0);

    cmaterial.needsUpdate = true;
    cantest.needsUpdate = true;
};

var base = 0;
var l1ti = 0;
var l1mi = 0;
var l2ti = 0;
var l2mi = 0;

var bt = document.getElementById('bt');
var l1t = document.getElementById('l1t');
var l1m = document.getElementById('l1m');
var l2t = document.getElementById('l2t');
var l2m = document.getElementById('l2m');
var layer1 = document.getElementById('layer1');
var layer2 = document.getElementById('layer2');

bt.onchange = function() {
	base = bt.selectedIndex;
	draw();
};

l1t.onchange = function() {
	l1ti = l1t.selectedIndex;
	draw();
};

l1m.onchange = function() {
	l1mi = l1m.selectedIndex;
	draw();
};

l2t.onchange = function() {
	l2ti = l2t.selectedIndex;
	draw();
};

l2m.onchange = function() {
	l2mi = l2m.selectedIndex;
	draw();
};

layer1.onclick = function() {
	finalTextureData = null;
	draw();
};

layer2.onclick = function() {
	finalTextureData = null;
	draw();
};

function maskLayer(textureIndex, layerIndex, pixelIndex) {
	switch(layerIndex) {
		case 0:
			finalTextureData[4 * pixelIndex + 0] = imagesData[textureIndex][4 * pixelIndex + 0];
			finalTextureData[4 * pixelIndex + 1] = imagesData[textureIndex][4 * pixelIndex + 1];
			finalTextureData[4 * pixelIndex + 2] = imagesData[textureIndex][4 * pixelIndex + 2];
			break;
		case 1:
			if(maskData2[4 * pixelIndex + 3] == 255){
				finalTextureData[4 * pixelIndex + 0] = imagesData[textureIndex][4 * pixelIndex + 0];
				finalTextureData[4 * pixelIndex + 1] = imagesData[textureIndex][4 * pixelIndex + 1];
				finalTextureData[4 * pixelIndex + 2] = imagesData[textureIndex][4 * pixelIndex + 2];
			}
			break;
		case 2:	
			if(maskData[4 * pixelIndex + 3] == 255){
				finalTextureData[4 * pixelIndex + 0] = imagesData[textureIndex][4 * pixelIndex + 0];
				finalTextureData[4 * pixelIndex + 1] = imagesData[textureIndex][4 * pixelIndex + 1];
				finalTextureData[4 * pixelIndex + 2] = imagesData[textureIndex][4 * pixelIndex + 2];
			}
	}
}


function draw() {	
	refreshArrays();
	var finalTexture = images[base];
	var layer1Texture = images[l1ti];
	var layer2Texture = images[l2ti];
	finalTextureData = finalTexture.data;
	var layer1Data = layer1Texture.data;
	var layer2Data = layer2Texture.data;

	var pixels = 1024 * 1024;
	while(--pixels) {
		if(l1mi == 1){
			if(maskData2[4 * pixels + 3] == 0)
				layer1Data[4 * pixels + 3] = 0;
		}
		else if(l1mi == 2) {
			if(maskData[4 * pixels + 3] == 0)
				layer1Data[4 * pixels + 3] = 0;
		}

		if(l2mi == 1){
			if(maskData2[4 * pixels + 3] == 0)
				layer2Data[4 * pixels + 3] = 0;
		}
		else if(l2mi == 2) {
			if(maskData[4 * pixels + 3] == 0)
				layer2Data[4 * pixels + 3] = 0;
		}
	}

	refreshArrays();
	var finalTexture = images[base];
	finalTextureData = finalTexture.data;


	for (var i = 0; i < 1024 * 1024 * 4; i+=4) {
		if(layer1.checked){
			if(layer1Data[i+3] != 0){
				finalTextureData[i] = layer1Data[i];
				finalTextureData[i+1] = layer1Data[i+1];
				finalTextureData[i+2] = layer1Data[i+2];
				finalTextureData[i+3] = layer1Data[i+3];
			}
		}
		if(layer2.checked){
			if(layer2Data[i+3] != 0){
				finalTextureData[i] = layer2Data[i];
				finalTextureData[i+1] = layer2Data[i+1];
				finalTextureData[i+2] = layer2Data[i+2];
				finalTextureData[i+3] = layer2Data[i+3];
			}
			
		}
		finalTextureData[i+3] = 255;
	}

	finalTexture.data = finalTextureData;
	context.clearRect(0, 0, 1024, 1024);
	context.putImageData(finalTexture, 0, 0);

	cmaterial.needsUpdate = true;
    cantest.needsUpdate = true;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

var movingCamera = false;
var prevX = 0;
var prevY = 0;
var cameraMoveSpeedControl = 100;
var cameraRotationSpeedControl = 300;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(512, 512);
document.body.appendChild(renderer.domElement);

renderer.domElement.addEventListener('mousewheel', onMouseWheel, false);
renderer.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false);
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseleave', onMouseLeave, false);

var geometry = new THREE.BoxGeometry(1, 1, 1);

var cube = new THREE.Mesh(geometry, cmaterial);
scene.add(cube);

var ambiLight = new THREE.AmbientLight(0x242424);
scene.add(ambiLight);
var light = new THREE.SpotLight();
light.position.set(0, 30, 30);
light.intensity = 1.2;
scene.add(light);
var pointColor = "#ff5808";
var directionalLight = new THREE.PointLight(pointColor);
scene.add(directionalLight);
var sphereLight = new THREE.SphereGeometry(0.2);
var sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.castShadow = true;
sphereLightMesh.position = new THREE.Vector3(3, 3, 3);
scene.add(sphereLightMesh);

cube.rotation.y += 0.5;
cube.rotation.x += 0.5;
camera.position.z = 1.5;

function onMouseWheel(e)
{
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if(delta > 0)
	{
		if ((camera.position.z - 0.5) >= 1.5)
			camera.translateZ(-0.5);
	}
	else
		camera.translateZ(0.5);
	render();
};

function onMouseDown(e)
{
	if(!e.button)
	{
		movingCamera = true;
		prevX = e.clientX;
		prevY = e.clientY;
	}
};

function onMouseUp(e)
{
	if(!e.button)
		movingCamera = false;
};

function onMouseLeave()
{
	movingCamera = false;
};

function onMouseMove(e)
{
	if(movingCamera)
	{
		cube.rotation.y -= (prevX - e.clientX) / cameraRotationSpeedControl;
		cube.rotation.x -= (prevY - e.clientY) / cameraRotationSpeedControl;					
		prevX = e.clientX;
		prevY = e.clientY;
		render();
	}
};

function render()
{
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();

function saveTexture() {
	var dataURL = canvas.toDataURL();
	window.open(dataURL);
}

window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}