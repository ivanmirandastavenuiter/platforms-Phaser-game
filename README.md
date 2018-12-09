# Platforms game with Phaser 3

A platforms game created with Phaser 3, ES6, Node.js and Webpack

Instrucciones para instalación:

```node.js
npm install
```
```node.js
npm start
```

## 1. Estructura

El proyecto sigue la estructura del juego RPG visto en clase. Se divide en las siguientes secciones:

* **assets**: contiene todas las imágenes y los archivos JSON con la información de los dos niveles disponibles. Dichos archivos se encuentran repartidos en las carpetas *images* y *tilemaps*.
* **src**: contiene toda la lógica del juego. Se subdivide en las siguientes secciones:
	* **groups**: contiene los archivos *bullets*, *enemies* y *gems*.
	* **scenes**: contiene los archivos *boot*, *game* y *UI*.
	* **sprites**: contiene los archivos *enemy*, *portal* y *player*.

Se incluyen, asimismo, dos archivos más: *config* e *index*. El primero, que establece parámetros básicos de configuración, y el segundo que los ejecuta.
Los recursos que se han empleado para la creación del juego son: Node.js, Phaser 3, ES6, Babel y Webpack.

## 2. Lógica

### 2. 1. Boot

Es el archivo en el que se establecen los parámetros de iniciación del juego. En la función *preload* se cargan los contenidos necesarios a través de tres métodos:

* *load.tilemapTiledJSON*: para los mapas en JSON.
* *load.spritesheet*: para los sprites.
* *load.image*: para las imágenes.

Lo más relevante de esta sección es que se han incluido sprites para dotarles de animación. Aquí surgía un problema: la anchura y altura de los patrones predefinidos era demasiado grande, con lo que el jugador no colisionaba con sus límites reales. Para ello se han creado nuevos sprites a partir de los iniciales. 
Los originales son los siguientes:

![pic5](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic5.png)

![pic6](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic6.png)

Y estos son los obtenidos a partir de ellos:

![pic7](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic7.png)

![pic8](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic8.png)

### 2. 2. Game
Las primeras líneas hacen referencia a la importación de elementos necesarios para la posterior utilización de los mismos en el código. 
Remarcar aquí la importancia del método *init*, que permite asignar valores cruciales para la correcta ejecución del juego, como por ejemplo el nivel actual o la carga de estos.
A continuación, tenemos la función *create*. Empecemos por *createMap*, método que se ha modificado en bastantes aspectos. Ha sido necesario, para empezar, hacer distinción de niveles para evitar referencias a valores nulos. 

En primer nivel, tenemos así, las siguientes capas:

* *backgroundLayer*
* *blockedLayer*

En el segundo, por otro lado:

* *backgroundLayerL2*
* *fixedPlatformsL2* (plataformas estáticas)
* *dynamicPlatformsL2* (plataformas dinámicas)

Se incluye un nuevo método, *setSpeedDirection*, que lo que hace es establecer la dirección inicial de las plataformas en el nivel 2.
Se incluyen, también, las siguientes líneas para ajustar los límites del juego:

```javascript
this.physics.world.bounds.width = this.fixedPlatformsL2.width;
this.physics.world.bounds.height = this.fixedPlatformsL2.height;
```

Con respecto a la creación del jugador, se añade una nueva función para crear las animaciones: *setPlayerAnimations*. Otro aspecto que se ha modificado ha sido el establecimiento de colisiones en los enemigos. Hacerlo a través de la propia clase no surtía efecto en el juego, con lo que se añade el método *setEnemiesBound*, que recibe como parámetro *this.enemiesGroup.children.entries*, que contiene cada uno de los enemigos, fijando sus respectivas colisiones. También, en lo referido al método *addCollisions*, se ha tenido en cuenta la división de niveles para evitar de nuevo referencias a valores nulos.

En *update* se incluye la función *movePlatforms*, que, a través de una lógica muy sencilla, produce y controla el movimiento de las plataformas. 

### 2. 3. User interface

Aquí se ha incluido también bastante contenido. Para empezar, se han añadido las siguientes propiedades: *this.levelsDefined* y *this.launchMenu*. A continuación, veremos su utilidad.

Se incluye un letrero también que hace mención de los enemigos eliminados. Esto lo hacemos a través del evento *enemyKilled* de la clase *Enemy*, que controlará si un personaje es eliminado o no. 

