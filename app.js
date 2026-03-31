  const TOKEN = "SECURE_TOKEN_2025";
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const car = document.getElementById('car-container');
        const fogL = document.getElementById('fog-left');
        const fogR = document.getElementById('fog-right');
        
        let w, h, cx, cy;
        let currentSpeed = 0, visualSpeed = 0, offset = 0;
        let speedTrails = [];
		
		window.onAndroidEvent = function (type, data) {
  console.log("AndroidEvent:", type, data);

  switch (type) {

    case "speed": {
      const speed = Number(data.value) || 0;
      change(speed);
      break;
    }
  }
};

function change(Speed) {
	currentSpeed = Speed;
}
      

        function init() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            cx = w / 2; cy = h / 2;
            speedTrails = [];
            for(let i=0; i<60; i++) speedTrails.push({
                x: Math.random() * w,
                y: Math.random() * h,
                z: Math.random() * w,
                o: Math.random()
            });
        }

        function draw() {
            visualSpeed += (currentSpeed - visualSpeed) * 0.12;
			console.log(visualSpeed);
            let moveStep = (visualSpeed * 5.5) + 12; 
            offset += moveStep;

            // Fog Pulse: Side fog reacts to velocity
            let fogAlpha = 0.2 + (visualSpeed * 0.008);
            fogL.style.opacity = Math.min(fogAlpha, 0.9);
            fogR.style.opacity = Math.min(fogAlpha, 0.9);

            // Engine Vibration Physics
            let shake = (Math.random() - 0.5) * (visualSpeed * 0.15);
            car.style.transform = `translateX(calc(-50% + ${shake}px)) translateY(${shake}px) scale(${1 + (visualSpeed * 0.0005)})`;

            ctx.clearRect(0, 0, w, h);

            // 1. TURQUOISE ENERGY VORTEX (Background Stars)
            speedTrails.forEach(s => {
                s.z -= moveStep * 0.5;
                if (s.z <= 0) s.z = w;
                let sx = (s.x - cx) * (w / s.z) + cx;
                let sy = (s.y - cy) * (w / s.z) + cy;
                let size = (1 - s.z / w) * 4;
                ctx.fillStyle = `rgba(0, 255, 230, ${s.o * (visualSpeed * 0.01 + 0.2)})`;
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 2. THE CHROME-GLASS ROAD (Floor)
            for (let i = 0; i < (h - cy); i += 35) {
                let lineY = cy + ((i + offset) % (h - cy));
                let alpha = Math.pow((lineY - cy) / (h - cy), 3.5);
                ctx.strokeStyle = `rgba(0, 255, 230, ${alpha * 0.6})`;
                ctx.lineWidth = 1.5 + (alpha * 4);
                ctx.beginPath(); 
                ctx.moveTo(cx - (w * alpha), lineY); 
                ctx.lineTo(cx + (w * alpha), lineY); 
                ctx.stroke();
            }

            // 3. THE "NEO-TITANIUM" CENTER RAILS
            ctx.shadowBlur = 50;
            ctx.shadowColor = "#00ffe6";
            for (let i = 0; i < 4; i++) {
                let yStart = cy + ((i * 280 + offset * 3) % (h - cy));
                let alpha = Math.pow((yStart - cy) / (h - cy), 4);
                
                ctx.lineWidth = 18;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // Liquid White Core
                ctx.beginPath();
                ctx.moveTo(cx, yStart); 
                ctx.lineTo(cx, yStart + (220 * alpha));
                ctx.stroke();
            }
            ctx.shadowBlur = 0;

            // 4. AERODYNAMIC V-SHOCKWAVES (Side Tunnel)
            ctx.lineWidth = 3;
            ctx.strokeStyle = `rgba(0, 255, 230, ${0.1 + (visualSpeed * 0.006)})`;
            ctx.beginPath();
            ctx.moveTo(cx - 130, cy); ctx.lineTo(-w * 0.3, h);
            ctx.moveTo(cx + 130, cy); ctx.lineTo(w * 1.3, h);
            ctx.stroke();

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', init);
        init();
        draw();
		
		// ===== Init =====
document.addEventListener("DOMContentLoaded", function () {

  console.log("androidApi =", window.androidApi);

  // Сообщаем Android, что JS готов
  if (window.androidApi && window.androidApi.onJsReady) {
    window.androidApi.onJsReady(TOKEN);
  }

});