function Player() {

    this.names = "";
	this.id = 0;
	this.talk="";
	this.point=0;
	this.addPoint=0;
	//player's pos
	this.pos = {
		x: 10,
		y: 10
	};
	
	this.direction = Direction.DOWN;
	this.state = PlayerState.STOP;
	this.speed = 50;	// moving accross one grid
	this.movePath = new Array();
	
	this.imageIndex = 0;
}
Player.prototype.init = function(){
    this.names = "";
	this.id = 0;
    this.pos = {
		x: 10,
		y: 10
	};
	this.direction = Direction.DOWN;
	this.state = PlayerState.STOP;
	this.speed = 50;
	this.movePath = new Array();	
	this.imageIndex = 0;
    
}
/* 
 * ***************
 * prototype functions
 * ***************
 */
// cal moving path
Player.prototype.calcMovePath = function(dx, dy) {
	// clear previous path
	this.movePath = [];
	var x = this.pos.x;
	var y = this.pos.y;
	
	var start = graph.nodes[y][x];
	var end = graph.nodes[dy][dx];
	this.movePath = astar.search(graph.nodes, start, end);
	//console.log("a star:");
	//console.log(this.pos.x.toString() + "," + this.pos.y.toString());
	//console.log(this.movePath);
	//console.log([dx,dy]);
}
// cal player's next action
Player.prototype.nextAction = function() {
    var nextGrid = 0;
	switch(this.state){
		case PlayerState.MOVE:
			if(this.movePath.length == 0){
				this.state = PlayerState.STOP;
				this.imageIndex = 0;
			}else{
				nextGrid = this.movePath.shift();
			}
			break;
		case PlayerState.STOP:
			if(this.movePath.length != 0){
				this.state = PlayerState.MOVE;
				nextGrid = this.movePath.shift();
				this.imageIndex = 0;
			}
			break;
		}
		// change pos based on path
		//this._nextPos();
		if(nextGrid === 0){
	    }else{
		    this._calcDirect(nextGrid.y, nextGrid.x);
		    this.pos.x = nextGrid.y;
		    this.pos.y = nextGrid.x;
		}
		this._nextImageIndex();
}

/*
 * private functions
 */
 
Player.prototype._nextImageIndex = function() {
	var indexMax = 0;
	this.imageIndex ++;
	switch(this.state) {
		case PlayerState.DIE: 
			indexMax = 4;
			break;
		default :
			indexMax = 6;
	}
	if(this.imageIndex == indexMax)
		this.imageIndex = 0;
}

Player.prototype._nextPos = function() {
	if(this.state == PlayerState.MOVE) {
		switch(this.direction){
			case Direction.DOWN :
				this.pos.y += 1;
				break;
			case Direction.UP :
				this.pos.y -= 1;
				break;
			case Direction.LEFT :
				this.pos.x -= 1;
				break;
			case Direction.RIGHT :
				this.pos.x += 1;
				break;
		}
	}
}

Player.prototype._calcDirect = function (x, y) {
    if(this.pos.x < x){
        if(this.pos.y < y){
            this.direction = Direction.RIGHT_DOWN;
        }else if(this.pos.y == y){
            this.direction = Direction.RIGHT;
        }else{
            this.direction = Direction.RIGHT_UP;
        }
    }else if(this.pos.x == x){
        if(this.pos.y < y){
            this.direction = Direction.DOWN;
        }else{
            this.direction = Direction.UP;
        }
    }else{
        if(this.pos.y < y){
            this.direction = Direction.LEFT_DOWN;
        }else if(this.pos.y == y){
            this.direction = Direction.LEFT;
        }else{
            this.direction = Direction.LEFT_UP;
        }
    }
}
