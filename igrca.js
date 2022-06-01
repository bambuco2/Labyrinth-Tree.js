var scene, camera, mesh, renderer,raycasterw,raycasters,raycasterd,raycastera;
var objekti = new Array();

var pistola;
	
var zombie1,zombie2, zombie3, zombie4;
var ziv1,ziv2,ziv3,ziv4;

var attack = 0.1;

var keyboard={};

var player={height:1.8,speed:0.2,turnSpeed:Math.PI*0.02,canShoot:0,canMove:0,health:3,hit:false,points:0}

var time = 0;






var poslusam = localStorage.getItem('text');




var node = document.createElement("IMG");
    node.setAttribute("src", "hearth.jpg");
    node.setAttribute("width", "1%");
    node.setAttribute("height", "1%");
    node.setAttribute("alt", "The Pulpit Rock");
	
var node2 = document.createElement("IMG");
    node2.setAttribute("src", "hearth.jpg");
    node2.setAttribute("width", "1%");
    node2.setAttribute("height", "1%");
    node2.setAttribute("alt", "The Pulpit Rock");
	
var node3 = document.createElement("IMG");
    node3.setAttribute("src", "hearth.jpg");
    node3.setAttribute("width", "1%");
    node3.setAttribute("height", "1%");
    node3.setAttribute("alt", "The Pulpit Rock");
    

document.getElementById("bla").style.display='None';

//tabela metkov
var metki =[];

var testObj;
var vrata = 2;

var countStep = 0;

var startTime = Date.now();

var zacCas = Date.now();

var meniMusic;
var glasba = true;
if(poslusam == "off"){
	glasba = false;
}

function init(){

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(90, (window.innerWidth-25) / (window.innerHeight-25), 0.1, 1000);
	
	
	//doda svetlobo v svet | barva | svetlost
	ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);
	svetloba(-3,6,-3);
	
	svetloba(-3,6,10);
	
	
	
	
	svetloba(10,6,10);
	
	svetloba(30,6,40);
	
	svetloba(-30,6,40);
	
	svetloba(-30,6,80);
	
	//loada modele
	modeli();
	
	//enemy
	enemy();
	var textureLoader = new THREE.TextureLoader();
	var levaTexture = textureLoader.load("texture/rg1024-Door-800px.png");
	
	testObj= new THREE.Mesh(
			new THREE.BoxGeometry(1,5,3),
			new THREE.MeshPhongMaterial({
			map:levaTexture
			})
		);	
	
	testObj.position.z+=-13;
	testObj.position.y+=2.5;
	testObj.position.x=3.5;
	
	testObj.rotation.y+=1.57;
	
	testObj.receiveShadow = true;
	testObj.castShadow = true;
	scene.add(testObj);
	

	labirint();
	
	
	
	var textureLoader = new THREE.TextureLoader();
	groundTexture = textureLoader.load("texture/ground/tilable-IMG_0044-grey.png");
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set(20,20);

	floor = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(60,60,30,30),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:groundTexture
			})
		);

	floor.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor.receiveShadow=true;
	

	scene.add(floor);
	
	

	camera.position.set(7,player.height,-20);

	camera.lookAt(new THREE.Vector3(0,player.height,0));


	renderer = new THREE.WebGLRenderer();
	//renderer.setSize(1200,700);
	renderer.setSize( window.innerWidth-25, window.innerHeight-25);
	
	
	pogled = new THREE.Vector3( 0, 0, -1 );
	pogled = camera.localToWorld( pogled );
	pogled.sub(camera.position);
	
	//zarki v vse smeri kamere
	raycasterw = new THREE.Raycaster(camera.position,pogled);
	raycasters = new THREE.Raycaster(camera.position,pogled);
	raycasterd = new THREE.Raycaster(camera.position,pogled);
	raycastera = new THREE.Raycaster(camera.position,pogled);
	
	//omogoci sence v svet
	renderer.shadowMap.enabled=true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	

	
	
	//alert("premikanje: W, A, S, D\nRotacija: tipke levo, desno\nStreljanje: Spacebar");
	
	zacIgre = meni();
	
	if(zacIgre == true){
		document.body.appendChild(renderer.domElement);
		window.addEventListener( 'resize', onWindowResize, false );
		animate();
	}
}

function onWindowResize() {
	camera.aspect = (window.innerWidth-25) / (window.innerHeight-25);
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth-25, window.innerHeight-25);

}

