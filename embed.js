function setupBraidFM_Embed()
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
	var embedMsgHandler = function(e) {
	      var msg=e.data.Braid_Msg_From_BG;
	      if(typeof(msg)=="undefined")
	      		return true;
	      if(msg.action=="click")
	      {
	        var d=document.getElementById(msg.targetId)
	        if(d)
	        	d.click();
	      }    
	    
	};    
	var postStatus=function(){
		var st=getInfo();
		if(document.getElementById("playerpanel-btnplay").classList[2]=="pause")
		    	st.isplaying=true;
		else
				st.isplaying=false;
		window.parent.postMessage({Braid_Msg_From_Embed:{status:st}},"*");
	}
	window.addEventListener('message',embedMsgHandler, false);
	window.parent.postMessage({Braid_Msg_From_Embed:{embedLog:"Now Loaded;"}},"*"); 
	setInterval(postStatus,500);    
}

setupBraidFM_Embed();