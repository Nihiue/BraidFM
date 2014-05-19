var setupBraidFM_Embed=function ()
{	
	function getLyrics()
	{
		      var tmp=document.getElementById("playerpanel-lyrics").children;
		      var tmplen=tmp.length;
		      var lyrics=["","",""];
		      for (var idx=0;idx<tmplen;idx++)
		      {
		      	if(tmp[idx].classList[0]=="current")
		      	{
		      		lyrics[0]=idx>0?tmp[idx-1].innerText:"";
		      		lyrics[1]=tmp[idx].innerText;
		      		lyrics[2]=idx+1<tmplen?tmp[idx+1].innerText:"";
		      		break;
		      	}		      			      
		      }
		      return lyrics;
	}
	function getInfo()
	{
			var info={};  		  
	      	info.song=document.getElementById("playerpanel-songname").innerText;
	      	info.time=document.getElementById("playerpanel-timeinfo").innerText;
	      	info.album=document.getElementById("playerpanel-albumname").innerText;	      	
	      	info.artist=document.getElementById("playerpanel-artistname").innerText; 
	      	info.lyrics=getLyrics();
	      	return info;
	}
	function sendLogInfo(loginfo)
	{
		window.parent.postMessage({Braid_Msg_From_Embed:{embedLog:loginfo}},"*"); 
	}

	function postStatus(){
		var st=getInfo();
		if(document.getElementById("playerpanel-btnplay").classList[2]=="pause")
		    	st.isplaying=true;
		else
				st.isplaying=false;
		st.timeStamp=(new Date()).getTime();
		window.parent.postMessage({Braid_Msg_From_Embed:{status:st}},"*");
	}

	var embedMsgHandler = function(e) {
	      var msg=e.data.Braid_Msg_From_BG;
	      if(typeof(msg)=="undefined")
	      		return true;	      
	      switch(msg.action)
	      {
	      	case "click":
		      	var d=document.getElementById(msg.targetId)
		        if(d)
		        	d.click();	        
		        else 	        
		        	sendLogInfo("click action failed:not found-"+msg.targetId);
		        break;    	
		    case "start_post_status":
				if(braidFM_embed_timer==undefined)
				{
					braidFM_embed_timer=window.self.setInterval(postStatus,500);
					sendLogInfo("start posting status");		    	
				}
				break;
		    case "stop_post_status":
		   		if(!(braidFM_embed_timer==undefined))
		   		{
		   			sendLogInfo("stop posting status");
		   			window.self.clearInterval(braidFM_embed_timer);
		   			braidFM_embed_timer=undefined;
		   		}		    		
		    	break;
		    case "void":
		    	break;
		   	default:
		   		 sendLogInfo("unknown action-"+msg.action);
	      }   
	    
	};    

	window.addEventListener('message',embedMsgHandler, false);
	sendLogInfo("embed_ready.");
}
if(window.top!=window.self)
{
	braidFM_embed_timer=undefined;
	setupBraidFM_Embed();
}