function animate(){
idAnimate = requestAnimationFrame(animate);

var time = Date.now() * 0.0005;

var now = Math.round((Date.now()-startTime)/1000);

if(player.hit == true){
	var minilo = Math.round((Date.now()-zacCas)/1000);
}

document.getElementById("info").innerHTML = "Lives: ";
lives();
document.getElementById("time").innerHTML = "Time: "+now;
document.getElementById("points").innerHTML = "Points: "+player.points;

var movef=true;
var moves=true;
var movel=true;
var mover=true;


movef=zarek_spredaj();
moves=zarek_zadaj();
movel=zarek_levo();
mover=zarek_desno();


for(var i=0;i<metki.length;i++){
	if(metki[i] == undefined){
		continue;
	}
	if(metki[i].alive == false){
		metki.splice(i,1);
		continue;
	}
	metki[i].position.add(metki[i].velocity);
}



//Premikanje v svetu:	
	//naprej W
	if(keyboard[87] && movef){
		camera.position.z +=Math.cos(camera.rotation.y)*player.speed;
		camera.position.x -=Math.sin(camera.rotation.y)*player.speed;
		countStep = countStep + 1;
		if(countStep%25 == 0){
			var audio = new Audio('sounds/step.wav');
			audio.play();
		}
	}
	
	
	
	//nazaj S
	if(keyboard[83] && moves){
		camera.position.z -=Math.cos(camera.rotation.y)*player.speed;
		camera.position.x +=Math.sin(camera.rotation.y)*player.speed;
		
	}
	
	//levo premik A
	if(keyboard[65] && movel){
		camera.position.z -=Math.cos(camera.rotation.y + Math.PI / 2)*player.speed;
		camera.position.x +=Math.sin(camera.rotation.y + Math.PI / 2)*player.speed;
		
	}
	
	//desno premik D
	if(keyboard[68] && mover){
		camera.position.z -=Math.cos(camera.rotation.y - Math.PI / 2)*player.speed;
		camera.position.x +=Math.sin(camera.rotation.y - Math.PI / 2)*player.speed;
		
	}
	
	
	
	//Levo rotacija
	if(keyboard[37]){
		camera.rotation.y -= player.turnSpeed;
	}
	
	//Desno rotacijs
	if(keyboard[39]){
		camera.rotation.y += player.turnSpeed;
	}
	
	//MENI
	if(keyboard[27]){
		createMeni();
	}
	
	
	//premiki pistole
	pistola.position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.6,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.6
	);
	pistola.rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);
	
	//premiki zombijev
	premik_enemy();
	
	zombie2.rotation.y+=0.01;
	zombie3.rotation.y+=0.01;
	zombie4.rotation.y+=0.01;
	
	if(player.hit == false){
		konec_igre();
	}
	
	if(minilo > 2){
		player.hit = false;
	}
	
	//metki spacebar
	if(keyboard[32] && player.canShoot<=0){
		var metek = new THREE.Mesh(
			new THREE.SphereGeometry(0.05,8,8),
			new THREE.MeshPhongMaterial({color:0xffffff})
		);
		
		metek.position.set(
			pistola.position.x,
			pistola.position.y+0.12,
			pistola.position.z
		);
		
		metek.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		
		metek.alive=true;
		setTimeout(function(){
			metek.alive=false;
			scene.remove(metek);
		},1000)
		
		metki.push(metek);
		scene.add(metek);
		player.canShoot=10;
		var audio = new Audio('sounds/gun.wav');
		audio.play();
	}
	
	if(player.canShoot>0){
		player.canShoot-=1;
	}
	
	zombie_lovi();
	
	zadetek();
	
renderer.render(scene, camera);
}


//pritisk tipke
function dol(event){
	keyboard[event.keyCode] = true;
}



//izpust tipke
function gor(event){
	keyboard[event.keyCode] = false;
}

function labirint(){
	var levaTexture,levaNormalMap,levaBumpMap;
	//za loadanje textur
	var textureLoader = new THREE.TextureLoader();
	levaTexture = textureLoader.load("texture/wall/04mura.png");
	
	//leva
	tabela = new Array();
	//desna
	tabel = new Array();
	//sprednji
	tabelaa = new Array();


	for(var i=0;i<10;i++){
		tabela[i] = new THREE.Mesh(
			new THREE.BoxGeometry(1,5,5),
			new THREE.MeshPhongMaterial({
			map:levaTexture
			})
		);
	
		
		tabel[i] = new THREE.Mesh(
			new THREE.BoxGeometry(1,5,5),
			new THREE.MeshPhongMaterial({
			map:levaTexture
			})
		);
		
		tabelaa[i] = new THREE.Mesh(
			new THREE.BoxGeometry(1,5,5),
			new THREE.MeshPhongMaterial({
			map:levaTexture
			})
		);
		objekti.push(tabelaa[i]);
		objekti.push(tabela[i]);
		objekti.push(tabel[i]);
	
		
		
		
		if(i>0 && i<5){
			tabela[i].position.z+=tabela[i-1].position.z+5;
			tabela[i].position.y+=2.5;
			tabela[i].position.x+=5.5;
			
			tabel[i].position.z+=tabel[i-1].position.z+5;
			tabel[i].position.y+=2.5;
			tabel[i].position.x+=-10;
			
			tabelaa[i].position.z=25;
			tabelaa[i].position.y=2.5;
			tabelaa[i].position.x=tabelaa[i-1].position.x+5;
			tabelaa[i].rotation.y=Math.PI/2;
			
			
		}
		
		else if(i==5){
			tabela[i].position.z+=tabela[i-1].position.z+2;
			tabela[i].position.x+=tabela[i-1].position.x+3;
			tabela[i].position.y+=tabela[i-1].position.y;
			tabela[i].rotation.y+=Math.PI/2;
			
			tabel[i].position.z+=tabel[i-1].position.z+2;
			tabel[i].position.y+=tabel[i-1].position.y;
			tabel[i].position.x+=tabel[i-1].position.x-3;
			tabel[i].rotation.y+=Math.PI/2;
			
			tabelaa[i].rotation.y=Math.PI/2;
			tabelaa[i].position.y=-3;
			
		}
		else if(i>5){
			if(i==9){
				prva_soba();
				druga_soba();
				tretja_soba();
			}
			tabela[i].position.z+=tabela[i-1].position.z;
			tabela[i].position.y+=tabela[i-1].position.y;
			tabela[i].position.x+=tabela[i-1].position.x+5;
			tabela[i].rotation.y+=Math.PI/2;
			
			tabel[i].position.z+=tabel[i-1].position.z;
			tabel[i].position.y+=tabel[i-1].position.y;
			tabel[i].position.x+=tabel[i-1].position.x-5;
			tabel[i].rotation.y+=Math.PI/2;
			
			tabelaa[i].position.z=25;
			tabelaa[i].position.y=2.5;
			tabelaa[i].position.x=tabelaa[i-1].position.x-5;
			tabelaa[i].rotation.y=Math.PI/2;
		}
		
		else if(i==0){
			tabela[i].position.z=-10;
			tabela[i].position.y+=2.5;
			tabela[i].position.x+=5.5;
			
			tabel[i].position.z=-10;
			tabel[i].position.y+=2.5;
			tabel[i].position.x+=-10;
			
			tabelaa[i].position.z=25;
			tabelaa[i].position.y=2.5;
			tabelaa[i].position.x=0;
			tabelaa[i].rotation.y=Math.PI/2;
		}
		
		
		tabela[i].receiveShadow = true;
		tabela[i].castShadow = true;
		scene.add(tabela[i]);
		
		tabel[i].receiveShadow = true;
		tabel[i].castShadow = true;
		scene.add(tabel[i]);
		
		tabelaa[i].receiveShadow = true;
		tabelaa[i].castShadow = true;
		scene.add(tabelaa[i]);
	}


}

function prva_soba(){
	tabelca = new Array();
	
	var textureLoader = new THREE.TextureLoader();
	var levaTexture = textureLoader.load("texture/wall/04mura.png");
	
	for(var i=0;i<11;i++){
		tabelca[i] = new THREE.Mesh(
				new THREE.BoxGeometry(1,5,5),
				new THREE.MeshPhongMaterial({
				map:levaTexture
				})
			);
			
		objekti.push(tabelca[i]);
		if(i==0){
			tabelca[i].position.z=-13;
			tabelca[i].position.y=2.5;
			tabelca[i].position.x=7.5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==1){
			tabelca[i].position.z=-13;
			tabelca[i].position.y=2.5;
			tabelca[i].position.x=tabelca[i-1].position.x+5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==2){
			tabelca[i].position.x=tabelca[i-1].position.x;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z-3;
		}
		else if(i==3){
			tabelca[i].position.x=tabelca[i-1].position.x;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z-5;
		}
		else if(i==4){
			tabelca[i].position.x=tabelca[i-1].position.x-2;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z-2;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>4 && i<9){
			tabelca[i].position.x=tabelca[i-1].position.x-5;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==9){
			tabelca[i].position.x=tabelca[i-1].position.x-0.5;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z+3;
			
		}
		else if(i>9){
			tabelca[i].position.x=tabelca[i-1].position.x;
			tabelca[i].position.y=2.5;
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			
		}
		
		tabelca[i].receiveShadow = true;
		tabelca[i].castShadow = true;
		scene.add(tabelca[i]);
	}
	
	
}
function druga_soba(){
	tabelca = new Array();
	
	var textureLoader = new THREE.TextureLoader();
	var levaTexture = textureLoader.load("texture/wall/04mura.png");
	for(var i=0;i<31;i++){
		tabelca[i] = new THREE.Mesh(
				new THREE.BoxGeometry(1,5,5),
				new THREE.MeshPhongMaterial({
				map:levaTexture
				})
			);
		objekti.push(tabelca[i]);
		if(i==0){
			tabelca[i].position.z=27;
			tabelca[i].position.y=2.5;
			tabelca[i].position.x=23;
		}
		else if(i>0 && i<3){
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==3){
			tabelca[i].position.z=tabelca[i-1].position.z+3;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-2;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>3 && i<6){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==6){
			tabelca[i].position.z=tabelca[i-1].position.z+2;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-3;
		}
		else if(i>6 && i<10){
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==10){
			tabelca[i].position.z=tabelca[i-1].position.z+3;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>10 && i<18){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==18){
			tabelca[i].position.z=tabelca[i-1].position.z-2;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+3;
		}
		else if(i>18 && i<28){
			tabelca[i].position.z=tabelca[i-1].position.z-5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==28){
			tabelca[i].position.z=tabelca[i-1].position.z-1;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-2.5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>28){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		scene.add(tabelca[i]);
	}
	//dirt tla
	gTexture = textureLoader.load("texture/ground/dirt.png");
	gTexture.wrapS = gTexture.wrapT = THREE.RepeatWrapping;
	gTexture.repeat.set(20,20);

	floor2 = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(45,30,15,15),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:gTexture
			})
		);

	floor2.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor2.receiveShadow=true;
	
	floor2.position.set(30,0,45);

	scene.add(floor2);
	
	//dodatna trava
	g2Texture = textureLoader.load("texture/ground/tilable-IMG_0044-grey.png");
	g2Texture.wrapS = g2Texture.wrapT = THREE.RepeatWrapping;
	g2Texture.repeat.set(5,5);

	floor3 = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(16,22,5,5),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:g2Texture
			})
		);

	floor3.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor3.receiveShadow=true;
	
	floor3.position.set(38,0,19);

	scene.add(floor3);
}

