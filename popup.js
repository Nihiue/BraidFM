var FMUI={}
var currentUIStage="";
function cacheUIctls()
{  
    var FMUIlist=["btn_turnon","btn_turnoff","btn_love","btn_skip","btn_hate",
                    "btn_play","text_song","text_time","text_album",
                    "text_artist","text_lyrics_0","text_lyrics_1","text_lyrics_2","player_ctls"];    
  for(var idx in FMUIlist)
  {
    var i=FMUIlist[idx];
    FMUI[i]=document.getElementById(i);
  }        
            
}
function switchToUIStage(stage)
{
    if(stage=="off")
    {
       FMUI.player_ctls.style.display="none";
       FMUI.btn_turnon.disabled=false;
       FMUI.btn_turnoff.disabled=true;
       currentUIStage="off";
    }
    else if(stage=="on")
    {
        FMUI.player_ctls.style.display="block";
        FMUI.btn_turnon.disabled=true;
        FMUI.btn_turnoff.disabled=false;
        currentUIStage="on";
    }
    else if(stage=="loading")
    {
        FMUI.player_ctls.style.display="block";
        FMUI.btn_turnon.disabled=true;
        FMUI.btn_turnoff.disabled=true;
        FMUI.text_time.innerText="Loading...please wait.";
        currentUIStage="loading";
    }
    else
    {
        console.log("Unknown stage:"+stage);
    }
}
function updateUI()
{
    var stage=MyPlayer.UI_sync();
    if(stage!=currentUIStage)
        switchToUIStage(stage);
    if(stage=="on")
    {       
        var embedInfo=MyPlayer.status;
        if(embedInfo)
        {
            FMUI.btn_play.innerText=MyPlayer.status.isplaying?"Pause":"Play";      
            FMUI.btn_play.disabled=false;
            FMUI.text_song.innerText=embedInfo.song;
            FMUI.text_time.innerText=embedInfo.time;
            FMUI.text_album.innerText=embedInfo.album;
            FMUI.text_artist.innerText=embedInfo.artist;
            FMUI.text_lyrics_0.innerText=embedInfo.lyrics[0];
            FMUI.text_lyrics_1.innerText=embedInfo.lyrics[1];
            FMUI.text_lyrics_2.innerText=embedInfo.lyrics[2];    
        }      
    }
    else
    {
     
    }
}
function bindBtnEvent()
{ 
    var playEventHandler=function()
    {
        FMUI.btn_play.disabled=true;
        MyPlayer.play();
    }
    FMUI.btn_turnon.onclick=MyPlayer.turnOn;  
    FMUI.btn_turnoff.onclick=MyPlayer.turnOff;  
    FMUI.btn_play.onclick=playEventHandler;  
    FMUI.btn_skip.onclick=MyPlayer.skip;  
    FMUI.btn_love.onclick=MyPlayer.love;  
    FMUI.btn_hate.onclick=MyPlayer.hate;      
}

var MyPlayer = chrome.extension.getBackgroundPage().MyPlayer;
cacheUIctls();
bindBtnEvent();
updateUI();
setInterval(updateUI,500);