Habrá otra línea nueva que añade el control de la tecla x, que la utilizaremos una vez termine el juego para reiniciarlo.

```javascript
// create the key to restart
this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
```

Métodos nuevos incluidos en esta clase:

* *playerWins*: fija las condiciones para ganar la partida. Estas son matar 10 enemigos o recolectar 15 gemas. 
* *restartGame*: encargado de reiniciar la partida en caso de que el jugador gane. 
* *controlDataStatus*: esta función resulta muy importante, puesto que se encarga de asegurarnos valores definidos para la ejecución del reinicio.
* *triggerNewGame*: controla que se haya llegado al final de la partida y que los valores estén definidos, y entonces lanza el reinicio.
* *update*: contiene *triggerNewGame*, que comprobará el estado del juego.

Aquí surgía un problema con respecto al reinicio del juego. Si el jugador estaba en el nivel 1, no había problema alguno; pero si este se encontraba en el nivel 2, la escena que se reiniciaba era la correspondiente al nivel, y no desde el principio. Debugando a través de consola, se puede apreciar que *this._LEVEL* y *this._LEVELS* se definían, ya que tenían valores. El problema es que dicha definición no era inmediata, con lo que se pasaban valores no definidos para el reinicio de la escena. Aquí entra en juego *this.levelsDefined*, que espera a que esa información sea asignada. Una vez ocurra esto, si el jugador gana, se lanza también *this.launchMenu*, que activará el menú final y la detección de la pulsación de la x para el reinicio.

### 2. 4. Enemy

En cuanto a la clase *Enemy*, se cambia, para empezar, el constructor. Se obvia el parámetro frame correspondiente a la versión original del juego, ya que este parámetro es opcional según la documentación de Phaser. 

En la función *loseHealth* se incluye la emisión de dos nuevos eventos. El primero controla la muerte de los enemigos. El segundo ofrece una nueva función para el juego: saltos adicionales durante un segundo tras matar un enemigo. Estos eventos se disparan con:

```javascript
this.scene.events.emit('enemyKilled');
this.scene.events.emit('extraJump');
```

También se modifica la función *move* para que los enemigos salten, además de moverse, todo ello de forma aleatoria. Se añaden, como ya se ha señalado, las respectivas animaciones. 

### 2. 5. Player

En el constructor se hace lo mismo que en *Enemy*. Se colocan dos nuevos parámetros: *this.jumps* y *this.hasJumped*, así como la recogida del evento *extraJump*, que controlará los saltos adicionales. 

En *update*, si el valor de *this.jumps* es mayor que 1, la lógica permitirá saltos adicionales durante un segundo en el siguiente salto posterior a la muerte del enemigo. Para que esto ocurra, el valor de *this.jumps* se reduce solo una vez, controlándose con *this.hasJumped*.

### 2.6. Bullets

En los disparos, se ha modificado, aparte de la estética, la gravedad, ya que esta, configurada a 600, hacía que las bolas de nieve cayeran hacia abajo. Para evitarlo, se hace uso de la propiedad *allowGravity* y se establece a *false*.

```javascript
bullet.body.allowGravity = false;
```

Se aumentan, asimismo, las velocidades del disparo.

### 2. 7. Enemies

En cuanto al grupo *Enemies*, se eliminan las referencias a los frames de la anterior versión, modificándose también, como es evidente, los constructores para *Enemy*. 

### 2. 8. Gems

Controla la captura de gemas. La recolección de estas se controla con *collectGems*.

## 3. Funcionamiento

El juego tiene como objetivo conseguir 15 gemas, o bien, eliminar a 10 enemigos. Si se llega a este objetivo, el juego se para y aparece un menú para reiniciarlo, indicando que para ello debe pulsarse la x. El reinicio solo estará disponible en caso de terminar la partida. 

Consta de dos niveles. El portal se encuentra en la parte superior izquierda, con la forma de una puerta. 

La barra espaciadora permite el disparo de bolas de nieve y las flechas de dirección controlan el movimiento. Tras la muerte de un enemigo, tendremos un segundo de saltos adicionales en el salto posterior.

Capturas:

![pic1](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic1.png)

![pic2](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic2.png)

![pic3](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic3.png)

![pic4](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic4.png)

![pic9](https://github.com/ivanmirandastavenuiter/platforms-Phaser-game/blob/master/pics/pic9.png)






