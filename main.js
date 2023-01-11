// Acceder a la cámara web del dispositivo
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Crear una instancia de la clase que proporciona acceso a la cámara
const video = document.querySelector("video");

// Creamos una variable para el cuadro
const box = document.querySelector(".box");

// Obtener acceso
navigator.getUserMedia({ video: true }, stream => {
    video.srcObject = stream;
}, err => {
    console.log(`Error al acceder a la cámara: ${err}`);
});

// Crear un modelo de TensorFlow.js para detectar puntos clave faciales
facemesh.load().then(model => {
    video.addEventListener("play", async () => {
        // Iniciar un bucle para detectar puntos clave faciales y mover el cuadro
        async function loop() {
            // Obtener una imagen de la cámara
            const image = tf.browser.fromPixels(video);

            // Detectar puntos clave faciales
            const predictions = await model.estimateFaces(image);

            if (predictions.length > 0) {
                // Obtener las coordenadas x, y de los puntos clave faciales
                const x = predictions[0].landmarks._positions[0]._x;
                const y = predictions[0].landmarks._positions[0]._y;

                // Calcular la nueva posición del cuadro
                box.style.left = x - 75 + "px";
                box.style.top = y - 75 + "px";
            }

            // Volver a llamar a la función loop
            requestAnimationFrame(loop);
        }
        loop();
    });
});
