(function(){
  var namespace = ["name","author"], domain = `${window.location.protocol}//${window.location.host}${window.location.pathname}`, key = {}, modsinfo, lastDate;
  $("#home")[0].href = domain;
  var ModInfo = function(data,key)
  {
    var state = ["down","private","active"][data.link.state||0];
    this.html = `<div class="ModTab" id='${data.name||"unknown"}'>
      <div style="float:left"><img src="${data.img||"img/default.png"}"></div>
      <table>
        <tr><td><h3><a class="${state}" title="This link is currently ${state}" ${(data.link.url)?("href='"+data.link.url+"'"):""} target="_blank">${(key.name)?data.name.replace(key.name,"gi",function(v){return `<mn>${v}</mn>`}):data.name}<sup>${data.version||""}</sup></a></h3></th></tr>
        <tr><td><h5>${data.author.map(data => `<a ${(data.link)?("href='"+data.link+"'"):""} target="_blank">${(data.name||[]).map(data => (key.author)?data.replace(key.author,"gi",function(v){return `<ma>${v}</ma>`}):data).join("/")}</a>`).join()}</h5></td></tr>
        ${(data.official)?("<tr "+((data.official<2)?"style='color:yellow'":"")+" title='This "+((data.official<2)?"is currently":"used to be")+" an official mod in Modding Space'><td><p><i class='fa fa-fw fa-star'></i>Official mod</p></td></tr>"):""}
        <tr><td><p><b>Game Mode(s): </b>${data.modes||"Unspecified"}</p></td></tr>
        <tr><td><p>${data.description||"No description provided."}</p></td></tr>
      </table>
    </div>`;
  }
  function loadError()
  {
    if (modsinfo && lastDate) processData(modsinfo, null, lastDate);
    else alert("Fetch failed :(\nPlease reload the page and try again!");
    $("#status").html("You are accessing the local data due to internet connection problem");
    $("#status").prop("style","color:red;float:left");
    $("#refresh-ico").prop("class","fa fa-fw fa-refresh");
    $("#refresh-text").html("Refresh");
  }
  function performSearch()
  {
    let data = [];
    for (let name of namespace)
    {
      let d = $("#"+name).val();
      if (d)
      {
        data.push(name+"="+d);
        key[name] = d;
      }
    }
    data.unshift("search");
    if (data.length > 1)
    {
      window.history.pushState({url:domain+encodeURI("?"+data.join("&"))},'',domain+encodeURI("?"+data.join("&")));
      fetch();
    }
  }
  $("#search").on("click", performSearch);
  $("#main1").on("click",showAll);
  $("#refresh").on("click", function() {
    $("#refresh-ico").prop("class","fa fa-fw fa-refresh fa-spin");
    $("#refresh-text").html("Refreshing...");
    fetch();
  });
  function showAll()
  {
    key = {};
    window.history.pushState({path:domain},'',domain);
    fetch();
  }
  function processData(mods, Aqua, response)
  {
    if (Array.isArray(mods))
    {
      modsinfo = mods;
      $("#modsinfo").html("");
      let spc = decodeURI(window.location.search).toLowerCase().split("&"), reg = namespace.map(x => new RegExp("^"+x+"=")), d=spc.shift().substring(1);
      if ($.isEmptyObject(key))
      {
        switch(d)
        {
          case "search":
            spc.map(x => {
              for (let i=0;i<reg.length;i++)
              {
                if (reg[i].test(x))
                {
                  key[namespace[i]] = x.replace(reg[i],"");
                  return;
                }
              }
            });
            break;
        }
        for (let i in key) $("#"+i).val(key[i]||"");
      }
      if ($.isEmptyObject(key)) window.history.pushState({path:domain},'',domain);
      else
      {
        $('title')[0].innerHTML = "Search results - "+$('title')[0].innerHTML;
        let main2 = $("<button></button>");
        main2.on("click",showAll);
        main2.html("View all mods");
        $("#main2p").html(main2);
      }
      let res = mods.filter(x => {
        let t=!key.author;
        if (!t)
          Search: for (let y of x.author)
            for (let z of y.name)
              if (t=z.toLowerCase().includes(key.author),t) break Search;
        return (!key.name || x.name.toLowerCase().includes(key.name)) && t;
      });
      res.map(mod => {$("#modsinfo").append(new ModInfo(mod,key).html)});
      try {lastDate = new Date(response.getResponseHeader("last-Modified")).toString()}
      catch(e){e}
      $("#lastModified").html(lastDate);
      $("#status").html("You are accessing the data that are loaded from our database");
      $("#status").prop("style","color:green;float:left");
      $("#refresh-ico").prop("class","fa fa-fw fa-refresh");
      $("#refresh-text").html("Refresh");
      $("#results").html((res.length)?`Found ${res.length} mod${(res.length>1)?"s":""}`:"No mods found");
    }
    else loadError();
  }
  function fetch()
  {
    $.getJSON("modsinfo.json").done(processData).fail(loadError);
  }
  fetch();
  namespace.map(x => {$("#"+x).on("keydown",function(e){(e.which == 13 && e.ctrlKey) && performSearch()})});
  console.log('%c Stop!!', 'font-weight: bold; font-size: 100px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38)');
  console.log('%cYou are accessing the Web Developing Area.\n\nPlease do not write/copy/paste/run any scripts here (unless you know what you\'re doing) to better protect yourself from loosing your map data, and even your other sensitive data.\n\nWe will not be responsible for any problems if you do not follow the warnings.', 'font-weight: bold; font-size: 15px;color: grey;');
})();
