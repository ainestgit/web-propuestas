// AI Nest · comportamiento de la web: menú móvil, escenas de ejemplo y panel.
(function () {
  'use strict';
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('carga');
    menu();
    document.querySelectorAll('figure.peli').forEach(escena);
    document.querySelectorAll('.panel-app').forEach(panel);
    reserva();
  });

  /* ---------- Menú móvil ---------- */
  function menu() {
    var b = document.querySelector('.navtog'), n = document.querySelector('.nav');
    if (!b || !n) return;
    function abrir(si) {
      n.classList.toggle('abierta', si);
      b.setAttribute('aria-expanded', String(si));
      b.textContent = si ? 'Cerrar' : 'Menú';
    }
    b.addEventListener('click', function () { abrir(!n.classList.contains('abierta')); });
    n.addEventListener('click', function (ev) { if (ev.target.closest('a')) abrir(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && n.classList.contains('abierta')) { abrir(false); b.focus(); }
    });
  }

  /* ---------- Reserva: el calendario de Google en un diálogo ---------- */
  function reserva() {
    var d = document.querySelector('.reserva-dlg');
    if (!d || typeof d.showModal !== 'function') return; // sin <dialog>, el enlace abre otra pestaña
    var f = d.querySelector('iframe');
    f.addEventListener('load', function () { if (f.src) d.classList.add('cargado'); });
    document.querySelectorAll('[data-reserva]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.preventDefault();
        if (!f.src) f.src = f.getAttribute('data-src');
        d.showModal();
      });
    });
    d.querySelector('[data-cerrar]').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (ev) { if (ev.target === d) d.close(); });
  }

  /* ---------- Escenas animadas ---------- */
  function escena(fig) {
    var pasos = fig.querySelectorAll('ol.pasos li');
    var tarjetas = fig.querySelectorAll('.salidas .tarjeta');
    var est = fig.querySelector('.estado-ag');
    var btn = fig.querySelector('.ctl button');
    var estados = JSON.parse(fig.getAttribute('data-estados'));
    var paso = -1, timer = null, jugando = !reducido, visto = false;

    function pintar(n) {
      paso = n;
      pasos.forEach(function (li, i) {
        li.classList.toggle('hecho', i < n || n >= pasos.length);
        li.classList.toggle('ahora', i === n);
      });
      tarjetas.forEach(function (t) {
        var p = +t.getAttribute('data-paso');
        t.classList.toggle('ve', p <= n);
        if (t.classList.contains('per')) t.classList.toggle('ok', p < n || n >= pasos.length);
      });
      fig.classList.toggle('fin', n >= pasos.length - 1);
      est.textContent = estados[Math.max(0, Math.min(n, estados.length - 1))];
    }
    function avanzar() {
      var sig = paso + 1;
      if (sig > pasos.length) sig = 0; // pausa final y vuelta a empezar
      if (sig === pasos.length) { pintar(pasos.length - 1); paso = pasos.length; }
      else pintar(sig);
      timer = setTimeout(avanzar, sig === pasos.length ? 3200 : 1900);
    }
    function play() { jugando = true; btn.textContent = 'Pausar'; clearTimeout(timer); avanzar(); }
    function pausa() { jugando = false; btn.textContent = 'Reproducir'; clearTimeout(timer); }
    btn.addEventListener('click', function () { jugando ? pausa() : play(); });

    if (reducido) { pintar(pasos.length - 1); btn.textContent = 'Reproducir'; return; }
    pintar(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !visto && jugando) { visto = true; clearTimeout(timer); timer = setTimeout(avanzar, 900); }
          else if (!e.isIntersecting && visto) { clearTimeout(timer); visto = false; }
        });
      }, { threshold: .35 }).observe(fig);
    } else { timer = setTimeout(avanzar, 900); }
  }

  /* ---------- Panel de ejemplo ---------- */
  function panel(app) {
    var tabs = app.querySelectorAll('[role=tab]');
    function ir(id) {
      tabs.forEach(function (t) {
        var si = t.getAttribute('aria-controls') === id;
        t.setAttribute('aria-selected', String(si)); t.tabIndex = si ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !si;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { ir(t.getAttribute('aria-controls')); });
      t.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
      });
    });
    app.querySelectorAll('[data-ir]').forEach(function (b) {
      b.addEventListener('click', function () { ir(b.getAttribute('data-ir')); });
    });

    // Procesos: filas desplegables
    app.querySelectorAll('.tabla .exp').forEach(function (b) {
      b.addEventListener('click', function () {
        var det = document.getElementById(b.getAttribute('aria-controls'));
        var ab = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(ab)); det.hidden = !ab;
      });
    });

    // Bandeja: resolver avisos
    var cuenta = app.querySelector('[data-cuenta]');
    function recontar() {
      var n = app.querySelectorAll('.aviso-l li:not(.resuelto)').length;
      if (cuenta) cuenta.textContent = n;
    }
    app.querySelectorAll('.aviso-l li').forEach(function (li) {
      li.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('si')) {
            li.classList.add('resuelto');
            li.querySelector('.bts').innerHTML = '<span class="pill ok">Resuelto</span>';
          } else { li.parentNode.appendChild(li); }
          recontar();
        });
      });
    });

    // Simulador
    var sim = app.querySelector('.sim');
    if (sim) {
      var h = sim.querySelector('#sim-h'), p = sim.querySelector('#sim-p'), c = sim.querySelector('#sim-c');
      var fmt = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
      function calc() {
        sim.querySelector('[for-h]').textContent = h.value + ' h a la semana';
        sim.querySelector('[for-p]').textContent = p.value + ' %';
        var anual = h.value * 46, vuelven = Math.round(anual * p.value / 100), coste = vuelven * (+c.value || 0);
        sim.querySelector('[data-r=anual]').textContent = fmt.format(anual) + ' h';
        sim.querySelector('[data-r=vuelven]').textContent = fmt.format(vuelven) + ' h';
        sim.querySelector('[data-r=coste]').textContent = fmt.format(coste) + ' €';
      }
      [h, p, c].forEach(function (i) { i.addEventListener('input', calc); });
      calc();
    }

    // Gráfica: guía y etiqueta al pasar
    app.querySelectorAll('.graf[data-serie]').forEach(function (g) {
      var tip = g.querySelector('.tip'), guia = g.querySelector('.guia'), svg = g.querySelector('svg');
      g.querySelectorAll('.zona').forEach(function (z) {
        function ver() {
          var x = +z.getAttribute('data-x'), y = +z.getAttribute('data-y');
          var r = svg.getBoundingClientRect(), gr = g.getBoundingClientRect(), k = r.width / 640;
          tip.textContent = z.getAttribute('data-t');
          tip.style.left = (r.left - gr.left + x * k) + 'px';
          tip.style.top = (r.top - gr.top + y * k) + 'px';
          tip.classList.add('ve');
          guia.setAttribute('x1', x); guia.setAttribute('x2', x); guia.style.opacity = 1;
        }
        function no() { tip.classList.remove('ve'); guia.style.opacity = 0; }
        z.addEventListener('mouseenter', ver); z.addEventListener('mouseleave', no);
        z.addEventListener('focus', ver); z.addEventListener('blur', no);
      });
    });
  }
})();
