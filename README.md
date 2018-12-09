# Platforms game with Phaser 3

A platforms game created with Phaser 3, ES6, Node.js and Webpack

## 1. Estructura
El proyecto sigue la estructura del juego RPG visto en clase. Se divide en las siguientes secciones:
* **assets**: contiene todas las im�genes y los archivos JSON con la informaci�n de los dos niveles disponibles. Dichos archivos se encuentran repartidos en las carpetas *images* y *tilemaps*.
* **src**: contiene toda la l�gica del juego. Se subdivide en las siguientes secciones:
	* **groups**: contiene los archivos bullets, enemies y gems.
	* **scenes**: contiene los archivos boot, game y UI.
	* **sprites**: contiene los archivos enemy, portal y player.
Se incluyen, asimismo, dos archivos m�s: config e index. El primero, que establece par�metros b�sicos de configuraci�n, y el segundo que los ejecuta.
Los recursos que se han empleado para la creaci�n del juego son: Node.js, Phaser 3, ES6, Babel y Webpack.
2. L�gica
2. 1. Boot
Es el archivo en el que se establecen los par�metros de iniciaci�n del juego. En la funci�n preload se cargan los contenidos necesarios a trav�s de tres m�todos:
�	load.tilemapTiledJSON: para los mapas en JSON.
�	load.spritesheet: para los sprites.
�	load.image: para las im�genes.
Lo m�s relevante de esta secci�n es que se han incluido sprites para dotarles de animaci�n. Aqu� surg�a un problema: la anchura y altura de los patrones predefinidos era demasiado grande, con lo que el jugador no colisionaba con sus l�mites reales. Para ello se han creado nuevos sprites a partir de los iniciales. 
Los originales son los siguientes:

