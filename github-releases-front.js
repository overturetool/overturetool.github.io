

function formatSizeUnits(bytes)
{
    if ( ( bytes >> 30 ) & 0x3FF )
        bytes = ( bytes >>> 30 ) + '.' + ( bytes & (3*0x3FF )) + 'GB' ;
    else if ( ( bytes >> 20 ) & 0x3FF )
        bytes = ( bytes >>> 20 ) + '.' + ( bytes & (2*0x3FF ) ) + 'MB' ;
    else if ( ( bytes >> 10 ) & 0x3FF )
        bytes = ( bytes >>> 10 ) + '.' + ( bytes & (0x3FF ) ) + 'KB' ;
    else if ( ( bytes >> 1 ) & 0x3FF )
        bytes = ( bytes >>> 1 ) + 'Bytes' ;
    else
        bytes = bytes + 'Byte' ;
    return bytes ;
}


$(document).ready(function(){


var body =document.getElementById("current-release");
//tbl  = document.createElement('table');

//var cell = 0;
//var tr = tbl.insertRow();
//var row=0;
                  var releaseIndex = 0;
                  
	$.getJSON("https://api.github.com/repos/overturetool/overture/releases",function(result){
		$.each(result/*.reverse()*/, function(i, field)
		{
               if(i>0)
               {
                return;
               }
               
               var divVersion =document.getElementById("current-release-version");
               divVersion.innerHTML=field.tag_name.replace("Release/","");
               
               //var divDate =document.getElementById("current-release-data");
               //divDate.innerHTML=field.tag_name.replace("Release/","");
               
			//var td = tr.insertCell(cell-1);
			
			var gitDiv = document.createElement("div");
		//	gitDiv.className = "githubcontainer";

			var link = document.createElement("a");
			link.href=field.html_url;
			link.appendChild(gitDiv);


			//var img = document.createElement("img");
			//img.src = field.avatar_url;
			//gitDiv.appendChild(img);
			var rank = document.createElement("h2");
			rank.innerHTML=field.name;
			rank.className = "contributions";
			gitDiv.appendChild(rank);

               var ul = document.createElement("ul");
               ul.className="release-downloads";
               
               $.each(field.assets/*.reverse()*/, function(i, asset)
                      {
                      
                      var li = document.createElement("li");
                      var da = document.createElement("a");
                      da.href = field.html_url.replace("tag","download")+"/"+asset.name;
                      da.className = "button primary";
                      
                      var dsl = document.createElement("span");
                      dsl.className="octicon octicon-arrow-down";
                      
                      
                      var dlss = document.createElement("span");
                      dlss.className="overture-tooltipped";//"tooltipped tooltipped-s";
                    //  dlss.aria-label=formatSizeUnits(ass.size);
                      dlss.innerHTML=asset.name;
                      
                      li.appendChild(da);
                      da.appendChild(dsl);
                      da.appendChild(dlss);
                      
                      ul.appendChild(li);
                      
               
			//var name = document.createElement("h2");
              // name.innerHTML=asset.name;//getName(field.login);
			//name.className="name";
			//gitDiv.appendChild(name);
                      });
               gitDiv.appendChild(ul);

			body.appendChild(link);
               
               return;
		});

		//body.appendChild(tbl);
	});
});
