function mapClass(mapId) {
	// map using pixels
	this.mapId = mapId;
	//map's width and height
	this.width = 95.5;
	this.height = 67.5;
	
	this.left = 0;
	this.up = 0;
	
	// player's position
	this.pos = {
		x: 0,
		y: 0
	};

	// sight width and height
	this.sight = {
		width: 15,
		height: 7.5
	};
	
	// map's source image
	this.quad = {
		width: 300,
		height: 300
	};

	this.images = new Array();
	this.ctx = getMapContext();
}

// load map's source image
mapClass.prototype.loadResource = function(loader) {
	var baseName = "img/" + this.mapId.toString() + "/";
	var xCount = Math.ceil((this.width * grid.width ) / this.quad.width);
	var yCount = Math.ceil((this.height * grid.width) / this.quad.height);
	for(var i = 0; i < xCount; i++) {
		this.images[i] = new Array();
		for(var j = 0; j < yCount; j++) {
			var imgName = baseName + j.toString() + "_" + i.toString() + ".jpg";
			this.images[i][j] = loader.addImage(imgName);
		}
	}
}

// show the map
mapClass.prototype.show = function() {
	var leftMax = this.width - this.sight.width * 2;
	var upMax = this.height - this.sight.height * 2;
	this.left = Math.max(0, this.pos.x - this.sight.width);
	this.left = Math.floor(Math.min(this.left, leftMax));
	this.up = Math.max(0, this.pos.y - this.sight.height);
	this.up = Math.floor(Math.min(this.up, upMax));
	var right = Math.floor(this.left + this.sight.width * 2);
	var down = Math.floor(this.up + this.sight.height * 2);
	
	//cal map's index
	var xStart = Math.floor((this.left * grid.width) / this.quad.width);
	var xEnd = Math.floor((right * grid.width) / this.quad.width);
	var yStart = Math.floor((this.up * grid.height) / this.quad.height);
	var yEnd = Math.floor((down * grid.height) / this.quad.height);
	
	//draw the map
	var sWidth, sHeight;
	var flipx = (this.left * grid.width) % this.quad.width;
	var flipy = (this.up * grid.height) % this.quad.height;
	for(var i = xStart, x = 0; i <= xEnd; i++, x += sWidth){
		for(var j = yStart, y = 0; j <= yEnd; j++, y += sHeight){
			//cal split position
			var sx = 0;
			var sy = 0;
			if(i == xStart)	sx = flipx;
			if(j == yStart)	sy = flipy;
			sWidth = this.quad.width - sx, sHeight = this.quad.height - sy;
			this.ctx.drawImage(this.images[i][j], sx, sy, sWidth, sHeight, x, y, sWidth, sHeight);
		}
	}
}

// map's moving
// offsetX,offsetY present upleft pos
// return map's upleft pos
mapClass.prototype.moveTo = function(newPos) {
	if(newPos != this.pos) {
		this.pos.x = newPos.x;
		this.pos.y = newPos.y;
		this.show();
	}
}

// change mouse pos to map pos
mapClass.prototype.offset2pos = function(offsetX, offsetY) {
	var gridX = Math.floor(offsetX / grid.width) + this.left;
	var gridY = Math.floor(offsetY / grid.height) + this.up;
	return {x: gridX, y: gridY};
}

function getMapContext()
{
	var canvas = document.getElementById("game_map");
    var ctx = 0;
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
	}
	return ctx;
}

/* 
 * ********************
 *	map's help functions
 * ********************
 */

function drawGrid() {
	var ctx = document.getElementById("debug_canvas").getContext("2d");
	ctx.strokeStyle = "rgb(255,0,0)";
	ctx. setLineWidth(2);
	ctx.beginPath();
	for(var i = 0; i < 600; i += grid.height) {
		ctx.moveTo(0,i);
		ctx.lineTo(1200,i);
	}
	ctx.stroke();

	ctx.beginPath();
	for(var i = 0; i < 1200; i += grid.width) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, 600);
	}
	ctx.stroke();
}
