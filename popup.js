var FMUI={}
var currentUIStage="";
var currentUI_loggedin=true;
var currnetSongDisplayed=undefined;
var channel_menu_stage="hidden";//showing , hidding 


function updateSongDetail(detail,currnet)
{
  if(!detail||detail.song!=currnet)
  {  
    FMUI.text_album.innerText="";
    FMUI.text_artist.innerText="";
    FMUI.text_lyrics.innerHTML="";
    FMUI.cover_img.src="cover.png";
    return;
  }  
  FMUI.text_lyrics.innerHTML=detail.lyrics;
  FMUI.text_album.innerText=detail.album;
  FMUI.text_artist.innerText=detail.artist;
  FMUI.cover_img.src=detail.cover;
  currnetSongDisplayed=detail.song;
}

function cacheUIctls()
{  
    var FMUIlist=["btn_switch","btn_channel","btn_love","btn_skip","btn_hate",
                    "btn_play","text_song","text_time","text_album",
                    "text_artist","text_lyrics","player_panel","cover_img","container","sub_header","channel_menu"];    
  for(var idx in FMUIlist)
  {
    var i=FMUIlist[idx];
    FMUI[i]=document.getElementById(i);
  }     
}

function switchUI_loggedin(isLoggedin) 
{
    var ctlset=document.getElementsByClassName("loggedin");
       if(isLoggedin==true)
        {
            for(var idx in ctlset)
               if(ctlset[idx].style)
                  ctlset[idx].style.display="inline-block";        
            currentUI_loggedin=true;
        }
        else
        {
            for(var idx in ctlset)
                if(ctlset[idx].style)
                    ctlset[idx].style.display="none";        
            currentUI_loggedin=false;
        }
}
function switchToUIStage(stage)
{
    currentUIStage=stage;   
    if(stage=="off")
    {
    FMUI.btn_channel.style.display="none";
    if(FMUI.container.style.height!="80px")
          FMUI.container.style.height="80px";  
    FMUI.sub_header.innerText="Version : 0.1.0";

    }
    else if(stage=="on")
    {
      FMUI.sub_header.innerText="Channel:";
      FMUI.btn_channel.style.display="inline-block";
      if(FMUI.container.style.height!="450px")
          FMUI.container.style.height="450px";   
    }
    else if(stage=="loading")
    { 
       if(FMUI.container.style.height!="450px")
          FMUI.container.style.height="450px";   
       FMUI.text_song.innerText="Loading...";
    }
}


function updateUI(info)
{
    var stage=info.stage;
    if(stage!=currentUIStage)
        switchToUIStage(stage);
    if(stage=="on")
    {      
        if(currentUI_loggedin!=info.isLoggedin)
        {
            switchUI_loggedin(info.isLoggedin);
        }        
        var embedInfo=info.status;        
        if(embedInfo)
        {
          if(MyPlayer.channelList&&MyPlayer.channelList[embedInfo.channel_id])
          {
            FMUI.sub_header.innerText="Channel : "+MyPlayer.channelList[embedInfo.channel_id];
          }
            if(currnetSongDisplayed!=embedInfo.song)
                updateSongDetail(MyPlayer.songDetail,embedInfo.song);
            FMUI.btn_play.innerText=embedInfo.isplaying?"Pause":"Play";      
            FMUI.btn_play.disabled=false;
        
            if(embedInfo.isloved)
            {
                FMUI.btn_love.innerText="Loved";              
            }
            else
            {
                FMUI.btn_love.innerText="Love";              
            }
            FMUI.text_song.innerText=embedInfo.song;
            FMUI.text_time.innerText=embedInfo.time;
            if(embedInfo.lyricsID&&embedInfo.lyricsID.indexOf("lyrics-li-")>-1)
            {         
             var cur_line= document.getElementById(embedInfo.lyricsID);   
             if(cur_line&&!cur_line.classList.contains("lyrics_current_line")&&cur_line.innerText.trim()!="")
              {

                    var tmp=document.getElementsByClassName("lyrics_current_line")[0];
                    if(tmp)
                          tmp.classList.remove("lyrics_current_line");
                    cur_line.classList.add("lyrics_current_line");               
                    FMUI.text_lyrics.style.top="-"+cur_line.offsetTop+"px";                        
              } 
            }
        }      
    }
}


function globalClickHandler(evt)
{ 
  var obj=evt.target;
  /*"btn_switch","btn_channel","btn_love","btn_skip","btn_hate",
                    "btn_play","*/
  if(channel_menu_stage=="showing")
  {
    if(obj.id.indexOf("braid_channel_menu")>-1)
    {
      var ch_id=obj.id.replace("braid_channel_menu","");
      MyPlayer.toChannel(ch_id);
    }
    FMUI.channel_menu.style.opacity=0;
    channel_menu_stage="hidding";        
    setTimeout(function(){FMUI.channel_menu.style.display="none";channel_menu_stage="hidden";},500);     
  }

  switch(obj.id)
  {
    case "btn_switch":
       if(MyPlayer.getUI_Info().stage=="off")
        {
            MyPlayer.turn_On();
            switchToUIStage("loading");
        }
        else
        {
            MyPlayer.turn_Off();
            switchToUIStage("off");
        }
        break;
  
    case "btn_love":
        FMUI.btn_love.innerText=MyPlayer.status.isloved?"Love":"Loved";
        MyPlayer._do("love");  
        break;
    case "btn_skip":
        updateSongDetail(false,false);
        MyPlayer._do("skip");       

        break;
    case "btn_hate":
        MyPlayer._do("hate");
        break;
    case "btn_play":
        FMUI.btn_play.innerText=MyPlayer.status.isplaying?"Pause":"Play";
        MyPlayer._do("play");
        break;
    case "btn_channel":
       if(channel_menu_stage=="hidden")
       {
        var str="";
        for(var ch in MyPlayer.channelList)
        {
          if(!MyPlayer.isLoggedin && (ch.indexOf("private")>-1 || ch.indexOf("lovesongs")>-1))
          {
            continue; 
          }
          var name=MyPlayer.channelList[ch];
         if(name)
           str+="<a id='"+"braid_channel_menu"+ch+"' href='#' class='header-btn'>"+name+"</a>";
        }
        FMUI.channel_menu.innerHTML=str;
        channel_menu_stage="showing";
        FMUI.channel_menu.style.display="block";                
        setTimeout(function(){FMUI.channel_menu.style.opacity=1;},0);
       } 
       break;
    case "appname":
       window.open("http://braid.sinaapp.com/");
       break;
    default:    

  }

   /* var playEventHandler=function()
    {
        MyPlayer.play();
    }
    var switchEventHandler=function()
    {
       
    }
    FMUI.btn_switch.onclick=switchEventHandler;   */
}


var MyPlayer = chrome.extension.getBackgroundPage().MyPlayer;
cacheUIctls();
updateUI(MyPlayer.getUI_Info());
FMUI.container.style.transition="height 0.5s ease-in-out";
document.addEventListener("click",globalClickHandler,false);
