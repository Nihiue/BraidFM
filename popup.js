var UIctls={}
function cacheUIctls()
{  
    var UIctlslist=["btn_open","btn_close","btn_love","btn_skip","btn_hate",
                    "btn_play","text_song","text_time","text_album",
                    "text_artist","text_lyrics_0","text_lyrics_1","text_lyrics_2","player_ctls"];    
  for(var idx in UIctlslist)
  {
    var i=UIctlslist[idx];
    UIctls[i]=document.getElementById(i);
  }        
            
}
function updateUI()
{
    if(MyPlayer.isOn)
    {
        UIctls.player_ctls.style.display="block";
        UIctls.btn_open.disabled=true;
        UIctls.btn_close.disabled=false;
        var embedInfo=MyPlayer.status;
        if(embedInfo)
        {
            UIctls.btn_play.innerText=MyPlayer.status.isplaying?"Pause":"Play";      
            UIctls.btn_play.disabled=false;
            UIctls.text_song.innerText=embedInfo.song;
            UIctls.text_time.innerText=embedInfo.time;
            UIctls.text_album.innerText=embedInfo.album;
            UIctls.text_artist.innerText=embedInfo.artist;
            UIctls.text_lyrics_0.innerText=embedInfo.lyrics[0];
            UIctls.text_lyrics_1.innerText=embedInfo.lyrics[1];
            UIctls.text_lyrics_2.innerText=embedInfo.lyrics[2];    
        }      
    }
    else
    {
       UIctls.player_ctls.style.display="none";
       UIctls.btn_open.disabled=false;
       UIctls.btn_close.disabled=true;
    }
}
function bindBtnEvent()
{ 
    var playEventHandler=function()
    {
        UIctls.btn_play.disabled=true;
        MyPlayer.play();
    }
    UIctls.btn_open.onclick=MyPlayer.open;  
    UIctls.btn_close.onclick=MyPlayer.close;  
    UIctls.btn_play.onclick=playEventHandler;  
    UIctls.btn_skip.onclick=MyPlayer.skip;  
    UIctls.btn_love.onclick=MyPlayer.love;  
    UIctls.btn_hate.onclick=MyPlayer.hate;      
}

var MyPlayer = chrome.extension.getBackgroundPage().MyPlayer;
cacheUIctls();
bindBtnEvent();
updateUI();
setInterval(updateUI,500);
