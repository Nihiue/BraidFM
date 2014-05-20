var embedConnection;
var player_iframe;
var MyPlayer={isOn:false,channelList:undefined,status:undefined,songDetail:undefined};

var push_UI_update=function()
{
	var ws=chrome.extension.getViews({type:"popup"});
	if (ws.length<1)
		return;
	var info=MyPlayer.getUI_Info();
	for(var idx in ws)
	{
		if(ws[idx].updateUI)
			ws[idx].updateUI(info);
	}
}

var embedListener=function(msg)
{
	MyPlayer.isOn=true;
	if(MyPlayer.channelList==undefined&&msg.channelList==undefined)
	  	embedConnection.postMessage({action: "post_channel_list"});

	if(msg.init)	{
		embedConnection.postMessage({action: "begin"});
	}

	else if(msg.status)	{
  		MyPlayer.status=msg.status;
  		if(msg.status.songDetail)
  		{
  			console.log("%c new Song: "+msg.status.songDetail.song,"color:green");  
  			MyPlayer.songDetail=msg.status.songDetail;

  		}
  		push_UI_update();
	}	
	else if(msg.channelList)	{
		MyPlayer.channelList=msg.channelList;
		MyPlayer.isLoggedin=msg.isLoggedin;
		push_UI_update();
	}

	if(msg.embedLog)	  		
		console.log("%c["+((new Date()).toLocaleString())+"] -Embed Log: "+msg.embedLog,"color:blue");  	
}

var embedClosdListener=function()
{
	console.log("%c Embed Disconnected.","color:red");  
	embedConnection=undefined;
	MyPlayer.turn_Off();
}
MyPlayer.turn_On=function()
{
	if(player_iframe==undefined)
		{
			player_iframe=document.createElement("iframe");
			player_iframe.src="http://fm.baidu.com/?embed";
			document.body.appendChild(player_iframe);
		}
}

MyPlayer.turn_Off=function()
{
		if(!(player_iframe==undefined))
		{	
			document.body.removeChild(player_iframe);
			player_iframe=undefined;	
			MyPlayer.isOn=false;	
			MyPlayer.channelList=undefined;	
		}		
}

MyPlayer._do=function(command)
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
MyPlayer.toChannel=function(ch_id)
{
	embedConnection.postMessage({"action":"click","targetId":ch_id});
}
MyPlayer.getUI_Info=function()
{	
	var info={};
	if(player_iframe==undefined)	
		info.stage="off";	
	else if(MyPlayer.isOn)	
		info.stage="on";	
	else 
		info.stage="loading";
	info.status=MyPlayer.status;
	info.isLoggedin=MyPlayer.isLoggedin;
	return info;
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
