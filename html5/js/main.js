var map;
var player_mgr;
var enemysmgr;
var player = new Player();
var ws;
var isLogin = false;
var wingsSound; 
var firstlayer =true;
function start()
{
	map = new mapClass(11001);
	player_mgr = new PlayerMgr();
	enemysmgr = new EnemyMgr();
	// Create the loader and queue our 3 images. Images will not 
	// begin downloading until we tell the loader to start. 
	//load all resource
	map.loadResource(loader);
	player_mgr.loadResource(loader);
	enemysmgr.loadResource(loader);
	effect.loadResource(loader);
	
	//add "debug" canvas onclick
	var playerCanvas = document.getElementById("debug_canvas");
	playerCanvas.onmouseup = onClick;
	effect.ctx = document.getElementById("debug_canvas").getContext("2d")
	//add login button onclick 	
    var butt= document.getElementById("login");
	butt.onclick = login_game;
	//add say button onclick
	var butt2= document.getElementById("say");
	butt2.onclick = PlayerSay;
	// callback that will be run once images are ready 
	loader.addCompletionListener(function() { 
		player_mgr.start();
		player_mgr.add(player);
		setInterval(redraw, 200);
		enemysmgr.start();
		for(var i=0;i<20;i++)
		{
            var newEnemy = new Enemy();
            enemysmgr.add(newEnemy);			
		}
		map.show();
	});  
	// begin downloading images
	loader.start(); 
	// load music
	wingsSound = new Audio('media/music.mp3');
    wingsSound.volume = 0.9;
    wingsSound.addEventListener('ended', function() { 
	// loop wings sound
        this.currentTime = 0;
        this.play();
    }, false);
    wingsSound.play();
}

function redraw() {
	map.moveTo(player_mgr.players[0].pos);
	//redraw all players
	player_mgr.left = map.left;
	player_mgr.top = map.up;
	player_mgr.redraw();
	//redraw all enemies
	enemysmgr.left = map.left;
	enemysmgr.top = map.up;
	enemysmgr.redraw();
	//change effect's left and up
	effect.left = map.left;
	effect.top = map.up;
}

function onClick(Event) {
	var tmpos = getEventPos(Event);	
	var pos = map.offset2pos(tmpos.x, tmpos.y);
	effect.onMove(pos.x, pos.y);
	var name = player_mgr.players[0].names;
	ws.send("pos" + ":" + name +":"+ pos.x.toString() + "," + pos.y.toString());
	for(var i=0;i<20;i++)
	{
	    if(pos.x==enemysmgr.enemys[i].pos.x && pos.y==enemysmgr.enemys[i].pos.y)
	    {
			window.open("superMario/game/step8.html");
//	        alert("Fight for Money!");
//			iScore=0;
//			inFire=true;
//			ws.send("pt" + ":" + player_mgr.players[0].names + ":-5");
//			document.getElementById("map").style.display = "none";
//			document.getElementById("players").style.display = "none";
//			document.getElementById("enemys").style.display = "none";
//			document.getElementById("fire").style.display = "block";
//			document.getElementById("debug_canvas").width = "50";
//			document.getElementById("debug_canvas").height = "50";
//	        break;
	    }
	}
}
// login or logout game
function login_game() {
	if(isLogin)//logout game
	{
	    ws.close();
	}
	else//login game
	{
	    try {
		    var server = document.getElementById("server").value;
		    var host = "ws://" + server;
		    ws = new WebSocket(host);
		    var login_name = document.getElementById("username").value;
		    ws.onopen = function() {
			// websocket login successfully.		
			    ws.send("login:" + login_name);
			    document.getElementById("login").value = "LOG_OUT";
			    isLogin=true;
		    }
		
		    ws.onmessage = function(msg) {
			    MessageSwitch(msg.data); 
		    }
		
		    ws.onclose = function() {
			    //change login button value to LOG_OUT
		        document.getElementById("login").value = "LOG_IN";
			    isLogin=false;
				//clear players and redraw
				player_mgr.players = new Array();
				player_mgr.redraw();
		    }
		
		    ws.onerror = function() {
		    }
	    }catch(exception){
		    alert("<p>Error:" + exception.toString() + "</p>");
		    //return false;
	    }
	}
}
//switch received message
function MessageSwitch(Text){
    document.getElementById("message").value = Text;
	var s1 = Text.indexOf(":");
	switch(Text.substring(0,parseInt(s1))){
	    case "pos" :
		    Move(Text.substring(parseInt(s1)+1));//receive player's postion message
			break;
		case "in" :
		    PlayerIn(Text.substring(parseInt(s1)+1));//receive player's login message
			break;
		case "out" :
		    PlayerOut(Text.substring(parseInt(s1)+1));//receive player's logout message
			break;
		case "say" :
		    PlayerTalk(Text.substring(parseInt(s1)+1));//receive player's talk message
			break;
		case "pt" :
		    PlayerPoint(Text.substring(parseInt(s1)+1));//receive player's talk message
		break;
	}
}
function Move(Text) {           
	var playerNum =0;
	var s1 = Text.indexOf(":");
	var userName = Text.substring(0,parseInt(s1));
	var addPlayer = true;
	//check if the userName is existed
	for(var i=0;i<player_mgr.players.length;i++)
	{
		var isName = player_mgr.players[i].names;
		if(isName==userName)
		{
			playerNum=i;
			addPlayer =false;
			break;
		}		    
	}
	//if there is no such username, add a player
	if(addPlayer)//add free player in players(player.name=="")
	{
	    for(var i=0;i<player_mgr.players.length;i++)
	    {
		    var blankname = player_mgr.players[i].names;
		    if(blankname=="")
		    {
			    playerNum=i;
				player_mgr.players[i].init();
				player_mgr.players[i].names =userName;				
			    addPlayer =false;
			    break;
		    }		    
	    }
	}
    if(addPlayer)//add new player to players
	{			
	    var newPlayer = new Player();
		player_mgr.add(newPlayer);
		playerNum = player_mgr.players.length-1;
		player_mgr.players[playerNum].names =userName;
	}
	var s2 = Text.indexOf(",");
	var x = Text.substring(parseInt(s1)+1,parseInt(s2));
    var y = Text.substring(parseInt(s2)+1);
	//clear player's talk if player move
	player_mgr.players[playerNum].talk ="";
	player_mgr.players[playerNum].addPoint =0;
	player_mgr.players[playerNum].calcMovePath(parseInt(x), parseInt(y));
	player_mgr.redraw();
};

function PlayerIn(Text){
    var addPlayer = true;
    for(var i=0;i<player_mgr.players.length;i++)//check if there is a free player in players(player.name=="")
	{
		var isName = player_mgr.players[i].names;
		if(isName=="")
		{
		    player_mgr.players[i].init();
			player_mgr.players[i].names =Text;			
			addPlayer = false;
			break;
		}		    
	}
	if(addPlayer)//add new player to players
	{
	    var newPlayer = new Player();
	    player_mgr.add(newPlayer);
	    player_mgr.players[player_mgr.players.length-1].names =Text;
	}    
	player_mgr.redraw();
}
function PlayerOut(Text){
    //check if the userName is existed
	for(var i=0;i<player_mgr.players.length;i++)
	{
		var isName = player_mgr.players[i].names;
		if(isName==Text)
		{
			player_mgr.players[i].names ="";
			player_mgr.redraw();
			break;
		}		    
	}
}
function PlayerTalk(Text){
    var s1 = Text.indexOf(":");
	var userName = Text.substring(0,parseInt(s1));
    //check if the userName is existed
	for(var i=0;i<player_mgr.players.length;i++)
	{
		var isName = player_mgr.players[i].names;
		if(isName==userName)
		{
			player_mgr.players[i].talk =Text.substring(parseInt(s1)+1);
			player_mgr.redraw();
			break;
		}		    
	}
}
function PlayerPoint(Text){
    var s1 = Text.indexOf(":");
	var userName = Text.substring(0,parseInt(s1));
    //check if the userName is existed
	for(var i=0;i<player_mgr.players.length;i++)
	{
		var isName = player_mgr.players[i].names;
		if(isName==userName)
		{
			player_mgr.players[i].addPoint =10 * parseInt(Text.substring(parseInt(s1)+1));
			player_mgr.players[i].point += player_mgr.players[i].addPoint;
			player_mgr.redraw();
			break;
		}		    
	}
}
function PlayerSay(){
   var mess = document.getElementById("talk").value;
   ws.send("say" + ":" + player_mgr.players[0].names + ":"+ mess);
}