function tretja_soba(){
	var textureLoader = new THREE.TextureLoader();
	var levaTexture = textureLoader.load("texture/wall/04mura.png");
	for(var i=0;i<40;i++){
		tabelca[i] = new THREE.Mesh(
				new THREE.BoxGeometry(1,5,5),
				new THREE.MeshPhongMaterial({
				map:levaTexture
				})
			);
		objekti.push(tabelca[i]);
		if(i==0){
			tabelca[i].position.z=15;
			tabelca[i].position.y=2.5;
			tabelca[i].position.x=-36;
		}
		else if(i>0 && i<10){
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==10){
			tabelca[i].position.z=tabelca[i-1].position.z-33;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+13;
		}
		else if(i>10 && i<18){
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==18){
			tabelca[i].position.z=tabelca[i-1].position.z+3;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+2;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>18 && i<22){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==22){
			tabelca[i].position.z=tabelca[i-1].position.z+2;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x+3;
		}
		else if(i>22 && i<27){
			tabelca[i].position.z=tabelca[i-1].position.z+5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		else if(i==27){
			tabelca[i].position.z=tabelca[i-1].position.z+3;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-2;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i>27 && i<34){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-5;
			tabelca[i].rotation.y=Math.PI/2;
		}
		else if(i==34){
			tabelca[i].position.z=tabelca[i-1].position.z;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x-1;
		}
		else if(i>34 && i<40){
			tabelca[i].position.z=tabelca[i-1].position.z-5;
			tabelca[i].position.y=tabelca[i-1].position.y;
			tabelca[i].position.x=tabelca[i-1].position.x;
		}
		
		
		scene.add(tabelca[i]);
		
	}
	
	//dodatna trava
	g2Texture = textureLoader.load("texture/ground/tilable-IMG_0044-grey.png");
	g2Texture.wrapS = g2Texture.wrapT = THREE.RepeatWrapping;
	g2Texture.repeat.set(5,5);

	floor3 = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(16,35,5,5),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:g2Texture
			})
		);

	floor3.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor3.receiveShadow=true;
	
	floor3.position.set(-30,0,47.5);

	scene.add(floor3);
	
	//dodatna trava
	
	g2Texture = textureLoader.load("texture/ground/tilable-IMG_0044-grey.png");
	g2Texture.wrapS = g2Texture.wrapT = THREE.RepeatWrapping;
	g2Texture.repeat.set(2.5,2.5);
	
	floor2 = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(6,18,5,9),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:g2Texture
			})
		);

	floor2.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor2.receiveShadow=true;
	
	floor2.position.set(-33,0,21);

	scene.add(floor2);
	
	
	//stone tla
	gTexture = textureLoader.load("texture/ground/stone.png");
	gTexture.wrapS = gTexture.wrapT = THREE.RepeatWrapping;
	gTexture.repeat.set(20,20);

	floor4 = new THREE.Mesh(
			//Geometrija tal, velikost, segmenti - na koliko delov je razdeljen en
			new THREE.PlaneGeometry(45,30,15,15),
			//Material tal
			new THREE.MeshPhongMaterial({
			map:gTexture
			})
		);
	floor4.rotation.x -= Math.PI / 2;
	
	//objekt dobi sence
	floor4.receiveShadow=true;
	
	floor4.position.set(-25,0,80);

	scene.add(floor4);
}

function zarek_spredaj(){
	//kam gleda kamera v tem trenutku
	pogled = new THREE.Vector3( 0, 0, -1 );
	pogled = camera.localToWorld( pogled );
	pogled.sub(camera.position);


	//zarek spredaj od kje/kam
	raycasterw.set(camera.position,pogled);

	//tabela objektov ki so v napoti
	intersects = raycasterw.intersectObjects(objekti);

	//ali je v napoti kaksen objekt - spredi
	if(intersects.length>0){
		if(intersects[0].distance<1){
			return false;
		}
	}
	return true;
}

function zarek_zadaj(){
	//kam gleda kamera v tem trenutku
	
	pogleds = new THREE.Vector3( 0, 0, -1 );
	pogleds = camera.localToWorld(pogleds);
	pogleds.sub(camera.position);
	
	pogleds.x = pogleds.x*-1;
	pogleds.z = pogleds.z*-1;

	//zarek spredaj od kje/kam
	raycasterw.set(camera.position,pogleds);

	//tabela objektov ki so v napoti
	intersects = raycasterw.intersectObjects(objekti);

	//ali je v napoti kaksen objekt - spredi
	if(intersects.length>0){
		if(intersects[0].distance<1){
			return false;
		}
	}
	return true;
}

function zarek_levo(){
	//kam gleda kamera v tem trenutku
	
	pogleds = new THREE.Vector3( 0, 0, -1 );
	pogleds = camera.localToWorld(pogleds);
	pogleds.sub(camera.position);
	
	var hip = 0;
	
	hip = pogleds.z/Math.sin(Math.PI/4);
	if(hip>-1 && hip<0.6){
		hip = pogleds.x/Math.sin(Math.PI/4);
		pogleds.z=Math.cos(Math.PI/4)*hip;
		pogleds.z=pogleds.z*-1;
	}
	else{
		pogleds.x=Math.cos(Math.PI/4)*hip;
	}
	
	

	//zarek spredaj od kje/kam
	raycasterw.set(camera.position,pogleds);

	//tabela objektov ki so v napoti
	intersects = raycasterw.intersectObjects(objekti);

	//ali je v napoti kaksen objekt - spredi
	if(intersects.length>0){
		if(intersects[0].distance<1){
			return false;
		}
	}
	return true;
}

function zarek_desno(){
	//kam gleda kamera v tem trenutku
	
	pogleds = new THREE.Vector3( 0, 0, -1 );
	pogleds = camera.localToWorld(pogleds);
	pogleds.sub(camera.position);
	
	var hip = 0;
	
	hip = pogleds.z/Math.sin(Math.PI/4);
	if(hip>-1 && hip<0.6){
		hip = pogleds.x/Math.sin(Math.PI/4);
		pogleds.z=Math.cos(Math.PI/4)*hip;
	}
	else{
		pogleds.x=Math.cos(Math.PI/4)*hip;
		pogleds.x=pogleds.x*-1;
	}
	
	

	//zarek spredaj od kje/kam
	raycasterw.set(camera.position,pogleds);

	//tabela objektov ki so v napoti
	intersects = raycasterw.intersectObjects(objekti);

	//ali je v napoti kaksen objekt - spredi
	if(intersects.length>0){
		if(intersects[0].distance<1){
			return false;
		}
	}
	return true;
}

