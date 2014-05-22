var embedConnection;
var player_iframe;
var MyPlayer;
var UI_update_counter=0;
function Player()
{
	this.isOn=false;
	this.channelList=false;
	this.status=false;
	this.songDetail=false;
	this.isLoggedin=false;
	this._do=function(command)
	{
		if(!embedConnection)
			return false;
		switch(command) 
		{
			case "play":
				embedConnection.postMessage({"action":"click","targetId":"playerpanel-btnplay"});
				break;

			case "skip":
				embedConnection.postMessage({"action":"click","targetId":"playerpanel-btnskip"});			
				break;

			case "hate":
				embedConnection.postMessage({"action":"click","targetId":"playerpanel-btnhate"});
				break;

			case "love":
				embedConnection.postMessage({"action":"click","targetId":"playerpanel-btnlove"});
				break;

			default:
				console.log("Uknown command:"+command);
				return false;
		}
	}
	this.toChannel=function(ch_id)
	{
		embedConnection.postMessage({"action":"click","targetId":ch_id});
	}
	return this;
}



var embedListener=function(msg)
{
	if(!MyPlayer)
		return;
	MyPlayer.isOn=true;
	if(!MyPlayer.channelList&&!msg.channelList)
	  	embedConnection.postMessage({action: "post_channel_list"});

	if(msg.init)	{
		embedConnection.postMessage({action: "begin"});
	}

	else if(msg.status)	{
  		MyPlayer.status=msg.status;
  		if(msg.songDetail)
  		{
  			console.log("%c new Song: "+msg.songDetail.song,"color:green");  
  			MyPlayer.songDetail=msg.songDetail;
  		}
  		push_UI_update();
	}	
	else if(msg.channelList)	{
		MyPlayer.channelList=msg.channelList;
		MyPlayer.isLoggedin=msg.isLoggedin;
	}

	if(msg.embedLog)	  		
		console.log("%c["+((new Date()).toLocaleString())+"] -Embed Log: "+msg.embedLog,"color:blue");  	
}
var getUI_Info=function()
{	
	var info={};
	if(!MyPlayer)	
		info.stage="off";	
	else if(MyPlayer.isOn)	
	{
		info.stage="on";
		info.status=MyPlayer.status;
		info.isLoggedin=MyPlayer.isLoggedin;
	}	
	else 
		info.stage="loading";	
	return info;
}
function push_UI_update()
{
	
//	UI_update_counter++;
//	if(UI_update_counter%2==0)
//		console.log(UI_update_counter);
	var ws=chrome.extension.getViews();
	if (ws.length<1)
		return;
	UI_update_counter++;
	var info=getUI_Info();
	var has_win=false;
	for(var idx in ws)
	{
		if(ws[idx]!=window.self&&ws[idx].updateUI)
		{	
			ws[idx].updateUI(info);
			if(ws[idx].location.href.indexOf("win_mode")>-1)
			{
				if(has_win)
					ws[idx].close();
				else
					has_win=true;
			}				
		}			
	}
}

var embedClosdListener=function()
{
	console.log("%c Embed Disconnected.","color:red");  
	embedConnection=undefined;
	turnOff();
}

function turnOn()
{
	if(player_iframe==undefined)
	{
		MyPlayer=new Player();
		player_iframe=document.createElement("iframe");
		player_iframe.src="http://fm.baidu.com/#BraidFM";
		document.body.appendChild(player_iframe);
		push_UI_update();
	}
}

function turnOff()
{
		if(!(player_iframe==undefined))
		{	
			document.open();
			document.close();
			player_iframe=undefined;	
			MyPlayer=undefined;
			push_UI_update();
		}		
}

chrome.extension.onConnect.addListener(function(port) {
  if(port.name == "Embed_MSG"&&embedConnection==undefined)
  {		
  		embedConnection=port;
		port.onMessage.addListener(embedListener)
		port.onDisconnect.addListener(embedClosdListener);
  }
  else
  {
  		port.disconnect();
  }
});
