var player_iframe;
var latestStatus;
var auto_stop_symbol;
var MyPlayer={isOn:false};

MyPlayer.turnOn=function()
{
	if(player_iframe==undefined)
	{
		player_iframe=document.createElement("iframe");
		player_iframe.src="http://fm.baidu.com/?embed";
		document.body.appendChild(player_iframe);
	}
}
MyPlayer.turnOff=function()
{
	if(!(player_iframe==undefined))
	{	
		document.body.removeChild(player_iframe);
		player_iframe=undefined;	
		MyPlayer.isOn=false;	
		MyPlayer.isEmbedReady=false;		
	}		
}
MyPlayer.play=function()
{
	sendMsg_to_embed({"action":"click","targetId":"playerpanel-btnplay"});
}

MyPlayer.skip=function()
{
	sendMsg_to_embed({"action":"click","targetId":"playerpanel-btnskip"});
}
MyPlayer.love=function()
{
	sendMsg_to_embed({"action":"click","targetId":"playerpanel-btnlove"});
}
MyPlayer.hate=function()
{
	sendMsg_to_embed({"action":"click","targetId":"playerpanel-btnhate"});
}
MyPlayer.UI_sync=function()
{	

	if(player_iframe==undefined)
	{
		return "off";	
		MyPlayer.isOn=false;
	}
	var now=(new Date().getTime())
	if(!MyPlayer.status||!MyPlayer.status.timeStamp||(now-MyPlayer.status.timeStamp)>2000)
		sendMsg_to_embed({"action":"start_post_status"});
	if(MyPlayer.isOn)
	{
		auto_stop_symbol=0;	
		return "on";
	}	
	return "loading";
}
MyPlayer.getStatus=function()
{
	
 	return latestStatus;
}

var sendMsg_to_embed=function(msgobj)
{
	if(MyPlayer.isOn)
	{
		player_iframe.contentWindow.postMessage({"Braid_Msg_From_BG":msgobj},'*');		
	}

}

function bgMsgHandler(e)
{ 
 var msg=e.data.Braid_Msg_From_Embed;
  if(typeof(msg)=="undefined")
      	return true;
  MyPlayer.isOn=true;
  if(msg.status)
  {
  		auto_stop_symbol++;
  		MyPlayer.status=msg.status;
  		if(auto_stop_symbol>20)
  		{
  			sendMsg_to_embed({"action":"stop_post_status"});
  		}
  }
  else if(msg.embedLog)
  {  		
  		console.log("%c["+((new Date()).toLocaleString())+"] -Embed Log: "+msg.embedLog,"color:blue");  			 
  }
}
window.addEventListener('message',bgMsgHandler, false);