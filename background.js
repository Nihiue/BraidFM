var player_iframe;
var MyPlayer={isOn:false,isEmbedReady:false};

MyPlayer.open=function()
{
	if(!MyPlayer.isOn)
	{
		player_iframe=document.createElement("iframe");
		player_iframe.src="http://fm.baidu.com/?embed";
		document.body.appendChild(player_iframe);
		MyPlayer.isOn=true;		

	}
}
MyPlayer.close=function()
{
	if(MyPlayer.isOn)
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

var sendMsg_to_embed=function(msgobj)
{
	if(MyPlayer.isOn&&MyPlayer.isEmbedReady)
	{
		player_iframe.contentWindow.postMessage({"Braid_Msg_From_BG":msgobj},'*');		
	}

}

function bgMsgHandler(e)
{
 
 var msg=e.data.Braid_Msg_From_Embed;
  if(typeof(msg)=="undefined"||!MyPlayer.isOn)
      	return true;
  MyPlayer.isEmbedReady=true;
  if(msg.status)
  		MyPlayer.status=msg.status;
  else if(msg.embedLog)
  		console.log("Embed Log: "+msg.embedLog);
}
window.addEventListener('message',bgMsgHandler, false);