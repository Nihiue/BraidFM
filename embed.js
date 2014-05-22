var setupBraidFM_Embed=function ()
{	
	var braidFM_embed_last_song="";
	var braidFM_embed_timer;
	var braidFM_conn;
	var braidFM_lastStatus={};
	var braidFM_lastCover;

	braidFM_conn = chrome.extension.connect({name: "Embed_MSG"});
	braidFM_conn.postMessage({init: "Hello"});
	braidFM_conn.onMessage.addListener(function(msg) {
  		switch(msg.action)
  		{
  			case "begin":
  				if(braidFM_embed_timer==undefined)
				{
					braidFM_embed_timer=window.self.setInterval(postStatus,250);
					sendLogInfo("Embed Begin.");		    	
				}
				break;
  			case "click":
		      	var d=document.getElementById(msg.targetId)
		        if(d)
		        	d.click();	        
		        else 	        
		        	sendLogInfo("click action failed:not found-"+msg.targetId);
		        break; 	
		    case "post_channel_list":
		   		   var ch_list=getChannelList();
		   		   if(ch_list)
		   		   {
		   		   		var loggedin;
		   		   		try       {loggedin=$("#user-bar").classList.contains("logined")}
		   		   		catch(ex) {loggedin=false;}
			   		    braidFM_conn.postMessage({"channelList":ch_list,"isLoggedin":loggedin,embedLog:"channelList posted."});
		   		   }
		    	break;
		   	default:
		   		 sendLogInfo("unknown action-"+msg.action);
  		}
  });

	var $=function(selector)
	{	
		if(typeof(selector)!="string")
			return;
		var prefix=selector.charAt(0);
		if(prefix=="#")
			return document.getElementById(selector.slice(1));
		if(prefix==".")
			return document.getElementsByClassName(selector.slice(1));
		return document.getElementsByTagName(selector);
	}
	
	var getLyricsID=function ()
	{
		      var tmp=$(".current");
		      var lyc_id="";
		      for (var idx=0;idx<tmp.length;idx++)
		      {
		      	if(tmp[idx].id.indexOf("lyrics-li-")>-1)
		      	{
		      		lyc_id=tmp[idx].id;
		      		break;
		      	}		      			      
		      }
		      return lyc_id;
	}

	var getSongDetail=function (songName)
	{
		try{			
			var lycs=$("#playerpanel-lyrics").innerHTML;
			if(lycs.length<50)
				return undefined;
			var detail={};
			detail.lyrics=lycs;
			detail.song=$("#playerpanel-songname").innerText;
			detail.cover=""+$("#playerpanel-coverimg").children[0].children[0].src;			
			if(detail.cover.length<20||braidFM_lastCover==detail.cover)
				return undefined;
			braidFM_lastCover=detail.cover;
			detail.album=$("#playerpanel-albumname").innerText;	      	
	      	detail.artist=$(".playerpanel-artistname")[0].innerText; 
			return detail;
			}
		catch(ex)
		{
			return undefined
		}
		  	
	}

	var sendLogInfo=function(loginfo)
	{
		braidFM_conn.postMessage({embedLog:loginfo}); 
	}
	var getChannelList=function()
	{
			var btnset=$(".channel-btn");
			var ch_res={};
			var cnt_res=0;
			for(var idx in btnset)
			{
				var tid=btnset[idx].id+"";
				if(tid.indexOf("channel-btn")<0)
					continue;
				ch_res[tid]=btnset[idx].children[2].children[0].innerText;
				cnt_res++;
			}
			if(cnt_res>5)
				return ch_res;
			return undefined;
	}
	var postStatus=function() {
		try{			
				var info={};			
				info.song=$("#playerpanel-songname").innerText;
		      	info.time=$("#playerpanel-timeinfo").innerText;

		      	var st=$(".channel-btn-current")[0];	      	
		      	info.channel_id=st?st.id:"";
		      	info.lyricsID=getLyricsID();

		      	info.isplaying=$("#playerpanel-btnplay").classList.contains("pause");
		      	info.isloved=$("#playerpanel-btnlove").classList.contains("loved");
				
		      	if(info.song!=braidFM_embed_last_song&&info.song.trim()!="")
		      	{ 
		      		var t=getSongDetail();
		      		if(t)
		      		{	      		
		      			braidFM_embed_last_song=t.song;	      
		      			braidFM_conn.postMessage({status:info,songDetail:t});	
		      			return;			
		      		}	      		
		      	}		      

		      	for(var key in info)
		      	{
		      		if(!info.hasOwnProperty(key))
		      			continue;
		      		if(info[key]!=braidFM_lastStatus[key])
		      		{
		      			braidFM_lastStatus=info;
		      			braidFM_conn.postMessage({status:info});
		      			return;
		      		}
		      	}

				
		}
		catch(ex)
		{
			sendLogInfo(""+ex);
		}
	}
}

if(window.location.hash.indexOf("BraidFM")!=-1)
{	
	setupBraidFM_Embed();
}
