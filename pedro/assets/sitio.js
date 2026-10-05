// AI Nest · comportamiento de la web y de la barra de revisión.
(function () {
  'use strict';
  var raiz = document.documentElement;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ajustes de revisión ---------- */
  var CLAVE = 'ainest-revision';
  var AJUSTES = [
    { k: 'hero', t: 'Titular del hero', def: 'v12', ops: [['v12', 'v12 · «Tu empresa, AI ready.»'], ['p1', 'PDF 1 · confianza'], ['p3', 'PDF 3 · método']], nota: 'La v12 es el texto pactado. Las otras dos son las propuestas 1 y 3 del PDF.' },
    { k: 'paleta', t: 'Paleta', def: 'tinta', ops: [['tinta', 'A · Tinta y ámbar'], ['musgo', 'B · Pizarra y musgo'], ['nogal', 'C · Nogal y cobalto']], nota: 'Las tres del PDF, en claro y oscuro. A es la recomendada. B lleva óxido y C no lleva dorado: las dos se salen de la restricción de Joaquín (nada de rojo ni coral; dorado, marino, gris y beige).' },
    { k: 'logo', t: 'Logo', def: '1', ops: [['1', '1 · punto de la i'], ['11', '11 · paréntesis'], ['9', '9 · nido en perspectiva'], ['2', '2 · cuenco'], ['12', '12 · media luna'], ['10', '10 · punto final'], ['n', 'N en círculo (v12)']], nota: '1, 11 y 9 son las finalistas del PDF. La N es el provisional de la v12.' },
    { k: 'eslogan', t: 'Eslogan junto al logo', def: 'v12', ops: [['v12', 'Transformación digital con IA'], ['procesos', 'Consultoría de procesos que aplica IA'], ['queda', 'Cambio que se queda'], ['dentro', 'La IA, dentro de tu empresa'], ['tuyo', 'Lo que construimos es tuyo'], ['criterio', 'Qué sí, qué no y por dónde empezar'], ['nada', 'Sin eslogan']], nota: 'En móvil el eslogan no se muestra; solo el logo.' },
    { k: 'fuente', t: 'Tipografía', def: 'newsreader', ops: [['newsreader', 'Newsreader + Public Sans'], ['plex', 'IBM Plex'], ['source', 'Source Serif + Sans']] },
    { k: 'marca', t: 'Nombre', def: 'separada', ops: [['separada', 'Separado: AI Nest'], ['unida', 'Unido: AINest']], nota: 'Unido: variante d del PDF con el logo 1, variante a con los demás.' },
    { k: 'fases', t: 'Sistema de fases', def: 'B', ops: [['B', 'B · número y barra'], ['A', 'A · contenedor y punto']] },
    { k: 'precio', t: 'Precio del diagnóstico', def: 'cerrado', ops: [['cerrado', 'Sin importe'], ['desde', '«Desde X €»']], nota: 'La v12 no publica importes; el PDF propone un «desde».' },
    { k: 'contacto', t: 'Canal de contacto', def: 'form', ops: [['form', 'Solo formulario'], ['mas', '+ teléfono y WhatsApp']] },
    { k: 'tema', t: 'Modo', def: 'auto', ops: [['auto', 'Automático'], ['claro', 'Claro'], ['oscuro', 'Oscuro']] },
  ];
  function leer() { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } }
  function guardar(o) { try { localStorage.setItem(CLAVE, JSON.stringify(o)); } catch (e) { /* sin almacenamiento */ } }
  var estado = leer();
  // Favicon de cada ruta de logo
  var COLORES = { tinta: ['#16243B', '#F5F3EE', '#D4952B'], musgo: ['#1B2E30', '#F4F5F1', '#A3542E'], nogal: ['#2A211C', '#F6F3EF', '#5C8BFF'] };
  var T, L, A;
  function favs() { return {
    '1': '<rect x="26" y="26" width="12" height="28" rx="3" fill="' + L + '"/><circle cx="32" cy="15" r="7.5" fill="' + A + '"/>',
    '11': '<g fill="none" stroke="' + L + '" stroke-width="5" stroke-linecap="round"><path d="M22 12C12 24 12 40 22 52"/><path d="M42 12C52 24 52 40 42 52"/></g><circle cx="32" cy="32" r="7.5" fill="' + A + '"/>',
    '9': '<path d="M8 32A24 6 0 0 1 56 32" fill="none" stroke="' + L + '" stroke-width="3"/><circle cx="32" cy="26" r="9.5" fill="' + A + '"/><path d="M8 32A24 6 0 0 0 56 32" fill="none" stroke="' + T + '" stroke-width="8"/><path d="M8 32A24 6 0 0 0 56 32" fill="none" stroke="' + L + '" stroke-width="3"/><path d="M8 32C12 52 52 52 56 32" fill="none" stroke="' + L + '" stroke-width="5" stroke-linecap="round"/>',
    '2': '<path d="M12 27A20 20 0 0 0 52 27" fill="none" stroke="' + L + '" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="32" r="7.5" fill="' + A + '"/>',
    '12': '<path d="M10 35A22 22 0 0 0 54 35Z" fill="' + L + '"/><circle cx="32" cy="21" r="7.5" fill="' + A + '"/>',
    '10': '<text x="29" y="45" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="' + L + '">AI</text><circle cx="51" cy="42" r="4.5" fill="' + A + '"/>',
    'n': '<circle cx="32" cy="32" r="22" fill="none" stroke="' + L + '" stroke-width="5"/><path d="M24 42V22M40 42V22" stroke="' + L + '" stroke-width="5" stroke-linecap="round"/><path d="M24 22L40 42" stroke="' + A + '" stroke-width="5" stroke-linecap="round"/>',
  }; }
  function favicon(id) {
    var c = COLORES[estado.paleta] || COLORES.tinta; T = c[0]; L = c[1]; A = c[2];
    var FAV = favs();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="' + T + '"/>' + (FAV[id] || FAV['1']) + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  function aplicar() {
    // La versión final lleva sus elecciones fijas en el HTML: no se tocan.
    if (raiz.hasAttribute('data-final')) return;
    AJUSTES.forEach(function (a) { raiz.setAttribute('data-' + a.k, estado[a.k] || a.def); });
    var ico = document.querySelector('link[rel=icon]');
    if (ico) ico.href = favicon(estado.logo || '1');
    document.querySelectorAll('[data-usar]').forEach(function (b) {
      var p = b.getAttribute('data-usar').split(':');
      var def = AJUSTES.filter(function (a) { return a.k === p[0]; })[0].def;
      b.setAttribute('aria-pressed', String((estado[p[0]] || def) === p[1]));
    });
    document.querySelectorAll('img[data-fav]').forEach(function (i) { i.src = favicon(i.getAttribute('data-fav')); });
  }
  window.AINEST_FAVICON = favicon;
  aplicar();

  document.addEventListener('DOMContentLoaded', function () {
    raiz.classList.add('carga');
    aplicar();
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-usar]');
      if (!b) return;
      var p = b.getAttribute('data-usar').split(':');
      estado[p[0]] = p[1]; guardar(estado); aplicar();
      var r = document.querySelector('input[name="aj-' + p[0] + '"][value="' + p[1] + '"]');
      if (r) r.checked = true;
    });
    montarRevision();
    menu();
    palabra();
    document.querySelectorAll('figure.peli').forEach(escena);
    document.querySelectorAll('.panel-app').forEach(panel);
    document.querySelectorAll('form.form').forEach(formulario);
  });

  function montarRevision() {
    var datosEl = document.getElementById('rev-datos');
    if (!datosEl) return;
    var d = JSON.parse(datosEl.textContent);
    var barra = document.createElement('div');
    barra.className = 'rev';
    barra.setAttribute('role', 'region');
    barra.setAttribute('aria-label', 'Revisión de versiones');
    var opts = d.versiones.map(function (v) {
      return '<option value="' + v.id + '"' + (v.id === d.version ? ' selected' : '') + '>' + v.id.toUpperCase() + ' · ' + v.nombre + '</option>';
    }).join('');
    barra.innerHTML =
      '<a href="' + d.raiz + 'index.html" title="Todas las versiones">☰ <span class="etq">Versiones</span></a>' +
      '<span class="sep"></span>' +
      (d.version ? '<label class="sr-only" for="rev-sel">Versión</label><select id="rev-sel">' + opts + '</select><span class="sep"></span>' : '') +
      '<button type="button" id="rev-aj" aria-expanded="false" aria-controls="ajustes">Ajustes</button>' +
      '<button type="button" id="rev-min" title="Ocultar la barra" aria-label="Ocultar la barra">×</button>' +
      '<button type="button" class="abrir" id="rev-abrir">Revisión</button>';
    document.body.appendChild(barra);

    var sel = barra.querySelector('#rev-sel');
    if (sel) sel.addEventListener('change', function () {
      var dest = d.versiones.filter(function (v) { return v.id === sel.value; })[0];
      var ruta = dest.mapa[d.pagina] || dest.mapa.inicio;
      location.href = d.raiz + dest.id + '/' + ruta;
    });

    var caja = document.createElement('div');
    caja.className = 'ajustes'; caja.id = 'ajustes'; caja.hidden = true;
    caja.setAttribute('role', 'dialog'); caja.setAttribute('aria-label', 'Ajustes de revisión');
    caja.innerHTML = '<h2>Ajustes de revisión</h2><p>Las dudas abiertas que no cambian la estructura. Se aplican a todas las versiones y se recuerdan en este navegador.</p>' +
      AJUSTES.map(function (a) {
        var actual = estado[a.k] || a.def;
        return '<fieldset><legend>' + a.t + '</legend><div class="ops">' + a.ops.map(function (o) {
          return '<label><input type="radio" name="aj-' + a.k + '" value="' + o[0] + '"' + (o[0] === actual ? ' checked' : '') + '>' + o[1] + '</label>';
        }).join('') + '</div>' + (a.nota ? '<p class="nota">' + a.nota + '</p>' : '') + '</fieldset>';
      }).join('') +
      '<div class="pie-aj"><button type="button" id="aj-reset">Volver a lo recomendado</button><button type="button" id="aj-cerrar">Cerrar</button></div>';
    document.body.appendChild(caja);

    caja.addEventListener('change', function (ev) {
      var n = ev.target.name.replace('aj-', '');
      estado[n] = ev.target.value; guardar(estado); aplicar();
    });
    var bAj = barra.querySelector('#rev-aj');
    function abrir(si) { caja.hidden = !si; bAj.setAttribute('aria-expanded', String(si)); }
    bAj.addEventListener('click', function () { abrir(caja.hidden); });
    caja.querySelector('#aj-cerrar').addEventListener('click', function () { abrir(false); bAj.focus(); });
    caja.querySelector('#aj-reset').addEventListener('click', function () {
      estado = {}; guardar(estado); aplicar();
      AJUSTES.forEach(function (a) { var r = caja.querySelector('input[name="aj-' + a.k + '"][value="' + a.def + '"]'); if (r) r.checked = true; });
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !caja.hidden) { abrir(false); bAj.focus(); } });
    barra.querySelector('#rev-min').addEventListener('click', function () { barra.classList.add('min'); abrir(false); });
    barra.querySelector('#rev-abrir').addEventListener('click', function () { barra.classList.remove('min'); });
  }

  /* ---------- Menú móvil ---------- */
  function menu() {
    var b = document.querySelector('.navtog'), n = document.querySelector('.nav');
    if (!b || !n) return;
    b.addEventListener('click', function () {
      var abierto = n.classList.toggle('abierta');
      b.setAttribute('aria-expanded', String(abierto));
      b.textContent = abierto ? 'Cerrar' : 'Menú';
    });
    n.addEventListener('click', function (ev) {
      if (ev.target.closest('a') && n.classList.contains('abierta')) b.click();
    });
  }

  /* ---------- Palabra que cambia en el hero v12 ---------- */
  function palabra() {
    var p = document.querySelector('.pal');
    if (!p || reducido) return;
    var bs = p.querySelectorAll('b'), i = 0;
    setInterval(function () {
      bs[i].classList.remove('on'); i = (i + 1) % bs.length; bs[i].classList.add('on');
    }, 2200);
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

  /* ---------- Formulario de maqueta ---------- */
  function formulario(f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var bien = true;
      f.querySelectorAll('[required]').forEach(function (i) {
        var campo = i.closest('.campo');
        var mal = i.type === 'checkbox' ? !i.checked : !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        if (campo) campo.classList.toggle('mal', mal);
        i.setAttribute('aria-invalid', String(mal));
        if (mal && bien) { i.focus(); bien = false; }
      });
      f.classList.toggle('ok', bien);
    });
  }
})();
