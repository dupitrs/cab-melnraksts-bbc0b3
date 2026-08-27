/* Kopīgās animācijas visām lapām: hero ienākšana, scroll atklāšanās, skaitītāji,
 * 3D slaideris un three.js fasetes (tikai tur, kur lapā ir #bg3d). */
document.addEventListener('DOMContentLoaded', () => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';

  /* ── galvene: sarukšana, ritināšanas progress, slīdošais indikators ── */
  const mast = document.querySelector('.mast');
  if (mast) {
    const prog = mast.querySelector('.mast__prog');
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        mast.classList.toggle('is-scrolled', scrollY > 30);
        if (prog) {
          const max = document.documentElement.scrollHeight - innerHeight;
          prog.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
        }
        ticking = false;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const nav = mast.querySelector('.mast__nav');
    const ind = mast.querySelector('.mast__ind');
    const active = nav ? nav.querySelector('a[aria-current="page"]') : null;
    if (nav && ind && active) {
      nav.classList.add('has-ind');
      if (!rm) ind.style.transition = 'left 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1)';
      const moveTo = (a) => {
        ind.style.left = a.offsetLeft + 'px';
        ind.style.width = a.offsetWidth + 'px';
      };
      moveTo(active);
      nav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('mouseenter', () => moveTo(a));
        a.addEventListener('focus', () => moveTo(a));
      });
      nav.addEventListener('mouseleave', () => moveTo(active));
      addEventListener('resize', () => moveTo(active));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveTo(active));
    }
  }

  /* ── 3D slaideris ── */
  const slider = document.getElementById('slider');
  const cards = slider ? [...slider.querySelectorAll('.card')] : [];
  if (slider && cards.length && !rm) {
    slider.classList.remove('works-grid');
    let cur = 0;
    const count = document.getElementById('scount');
    const step = () => Math.min(390, innerWidth * 0.44);
    const layout = (animate) => {
      cards.forEach((c, j) => {
        const d = j - cur;
        const hidden = Math.abs(d) > 2;
        const props = {
          x: d * step(), xPercent: -50,
          z: -Math.abs(d) * 250,
          rotationY: d * -16,
          scale: d === 0 ? 1 : 0.94,
          opacity: hidden ? 0 : 1 - 0.3 * Math.abs(d),
          zIndex: 10 - Math.abs(d)
        };
        if (hasGsap) {
          animate ? gsap.to(c, { ...props, duration: 0.7, ease: 'power3.out' }) : gsap.set(c, props);
        } else {
          c.style.transition = animate ? 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s' : 'none';
          c.style.transform = `translateX(calc(-50% + ${props.x}px)) translateZ(${props.z}px) rotateY(${props.rotationY}deg) scale(${props.scale})`;
          c.style.opacity = props.opacity;
          c.style.zIndex = props.zIndex;
        }
        c.style.pointerEvents = hidden ? 'none' : 'auto';
      });
      if (count) count.textContent = (cur + 1) + ' / ' + cards.length;
    };
    const go = (i) => { cur = Math.max(0, Math.min(cards.length - 1, i)); layout(true); };
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    if (prev) prev.addEventListener('click', () => go(cur - 1));
    if (next) next.addEventListener('click', () => go(cur + 1));
    cards.forEach((c, j) => c.addEventListener('click', () => { if (j !== cur) go(j); }));
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });
    addEventListener('resize', () => layout(false));
    layout(false);
  }

  /* ── skaitītāji: biedrības īstie skaitļi ── */
  const counters = [...document.querySelectorAll('.stat b[data-count]')];
  if (counters.length && !rm) {
    const fmtLv = (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const end = +el.dataset.count;
        const start = +(el.dataset.start || 0);
        const suffix = el.dataset.suffix || '';
        const fmt = el.dataset.format === 'lv' ? fmtLv : (v) => Math.round(v);
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(start + (end - start) * e) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  }

  /* ── GSAP: ienākšana un scroll atklāšanās ── */
  if (hasGsap && !rm) {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    const intro = document.querySelectorAll('[data-intro]');
    if (intro.length) {
      gsap.from(intro, { y: 26, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
    }
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
      gsap.from(heroBg, { scale: 1.07, duration: 2.4, ease: 'power2.out' });
    }
    if (typeof ScrollTrigger !== 'undefined') {
      document.querySelectorAll('[data-rise]').forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
      document.querySelectorAll('[data-rise-group]').forEach((group) => {
        gsap.from(group.children, {
          y: 26, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 86%' }
        });
      });
    }
  }

  /* ── galerijas gaismas kaste ── */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('figcaption');
    document.querySelectorAll('.galgrid a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        lbImg.alt = a.dataset.alt || '';
        lbCap.textContent = a.dataset.alt || '';
        lb.showModal();
      });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  }

  /* ── YouTube fasāde: iframe tikai pēc klikšķa ── */
  document.querySelectorAll('.video[data-yt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.yt;
      const f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
      f.title = 'YouTube video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      btn.innerHTML = '';
      btn.appendChild(f);
    }, { once: true });
  });

  /* ── three.js: logo ģeometrijas fasetes tumšajā joslā ── */
  const canvas = document.getElementById('bg3d');
  if (!canvas || rm || typeof THREE === 'undefined') return;
  const hero = canvas.closest('section');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x251C17, 10, 30);
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
  cam.position.z = 15;
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const warm = new THREE.DirectionalLight(0xE8D9C8, 1.0); warm.position.set(4, 6, 8); scene.add(warm);
  const teal = new THREE.PointLight(0x008F9E, 1.4, 40); teal.position.set(-8, -4, 6); scene.add(teal);
  const cols = [0x8F7D73, 0x8F7D73, 0x67524B, 0x67524B, 0x008F9E];
  const shapes = [];
  for (let i = 0; i < 55; i++) {
    const geo = Math.random() < 0.6
      ? new THREE.TetrahedronGeometry(0.35 + Math.random() * 0.55)
      : new THREE.OctahedronGeometry(0.3 + Math.random() * 0.45);
    const mat = new THREE.MeshStandardMaterial({
      color: cols[i % cols.length], flatShading: true, roughness: 0.65, metalness: 0.12
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12);
    m.rotation.set(Math.random() * 6.3, Math.random() * 6.3, 0);
    m.userData = {
      rs: (Math.random() - 0.5) * 0.012,
      fy: Math.random() * 6.3,
      fa: 0.15 + Math.random() * 0.35,
      y0: m.position.y
    };
    scene.add(m); shapes.push(m);
  }
  let mx = 0, my = 0;
  addEventListener('pointermove', (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  const size = () => {
    const r = hero.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    cam.aspect = r.width / r.height;
    cam.updateProjectionMatrix();
  };
  size(); addEventListener('resize', size);
  let visible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(hero);
  let t = 0;
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible) return;
    t += 0.016;
    shapes.forEach((m) => {
      m.rotation.x += m.userData.rs;
      m.rotation.y += m.userData.rs * 1.4;
      m.position.y = m.userData.y0 + Math.sin(t * 0.5 + m.userData.fy) * m.userData.fa;
    });
    cam.position.x += (mx * 1.3 - cam.position.x) * 0.04;
    cam.position.y += (-my * 0.9 - cam.position.y) * 0.04;
    cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  };
  tick();
});
