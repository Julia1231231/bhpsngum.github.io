let src=document.createElement("script");
//src.src="https://bhpsngum.github.io/getChangelog.php";
src.innerHTML='$.ajax({url:"https://bhpsngum.github.io/getChangelog.js",success: function(data){console.log(data)},crossDomain:true,dataType: 'jsonp',processData:false,error: function(e){console.log(e)}});';
document.body.appendChild(src);
