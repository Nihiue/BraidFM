var Braid_FM_Version="0.2.0";
var FMUI={}
var currentUIStage="";
var currentUI_loggedin=true;
var currnetSongDisplayed=undefined;
var channel_menu_stage="hidden";//showing , hidding 
var pop_up_opened;
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
    var isInWindow=window.self.location.href.indexOf("win_mode")>-1?true:false;
    if(isInWindow)
    {
      FMUI.container.style.height="450px";        
    }
    currentUIStage=stage;   
    if(stage=="off")
    {   
      FMUI.btn_channel.style.display="none";
      if(!isInWindow&&FMUI.container.style.height!="80px")
            FMUI.container.style.height="80px"; 
      else if(isInWindow)
            FMUI.player_panel.style.display="none";
      FMUI.sub_header.innerText="Version : "+Braid_FM_Version;  
    }
    else if(stage=="on")
    {      
      FMUI.sub_header.innerText="Channel:";
      FMUI.btn_channel.style.display="inline-block";
      if(!isInWindow&&FMUI.container.style.height!="450px")
          FMUI.container.style.height="450px";   
      else if(isInWindow)
          FMUI.player_panel.style.display="block";
    }
    else if(stage=="loading")
    { 
       if(!isInWindow&&FMUI.container.style.height!="450px")
          FMUI.container.style.height="450px";   
       else if(isInWindow)
          FMUI.player_panel.style.display="block";
       FMUI.text_song.innerText="Loading...";
       FMUI.sub_header.innerText="Version : "+Braid_FM_Version;
       FMUI.btn_channel.style.display="none";
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
          var MyPlayer=back_page.MyPlayer;
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
  var MyPlayer=back_page.MyPlayer;
  var obj=evt.target;
  if(channel_menu_stage=="showing")
  {
    if(obj.id.indexOf("braid_channel_menu")>-1)
    {
      var ch_id=obj.id.replace("braid_channel_menu","");
      MyPlayer.toChannel(ch_id);
    }
    FMUI.channel_menu.style.left="-550px"; 
    channel_menu_stage="hidden"; 
    return false;
  }

  switch(obj.id)
  {
    case "btn_switch":
       if(back_page.getUI_Info().stage=="off")
        {
            back_page.turnOn();
            switchToUIStage("loading");
        }
        else
        {
            back_page.turnOff();
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
        FMUI.channel_menu.style.left="14px";
       } 
       break;
    case "appname":
       window.open("http://braid.sinaapp.com/");
       break;
    case "cover_img":
                if(!pop_up_opened&&window.self.location.href.indexOf("win_mode")==-1)
                {
                  pop_up_opened=true;
                  chrome.windows.create({
                    width:580,
                    height:485,
                    url: "./popup.html?win_mode",                
                    type: "popup",
                    focused: true,                
                  });    
                  window.close();      
                }
    default:    
  }
   return false;
}

//Begin
  
document.title="Braid FM  - "+Braid_FM_Version;
var back_page = chrome.extension.getBackgroundPage();
cacheUIctls();
updateUI(back_page.getUI_Info());
document.addEventListener("click",globalClickHandler,false);


if(window.self.location.href.indexOf("win_mode")>-1)
{
        function cancelResize(evt)
        {
          if(!window.self.will_cancel_resize)
          {
             console.log("cancel_resize");
             window.self.will_cancel_resiz=true;      
             setTimeout(function(){        
                  window.self.resizeTo(580,485);   
                  setTimeout(function(){window.self.will_cancel_resize=false;},100);
            },300);
          } 
           
        }
        window.addEventListener("resize",cancelResize);
}
else
{
      FMUI.container.style.transition="height 0.5s ease-in-out";
}