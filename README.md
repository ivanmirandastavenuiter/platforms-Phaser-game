# Platforms game with Phaser 3

A platforms game created with Phaser 3, ES6, Node.js and Webpack

## 1. Estructura
El proyecto sigue la estructura del juego RPG visto en clase. Se divide en las siguientes secciones:
* **assets**: contiene todas las imágenes y los archivos JSON con la información de los dos niveles disponibles. Dichos archivos se encuentran repartidos en las carpetas *images* y *tilemaps*.
* **src**: contiene toda la lógica del juego. Se subdivide en las siguientes secciones:
	* **groups**: contiene los archivos bullets, enemies y gems.
	* **scenes**: contiene los archivos boot, game y UI.
	* **sprites**: contiene los archivos enemy, portal y player.
Se incluyen, asimismo, dos archivos más: config e index. El primero, que establece parámetros básicos de configuración, y el segundo que los ejecuta.
Los recursos que se han empleado para la creación del juego son: Node.js, Phaser 3, ES6, Babel y Webpack.
2. Lógica
2. 1. Boot
Es el archivo en el que se establecen los parámetros de iniciación del juego. En la función preload se cargan los contenidos necesarios a través de tres métodos:
•	load.tilemapTiledJSON: para los mapas en JSON.
•	load.spritesheet: para los sprites.
•	load.image: para las imágenes.
Lo más relevante de esta sección es que se han incluido sprites para dotarles de animación. Aquí surgía un problema: la anchura y altura de los patrones predefinidos era demasiado grande, con lo que el jugador no colisionaba con sus límites reales. Para ello se han creado nuevos sprites a partir de los iniciales. 
Los originales son los siguientes:

