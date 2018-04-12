//stopwords http://www.ranks.nl/stopwords
//http://www.daviddlewis.com/resources/testcollections/reuters21578/

//import text and stopwords files
var q  = d3.queue();

var reut_sv = d3.dsvFormat("TEXT>&#2>");
var wiki_sv = d3.dsvFormat("_____");

	q.defer(d3.text,"reut/reut2-000.txt")
	//.defer(d3.text,"wikiP/wikiarticles.txt")
	.defer(d3.text,"mysqlstopw.txt")
	//.defer(d3.json,"nytarticels.json")
	.await(analyze);


//function analyze(error,data,wiki,stopw){
function analyze(error,data,stopw){
	if(error){console.log(error);}

	//console.log(data)

	d3.select('body')
		.style("max-width","800px")
		.style("max-height","600px");
	

	data = data.replace(/[0-9]/g,"")
	data = data.replace(/\n/g," ")
	data = data.replace(/\s/g," ")
	data = data.replace(/\W/g," ")
	//data = data.replace("↵", " ")
	data = data.trim()	

//seperate text into word array and make first letter upper case

	var temp = data.split("TITLE");		
	//console.log(temp)

	var temp2 = [];
	for(var j=0;j<temp.length;j++){
		temp2[j] = temp[j].split(/ +/);		
	}
	//console.log(temp2)

	var datarray = [];
		for(var t=0;t<temp2.length;t++){
			for(var i=0;i<temp2[t].length;i++){
				datarray.push(temp2[t][i].charAt(0).toUpperCase() + temp2[t][i].substr(1).toLowerCase())
			}
		}
		//console.log(datarray)

	var artArray = []
		for(var k=0;k<temp2.length;k++){
			artArray.push([])
			for(var i=0;i<temp2[k].length;i++){
				artArray[k].push(temp2[k][i].charAt(0).toUpperCase() + temp2[k][i].substr(1).toLowerCase())
				//console.log(datarray[i])
			}
		}
		//console.log(datarray)

//add context
	d3.select("#chart").insert("p")
		.text("Document corpus contains: "+ datarray.length+ " words")
		.style("font-size", "30px")
		.style("font-family","Helvetica")
		.style("font-weight", "Bold")
		.style("margin-top", "100px")
		.style("position", "absolute")
		.style("color","#111111");


	var stopwarr = stopw.split(/\n/);

//cycle and remove stop words from text
	var checker = 0;
	var  i=0;
	while(checker <=datarray.length){
		for(i=0;i<stopwarr.length;i++){
		if(datarray[checker] == stopwarr[i]){
			datarray.splice(checker,1)	
			i=0;
		}
		}
checker++;
	}

//create hash table array
	//console.log(datarray.length)
	var hasharr = [];
	for(var k in datarray){
			if(hasharr[datarray[k]] >=1)
				hasharr[datarray[k]] += 1;
			else
				hasharr[datarray[k]] = 1;
		}
	var sorted = [];
	
	for(var key in hasharr){
		sorted.push([[key], hasharr[key]]);
		sorted.sort(function(a,b){
			a = a[1];
			b = b[1];

			return a<b ? 1:(a>b ? -1:0)
		})
	}

//create hash counts for the amounts of word occurences
	var hashhash = [];
	for(var k in sorted){
			if(hashhash[sorted[k][1]] >=1)
				hashhash[sorted[k][1]] += 1;
			else
				hashhash[sorted[k][1]] = 1;
		}
	var sortedhash = [];
	for(var key in hashhash){
		sortedhash.push([key]);///because javascript...
	}
	//console.log(sortedhash)//???? 
	//console.log(sortedhash[0])
	//console.log(sorted)
	
//filter out repetitions and sort into count-bins with words in their respective bins
	var check2 = 0;
	var k=0;
	while(check2 <sorted.length){
	for(var k=0;k<sortedhash.length;k++){
		if(sorted[check2][1]+"" == sortedhash[k][0]){
			sortedhash[k].push(sorted[check2][0][0])
		}
		}
		check2++;
	}


//function to check for keywords
function checkWord(arr){
	return arr === ">>>>>>>>Oil<<<<<<<<" || arr === ">>>>>>>>Prices<<<<<<<<"
}

//create viz
		d3.select("body").selectAll("div")
			.data(sortedhash).enter()
			.insert("div")
			.attr("id",function(d,i){return "#wordgroup"+i})
			.style("display", "inline-block")
			.text(function(d){
				if(+d[0]>=20){
					for(var j=0;j<d.length;j++){
						if(d[j] == "Electricity" || d[j] === "Agriculture") d.splice(j,1,"________"+d[j]+"________")
					}
				
				return "Word occurence of: "+d+" _______"
			}})
			.style("background-color","#FF4136")
			.style("font-weight","bold")
			.style("font-family","helvetica")
			//.style("font-size",function(d,i){return +d[0]+7 +"px"})
			.style("color",function(d){
				if(d.some(checkWord)) {return "#dddddd"}else
				{return "#111111"}
			})
			.style("padding", "10px");
	
//	d3.select("#chart")
//		.data(sortedhash).enter()
//		.insert("p")
//		.text(function(d,i){return "I would suggest filing this group under:: "+ d[d.length/4*3]+ " "})
//		.style("font-size", "26px")
//		.style("font-family","Helvetica")
//		.style("font-weight", "Bold")
//		.style("margin-top", "200px")
//		.style("position", "absolute")
//		.style("color","#111111");
		
};

