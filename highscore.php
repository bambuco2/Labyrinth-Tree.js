<html>
<head>
<link rel="stylesheet" type="text/css" href="oblika.css">
<meta charset="UTF-8">
</head>
<script>
if(localStorage.getItem('izid') == 'zmaga'){
	var audio = new Audio('sounds/winner.wav');
	audio.play();
	localStorage.removeItem('izid');
}
else if(localStorage.getItem('izid') == 'poraz'){
	var audio = new Audio('sounds/loser.wav');
	audio.play();
	localStorage.removeItem('izid');
}
var glasba = true;
var text="on";
var myMusic = new Audio('sounds/meni.mp3');
if (localStorage.getItem("text") === null) {
	localStorage.setItem('text', 'on')
	myMusic.play();
}
else if(localStorage.getItem("text") == "on"){
	myMusic.play();
}
</script>
<body background="slike/meni.jpg">


<div id="song">Song by Journey Into Sleep by Martijn de Boer (NiGiD) </div>

<div id = "space"></div>
<div id="highscore"><h2>
	
	<?php
		$myfile = fopen("highscore.txt", "r") or die("Unable to open file!");
		while (($line = fgets($myfile)) !== false) {
			$vse = explode("$", $line);
			echo $vse[0]." &nbsp&nbsp".$vse[1];
			echo "<br>";
		}
		
		fclose($myfile);
	?>
	
</h2></div>
<div id="space2"></div>
<div id = "meni"><h1>
				<div id="score"><a href ="igrca.html">BACK</a></div>
</div>








</body>

</html>