function modeli(){
	var mtlLoader = new THREE.MTLLoader();
	
	mtlLoader.load("models/weapons/pistol.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/weapons/pistol.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.receiveShadow = true;
				}
			});
			scene.add(mesh);
			mesh.position.set(-5, 2, 4);
			mesh.scale.set(10,10,10);
			mesh.rotation.y = -Math.PI/4;
			pistola = mesh;
		});
		
	});
	
	mtlLoader.load("models/nature/naturePack_081.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/nature/naturePack_081.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.receiveShadow = true;
				}
			});
			scene.add(mesh);
			mesh.position.set(25, 0, 50);
			mesh.scale.set(10,10,10);
			mesh.rotation.y = -Math.PI/4;
		});
		
	});
	
	mtlLoader.load("models/nature/Tent_Poles_01.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/nature/Tent_Poles_01.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.receiveShadow = true;
				}
			});
			scene.add(mesh);
			mesh.position.set(-30, 0, 80);
			mesh.scale.set(2.5,2.5,2.5);
			mesh.rotation.y = -Math.PI/4;
		});
		
	});
	
	
}

function enemy(){

	var textureLoader = new THREE.TextureLoader();
	crateTexture = textureLoader.load("texture/crate0/crate0_diffuse.png");
	crateBumpMap = textureLoader.load("texture/crate0/crate0_bump.png");
	crateNormalMap = textureLoader.load("texture/crate0/crate0_normal.png");

	zombie1 = new THREE.Mesh(
		new THREE.BoxGeometry(2,3,1),
		new THREE.MeshPhongMaterial({color:0xffffff,map:crateTexture,bumpMap:crateBumpMap,normalMap:crateNormalMap})
	);
	
	zombie1.position.set(camera.position.x+20,player.height,camera.position.z+20);
	zombie1.receiveShadow=true;
	zombie1.castShadow=true;
	
	scene.add(zombie1);
	ziv1=true;
	
	zombie2 = new THREE.Mesh(
		new THREE.BoxGeometry(2,3,1),
		new THREE.MeshPhongMaterial({color:0xffffff,map:crateTexture,bumpMap:crateBumpMap,normalMap:crateNormalMap})
	);
	
	zombie2.position.set(camera.position.x-20,player.height,camera.position.z+20);
	zombie2.receiveShadow=true;
	zombie2.castShadow=true;
	scene.add(zombie2);
	ziv2=true;
	
	zombie3 = new THREE.Mesh(
		new THREE.BoxGeometry(2,3,1),
		new THREE.MeshPhongMaterial({color:0xffffff,map:crateTexture,bumpMap:crateBumpMap,normalMap:crateNormalMap})
	);
	
	zombie3.position.set(camera.position.x+20,player.height,camera.position.z+50);
	zombie3.receiveShadow=true;
	zombie3.castShadow=true;
	scene.add(zombie3);
	ziv3=true;
	
	zombie4 = new THREE.Mesh(
		new THREE.BoxGeometry(2,3,1),
		new THREE.MeshPhongMaterial({color:0xffffff,map:crateTexture,bumpMap:crateBumpMap,normalMap:crateNormalMap})
	);
	
	zombie4.position.set(camera.position.x-30,player.height,camera.position.z+70);
	zombie4.receiveShadow=true;
	zombie4.castShadow=true;
	scene.add(zombie4);
	ziv4=true;
	
}

function premik_enemy(){
	//zombie1
	var matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie1.matrix );
	var direction = new THREE.Vector3( 0, 0, -1 );
	direction = direction.applyMatrix4( matrix );
	
	var matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie1.matrix );
	var direction1 = new THREE.Vector3( 0, 0, 1 );
	direction1 = direction1.applyMatrix4( matrix );
	
	raycaster = new THREE.Raycaster(zombie1.position,direction);
	raycasters = new THREE.Raycaster(zombie1.position,direction1);
	
	intersects = raycaster.intersectObjects(objekti);
	intersects1 = raycasters.intersectObjects(objekti);
	
	if(intersects.length>0){
		if(intersects[0].distance<=1.5){
			zombie1.rotation.y+=Math.PI/2;
		}
	}
	if(intersects1.length>0){
		if(intersects1[0].distance<=1.5){
			zombie1.rotation.y+=Math.PI/2;
		}
	}
	
	
	zombie1.position.z +=Math.cos(zombie1.rotation.y)*attack;
	zombie1.position.x -=Math.sin(zombie1.rotation.y)*attack;
	
	//zombie2
	
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie2.matrix );
	direction = new THREE.Vector3( 0, 0, -1 );
	direction = direction.applyMatrix4( matrix );
	
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie2.matrix );
	direction1 = new THREE.Vector3( 0, 0, 1 );
	direction1 = direction1.applyMatrix4( matrix );
	
	raycaster = new THREE.Raycaster(zombie2.position,direction);
	raycasters = new THREE.Raycaster(zombie2.position,direction1);
	
	intersects = raycaster.intersectObjects(objekti);
	intersects1 = raycasters.intersectObjects(objekti);
	
	if(intersects.length>0){
		if(intersects[0].distance<=1.5){
			zombie2.rotation.y+=Math.PI/2;
		}
	}
	if(intersects1.length>0){
		if(intersects1[0].distance<=1.5){
			zombie2.rotation.y+=Math.PI/2;
		}
	}
	
	
	zombie2.position.z +=Math.cos(zombie2.rotation.y)*0.2;
	zombie2.position.x -=Math.sin(zombie2.rotation.y)*0.2;
	
	//zombie3
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie3.matrix );
	direction = new THREE.Vector3( 0, 0, -1 );
	direction = direction.applyMatrix4( matrix );
	
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie3.matrix );
	direction1 = new THREE.Vector3( 0, 0, 1 );
	direction1 = direction1.applyMatrix4( matrix );
	
	raycaster = new THREE.Raycaster(zombie3.position,direction);
	raycasters = new THREE.Raycaster(zombie3.position,direction1);
	
	intersects = raycaster.intersectObjects(objekti);
	intersects1 = raycasters.intersectObjects(objekti);
	
	if(intersects.length>0){
		if(intersects[0].distance<=1.5){
			zombie3.rotation.y+=Math.PI/2;
		}
	}
	if(intersects1.length>0){
		if(intersects1[0].distance<=1.5){
			zombie3.rotation.y+=Math.PI/2;
		}
	}
	zombie3.position.z -=Math.cos(zombie3.rotation.y)*0.2;
	zombie3.position.x -=Math.sin(zombie3.rotation.y)*0.2;
	
	//zombie4
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie4.matrix );
	direction = new THREE.Vector3( 0, 0, -1 );
	direction = direction.applyMatrix4( matrix );
	
	matrix = new THREE.Matrix4();
	matrix.extractRotation( zombie4.matrix );
	direction1 = new THREE.Vector3( 0, 0, 1 );
	direction1 = direction1.applyMatrix4( matrix );
	
	raycaster = new THREE.Raycaster(zombie4.position,direction);
	raycasters = new THREE.Raycaster(zombie4.position,direction1);
	
	intersects = raycaster.intersectObjects(objekti);
	intersects1 = raycasters.intersectObjects(objekti);
	
	if(intersects.length>0){
		if(intersects[0].distance<=1.5){
			zombie4.rotation.y+=Math.PI/2;
		}
	}
	if(intersects1.length>0){
		if(intersects1[0].distance<=1.5){
			zombie4.rotation.y+=Math.PI/2;
		}
	}
	
	
	zombie4.position.z -=Math.cos(zombie4.rotation.y)*0.2;
	zombie4.position.x +=Math.sin(zombie4.rotation.y)*0.2;
	
}


