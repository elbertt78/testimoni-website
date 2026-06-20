  // ---------- Particle network background ----------
  (function(){
    const canvas = document.getElementById('particle-bg');
    const ctx = canvas.getContext('2d');
    let width, height, particles, animationId;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouse = { x: null, y: null, radius: 140 };

    function resize(){
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function countForWidth(w){
      if(w < 600) return 45;
      if(w < 1000) return 75;
      return 110;
    }

    class Particle{
      constructor(){
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.6 + 0.8;
      }
      update(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < 0 || this.x > width) this.vx *= -1;
        if(this.y < 0 || this.y > height) this.vy *= -1;

        if(mouse.x !== null){
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < mouse.radius){
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 197, 253, 0.65)';
        ctx.fill();
      }
    }

    function init(){
      resize();
      const count = countForWidth(width);
      particles = Array.from({length: count}, () => new Particle());
    }

    function connect(){
      const maxDist = width < 700 ? 110 : 150;
      for(let i = 0; i < particles.length; i++){
        for(let j = i + 1; j < particles.length; j++){
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if(dist < maxDist){
            const opacity = (1 - dist / maxDist) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate(){
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      init();
      if(!prefersReduced) animate(); else { particles.forEach(p=>p.draw()); connect(); }
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    init();
    if(prefersReduced){
      // Draw a single static frame, no continuous animation.
      particles.forEach(p => p.draw());
      connect();
    } else {
      animate();
    }
  })();

  // ---------- Scroll reveal ----------
  (function(){
    const items = document.querySelectorAll('.reveal');
    const bars = document.querySelectorAll('.skill-bar');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(el => io.observe(el));

    const barIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.level + '%';
          barIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(b => barIo.observe(b));
  })();
