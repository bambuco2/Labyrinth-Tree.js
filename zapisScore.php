<html>
<meta charset="UTF-8">
<?php
	$myfile = fopen("highscore.txt", "a") or die("Unable to open file!");
	$txt = $_GET['name']."$".$_GET['tocke'];
	fwrite($myfile, $txt."\n");
	fclose($myfile);
	
	
	
	header("Location: highscore.php");
	
?>
</html>