function konec_igre(){
	//zombie1
	if(zombie1.position.z>camera.position.z && zombie1.position.z<=camera.position.z+1.5 && zombie1.position.x>camera.position.x && zombie1.position.x<=camera.position.x+1.5){
		if(ziv1){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie1.position.z>camera.position.z && zombie1.position.z<=camera.position.z+1.5 && zombie1.position.x<camera.position.x && zombie1.position.x+1.5>=camera.position.x){
		if(ziv1){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie1.position.z<camera.position.z && zombie1.position.z+1.5>=camera.position.z && zombie1.position.x<camera.position.x && zombie1.position.x+1.5>=camera.position.x){
		if(ziv1){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie1.position.z<camera.position.z && zombie1.position.z+1.5>=camera.position.z && zombie1.position.x>camera.position.x && zombie1.position.x<=camera.position.x+1.5){
		if(ziv1){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	//zombie2
	else if(zombie2.position.z>camera.position.z && zombie2.position.z<=camera.position.z+1.5 && zombie2.position.x<camera.position.x && zombie2.position.x+1.5>=camera.position.x){
		if(ziv2){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie2.position.z<camera.position.z && zombie2.position.z+1.5>=camera.position.z && zombie2.position.x<camera.position.x && zombie2.position.x+1.5>=camera.position.x){
		if(ziv2){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie2.position.z<camera.position.z && zombie2.position.z+1.5>=camera.position.z && zombie2.position.x>camera.position.x && zombie2.position.x<=camera.position.x+1.5){
		if(ziv2){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie2.position.z>camera.position.z && zombie2.position.z<=camera.position.z+1.5 && zombie2.position.x>camera.position.x && zombie2.position.x<=camera.position.x+1.5){
		if(ziv2){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	//zombie3
	else if(zombie3.position.z>camera.position.z && zombie3.position.z<=camera.position.z+1.5 && zombie3.position.x<camera.position.x && zombie3.position.x+1.5>=camera.position.x){
		if(ziv3){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie3.position.z<camera.position.z && zombie3.position.z+1.5>=camera.position.z && zombie3.position.x<camera.position.x && zombie3.position.x+1.5>=camera.position.x){
		if(ziv3){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie3.position.z<camera.position.z && zombie3.position.z+1.5>=camera.position.z && zombie3.position.x>camera.position.x && zombie3.position.x<=camera.position.x+1.5){
		if(ziv3){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie3.position.z>camera.position.z && zombie3.position.z<=camera.position.z+1.5 && zombie3.position.x>camera.position.x && zombie3.position.x<=camera.position.x+1.5){
		if(ziv3){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	//zombie4
	else if(zombie4.position.z>camera.position.z && zombie4.position.z<=camera.position.z+1.5 && zombie4.position.x<camera.position.x && zombie4.position.x+1.5>=camera.position.x){
		if(ziv4){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie4.position.z<camera.position.z && zombie4.position.z+1.5>=camera.position.z && zombie4.position.x<camera.position.x && zombie4.position.x+1.5>=camera.position.x){
		if(ziv4){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie4.position.z<camera.position.z && zombie4.position.z+1.5>=camera.position.z && zombie4.position.x>camera.position.x && zombie4.position.x<=camera.position.x+1.5){
		if(ziv4){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(zombie4.position.z>camera.position.z && zombie4.position.z<=camera.position.z+1.5 && zombie4.position.x>camera.position.x && zombie4.position.x<=camera.position.x+1.5){
		if(ziv4){
			var audio = new Audio('sounds/loser.wav');
			audio.play();
			player.health = player.health - 1;
			player.hit = true;
			zacCas = Date.now();
			if(player.health == 0){
				localStorage.setItem('izid', 'poraz');
				writeHS();
				alert("Konec igre, izgubili ste!");
			}
		}
	}
	else if(!ziv1 && !ziv2 && !ziv3 && !ziv4){
		localStorage.setItem('izid', 'zmaga');
		writeHS();
		alert("Konec igre, zmagali ste!");
		window.cancelAnimationFrame(animate);
		
	}
}

function zadetek(){
	for(var i=0;i<metki.length;i++){
		//zombie1
		if(zombie1.position.z>metki[i].position.z && zombie1.position.z<=metki[i].position.z+1.5 && zombie1.position.x>metki[i].position.x && zombie1.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie1);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv1=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie1.position.z>metki[i].position.z && zombie1.position.z<=metki[i].position.z+1.5 && zombie1.position.x<metki[i].position.x && zombie1.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie1);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv1=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie1.position.z<metki[i].position.z && zombie1.position.z+1.5>=metki[i].position.z && zombie1.position.x<metki[i].position.x && zombie1.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie1);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv1=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie1.position.z<metki[i].position.z && zombie1.position.z+1.5>=metki[i].position.z && zombie1.position.x>metki[i].position.x && zombie1.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie1);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv1=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		//zombie2
		else if(zombie2.position.z>metki[i].position.z && zombie2.position.z<=metki[i].position.z+1.5 && zombie2.position.x<metki[i].position.x && zombie2.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie2);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv2=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie2.position.z<metki[i].position.z && zombie2.position.z+1.5>=metki[i].position.z && zombie2.position.x<metki[i].position.x && zombie2.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie2);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv2=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie2.position.z<metki[i].position.z && zombie2.position.z+1.5>=metki[i].position.z && zombie2.position.x>metki[i].position.x && zombie2.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie2);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv2=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie2.position.z>metki[i].position.z && zombie2.position.z<=metki[i].position.z+1.5 && zombie2.position.x>metki[i].position.x && zombie2.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie2);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv2=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		//zombie3
		else if(zombie3.position.z>metki[i].position.z && zombie3.position.z<=metki[i].position.z+1.5 && zombie3.position.x<metki[i].position.x && zombie3.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie3);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv3=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie3.position.z<metki[i].position.z && zombie3.position.z+1.5>=metki[i].position.z && zombie3.position.x<metki[i].position.x && zombie3.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie3);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv3=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie3.position.z<metki[i].position.z && zombie3.position.z+1.5>=metki[i].position.z && zombie3.position.x>metki[i].position.x && zombie3.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie3);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv3=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie3.position.z>metki[i].position.z && zombie3.position.z<=metki[i].position.z+1.5 && zombie3.position.x>metki[i].position.x && zombie3.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie3);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv3=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		//zombie4
		else if(zombie4.position.z>metki[i].position.z && zombie4.position.z<=metki[i].position.z+1.5 && zombie4.position.x<metki[i].position.x && zombie4.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie4);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv4=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie4.position.z<metki[i].position.z && zombie4.position.z+1.5>=metki[i].position.z && zombie4.position.x<metki[i].position.x && zombie4.position.x+1.5>=metki[i].position.x){
			scene.remove(zombie4);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv4=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie4.position.z<metki[i].position.z && zombie4.position.z+1.5>=metki[i].position.z && zombie4.position.x>metki[i].position.x && zombie4.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie4);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv4=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		else if(zombie4.position.z>metki[i].position.z && zombie4.position.z<=metki[i].position.z+1.5 && zombie4.position.x>metki[i].position.x && zombie4.position.x<=metki[i].position.x+1.5){
			scene.remove(zombie4);
			var audio = new Audio('sounds/hit.wav');
			audio.play();
			ziv4=false;
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
			player.points = player.points + 1;
		}
		//Vrata
		else if(testObj.position.z>metki[i].position.z && testObj.position.z<=metki[i].position.z+1.5 && testObj.position.x<metki[i].position.x && testObj.position.x+1.5>=metki[i].position.x){
			vrata = vrata - 1;
			if(vrata == 0){
				scene.remove(testObj);
			}
			else if(vrata>0){
				scene.remove(testObj);
				var textureLoader = new THREE.TextureLoader();
				var levaTexture = textureLoader.load("texture/rg1024-Door-800px2.png");
	
				testObj= new THREE.Mesh(
					new THREE.BoxGeometry(1,5,3),
					new THREE.MeshPhongMaterial({
					map:levaTexture
					})
				);	
	
				testObj.position.z+=-13;
				testObj.position.y+=2.5;
				testObj.position.x=3.5;
		
				testObj.rotation.y+=1.57;
		
				testObj.receiveShadow = true;
				testObj.castShadow = true;
				scene.add(testObj);
				
			}
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
		}
		else if(testObj.position.z<metki[i].position.z && testObj.position.z+1.5>=metki[i].position.z && testObj.position.x<metki[i].position.x && testObj.position.x+1.5>=metki[i].position.x){
			vrata = vrata - 1;
			if(vrata == 0){
				scene.remove(testObj);
			}
			else if(vrata>0){
				scene.remove(testObj);
				var textureLoader = new THREE.TextureLoader();
				var levaTexture = textureLoader.load("texture/rg1024-Door-800px2.png");
	
				testObj= new THREE.Mesh(
					new THREE.BoxGeometry(1,5,3),
					new THREE.MeshPhongMaterial({
					map:levaTexture
					})
				);	
	
				testObj.position.z+=-13;
				testObj.position.y+=2.5;
				testObj.position.x=3.5;
		
				testObj.rotation.y+=1.57;
		
				testObj.receiveShadow = true;
				testObj.castShadow = true;
				scene.add(testObj);
				
			}
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
		}
		else if(testObj.position.z<metki[i].position.z && testObj.position.z+1.5>=metki[i].position.z && testObj.position.x>metki[i].position.x && testObj.position.x<=metki[i].position.x+1.5){
			vrata = vrata - 1;
			if(vrata == 0){
				scene.remove(testObj);
			}
			else if(vrata>0){
				scene.remove(testObj);
				var textureLoader = new THREE.TextureLoader();
				var levaTexture = textureLoader.load("texture/rg1024-Door-800px2.png");
	
				testObj= new THREE.Mesh(
					new THREE.BoxGeometry(1,5,3),
					new THREE.MeshPhongMaterial({
					map:levaTexture
					})
				);	
	
				testObj.position.z+=-13;
				testObj.position.y+=2.5;
				testObj.position.x=3.5;
		
				testObj.rotation.y+=1.57;
		
				testObj.receiveShadow = true;
				testObj.castShadow = true;
				scene.add(testObj);
				
			}
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
		}
		else if(testObj.position.z>metki[i].position.z && testObj.position.z<=metki[i].position.z+1.5 && testObj.position.x>metki[i].position.x && testObj.position.x<=metki[i].position.x+1.5){
			vrata = vrata - 1;
			if(vrata == 0){
				scene.remove(testObj);
			}
			else if(vrata>0){
				scene.remove(testObj);
				var textureLoader = new THREE.TextureLoader();
				var levaTexture = textureLoader.load("texture/rg1024-Door-800px2.png");
	
				testObj= new THREE.Mesh(
					new THREE.BoxGeometry(1,5,3),
					new THREE.MeshPhongMaterial({
					map:levaTexture
					})
				);	
	
				testObj.position.z+=-13;
				testObj.position.y+=2.5;
				testObj.position.x=3.5;
		
				testObj.rotation.y+=1.57;
		
				testObj.receiveShadow = true;
				testObj.castShadow = true;
				scene.add(testObj);
				
			}
			metki[i].alive=false;
			scene.remove(metki[i]);
			metki.splice(i,1);
		}
	}
}

function svetloba(x,y,z){

	//doda luc v svet
	light = new THREE.PointLight(0xffffff,0.8,18);
	light.position.set(x,y,z);
	//senca
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
}

function zvok(){
	var audio = new Audio('sounds/winner.wav');
	audio.play();
}

function lives(){
	if(player.health == 1){
		document.getElementById("info").appendChild(node);
	}
	else if(player.health == 2){
		document.getElementById("info").appendChild(node);
		document.getElementById("info").appendChild(node2);
	}
	else if(player.health == 3){
		document.getElementById("info").appendChild(node);
		document.getElementById("info").appendChild(node2);
		document.getElementById("info").appendChild(node3);
	}
}

function meni(){
	meniMusic = new Audio('sounds/meni.mp3'); 
	meniMusic.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	
	if(!poslusam){
		meniMusic.play();
	}
	else if(poslusam == "on"){
		meniMusic.play();
	}
	
	document.getElementById('asdf').onclick= function() {
		if(glasba){
			meniMusic.pause();
			glasba = false;
		}
		else{
			meniMusic.play();
			glasba = true;
		}
	}
	
	vrni = false;
	document.body.style.backgroundImage = "url('slike/meni.jpg')";
	var myNode= document.getElementById("start");
	var myNode2= document.getElementById("options");
	myNode.addEventListener("click",function(e){  
		var parent = document.getElementsByTagName("BODY")[0];
		var child = document.getElementById("meni");
		parent.removeChild(child);
		var child = document.getElementById("space");
		parent.removeChild(child);
		
		document.body.style.backgroundImage = "url('')";
		document.getElementById("bla").style.display='none';
		
		document.body.appendChild(renderer.domElement);
		window.addEventListener( 'resize', onWindowResize, false );

		animate();
	});
	
	

	document.getElementById("start").innerHTML("bla");
	return vrni;
}


function createMeni(){
	cancelAnimationFrame( idAnimate );
	
	document.getElementById("bla").style.display='block';
	
	var myNode= document.getElementById("resume");
	myNode.addEventListener("click",function(e){
		document.getElementById("bla").style.display='None';
		animate();
	});
	
	var myNode= document.getElementById("exit");
	myNode.addEventListener("click",function(e){
		while(scene.children.length > 0){ 
			scene.remove(scene.children[0]); 
		}
		document.body.style.backgroundImage = "url('slike/meni.jpg')";
	});
	
	
	
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//Zapis v txt datoteko highscore
function writeHS(){
	localStorage.setItem('tocke', player.points);
	window.location.replace("zapisScore.php?name="+localStorage.getItem('name')+"&tocke="+player.points);
}


function zombie_lovi(){
	if((camera.position.z+3)>zombie1.position.z && (camera.position.z-3)<zombie1.position.z){
		if((camera.position.x-10)<zombie1.position.x && (camera.position.x+10)>zombie1.position.x){
			attack = 0.3;
			
		}
		
	}
	else if((camera.position.x+3)>zombie1.position.x && (camera.position.x-3)<zombie1.position.x){
		if((camera.position.z-10)<zombie1.position.z && (camera.position.z+10)>zombie1.position.z){
			attack = 0.3;
			
		}
	}
	else{
		attack = 0.1;
	}
}




//Poslusa na pritisk tipke in ko jo izpusti
window.addEventListener("keydown",dol);
window.addEventListener("keyup",gor);

window.onload=init();

