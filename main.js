(function () {
  "use strict";

  var P = window.PRODUCT;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     0. HYDRATE STATIC CONTENT FROM PRODUCT DATA
  ============================================================ */
  function hydrate() {
    // links
    document.querySelectorAll("#navBuy, #buyFarmley, #footFarmley").forEach(function (el) {
      if (el.id === "navBuy") return; // nav CTA scrolls to #buy on this page
    });
    setLink("buyFarmley", P.links.officialCollection);
    setLink("footFarmley", P.links.officialCollection);
    setLink("buyBlinkit", P.links.buyOnBlinkit);
    setLink("footBlinkit", P.links.buyOnBlinkit);

    // footer bits
    var footEmail = document.getElementById("footEmail");
    footEmail.textContent = "Support: " + P.customerCare.email;
    document.getElementById("footFssai").textContent = "FSSAI: " + P.fssai;
    document.getElementById("footOrigin").textContent = "Made in " + P.countryOfOrigin;
    document.getElementById("footShelf").textContent = "Shelf life: " + P.shelfLife;
    document.getElementById("footDisclaimer").textContent = P.disclaimer;

    // nutrition table
    var n = P.nutrition;
    var rows = [
      ["Energy", n.energyKcal + " kcal", n.dvPercent.energy + "%"],
      ["Protein", n.protein + " g", null],
      ["Carbohydrates", n.carbohydrates + " g", null],
      ["— Total Sugar", n.totalSugar + " g", null, true],
      ["— Added Sugar", n.addedSugar + " g", n.dvPercent.addedSugar + "%", true],
      ["Dietary Fibre", n.dietaryFiber + " g", null],
      ["Total Fat", n.totalFat + " g", n.dvPercent.totalFat + "%"],
      ["— Saturated Fat", n.saturatedFat + " g", n.dvPercent.saturatedFat + "%", true],
      ["— Trans Fat", n.transFat + " g", null, true],
      ["Sodium", n.sodiumMg + " mg", n.dvPercent.sodium + "%"],
      ["Cholesterol", n.cholesterolMg + " mg", null]
    ];
    var table = document.getElementById("nutriTable");
    var html = "";
    rows.forEach(function (r) {
      html += '<tr class="' + (r[3] ? "sub" : "") + '"><td>' + r[0] + "</td><td>" + r[1] +
        (r[2] ? '<span class="dv">' + r[2] + " DV</span>" : "") + "</td></tr>";
    });
    table.innerHTML = html;

    // ingredient chips — first one (makhana) styled as hero chip
    var cloud = document.getElementById("ingredientCloud");
    cloud.innerHTML = P.ingredients.map(function (ing, i) {
      return '<span class="chip' + (i === 0 ? " chip--hero" : "") + '">' + ing + "</span>";
    }).join("");

    // pack sizes
    var sizesWrap = document.getElementById("packSizes");
    sizesWrap.innerHTML = P.sizes.map(function (s, i) {
      return '<button class="size-btn' + (s.default ? " active" : "") + '" data-weight="' + s.weight +
        '" data-price="' + (s.price === null ? "" : s.price) + '">' + s.weight + "</button>";
    }).join("");
    updatePackPrice(P.sizes.find(function (s) { return s.default; }) || P.sizes[0]);

    sizesWrap.querySelectorAll(".size-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sizesWrap.querySelectorAll(".size-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var weight = btn.getAttribute("data-weight");
        var priceAttr = btn.getAttribute("data-price");
        var size = P.sizes.find(function (s) { return s.weight === weight; }) || {};
        updatePackPrice(Object.assign({}, size, { weight: weight, price: priceAttr === "" ? null : Number(priceAttr) }));
        // subtle scale reaction on the can
        var packCanEl = document.querySelector("#packCan .can-inner, #packCan svg");
        if (packCanEl) {
          packCanEl.style.transform = "scale(0.94)";
          setTimeout(function () { packCanEl.style.transform = "scale(1)"; }, 220);
        }
      });
    });

    // duplicate hero can into the pack section (keeps markup single-sourced)
    var heroSvg = document.querySelector("#heroCan svg");
    var packCan = document.getElementById("packCan");
    if (heroSvg && packCan) {
      var clone = heroSvg.cloneNode(true);
      clone.style.transition = "transform .35s cubic-bezier(.2,.9,.25,1.2)";
      packCan.appendChild(clone);
    }
  }

  function setLink(id, href) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", href);
  }

  function updatePackPrice(size) {
    document.getElementById("packPrice").textContent =
      size.price === null || size.price === undefined ? "Price varies" : "₹" + size.price;
    document.getElementById("packWeight").textContent = size.weight + " pack";
  }

  /* ============================================================
     1. NAV: scroll state + mobile drawer
  ============================================================ */
  function initNav() {
    var nav = document.getElementById("nav");
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    var mnav = document.getElementById("mnav");
    document.getElementById("mnavOpen").addEventListener("click", function () { mnav.classList.add("open"); });
    document.getElementById("mnavClose").addEventListener("click", function () { mnav.classList.remove("open"); });
    mnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mnav.classList.remove("open"); });
    });
  }

  /* ============================================================
     2. HERO: cursor-reactive can + floating lemon/chilli field
  ============================================================ */
  function initHero() {
    var stage = document.getElementById("stage");
    var can = document.getElementById("heroCan");
    var orbit = document.getElementById("orbit");
    var crunches = 0;

    // floating field items (lemon slices / chillies / makhana specks)
    var glyphs = ["🍋", "🌶️", "◍", "🍋", "🌶️", "◍", "🍋"];
    var items = [];
    glyphs.forEach(function (g, i) {
      var el = document.createElement("div");
      el.className = "orbit-item";
      el.textContent = g === "◍" ? "" : g;
      if (g === "◍") {
        el.style.width = "16px";
        el.style.height = "16px";
        el.style.borderRadius = "50%";
        el.style.background = "#E8A94A";
      } else {
        el.style.fontSize = (26 + (i % 3) * 10) + "px";
      }
      el.style.left = (10 + (i * 12) % 80) + "%";
      el.style.top = (8 + (i * 17) % 78) + "%";
      el.style.opacity = "0.85";
      orbit.appendChild(el);
      items.push({ el: el, depth: 0.4 + (i % 4) * 0.22, phase: i * 1.3 });
    });

    var targetX = 0, targetY = 0, curX = 0, curY = 0;
    var canRotY = 0, canRotX = 0;

    function onMove(clientX, clientY) {
      var rect = stage.getBoundingClientRect();
      targetX = ((clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
      targetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
    }

    stage.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); });
    stage.addEventListener("mouseleave", function () { targetX = 0; targetY = 0; });
    stage.addEventListener("touchmove", function (e) {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    can.addEventListener("click", pop);
    can.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pop(); }
    });

    function pop() {
      crunches++;
      can.style.transform += " scale(0.97)";
      can.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.94)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
        { duration: 320, easing: "cubic-bezier(.2,.9,.25,1.2)" }
      );
      bumpMeters();
    }

    var raf;
    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      if (!reducedMotion) {
        canRotY = curX * 18;
        canRotX = -curY * 14;
        can.style.transform =
          "rotateY(" + canRotY + "deg) rotateX(" + canRotX + "deg) translateY(" + (curY * -6) + "px)";

        var t = performance.now() / 1000;
        items.forEach(function (it, i) {
          var floatY = Math.sin(t * 0.8 + it.phase) * 10;
          var px = curX * 26 * it.depth;
          var py = curY * 22 * it.depth + floatY;
          it.el.style.transform = "translate(" + px + "px," + py + "px)";
        });
      }
      raf = requestAnimationFrame(tick);
    }
    if (!reducedMotion) tick(); else {
      can.style.transform = "none";
    }
  }

  function bumpMeters() {
    // little celebratory pulse on hero meters when the can is popped
    document.querySelectorAll(".meter__fill").forEach(function (f) {
      f.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.5)" }, { filter: "brightness(1)" }], { duration: 380 });
    });
  }

  /* ============================================================
     CRUNCH SOUND
     ------------------------------------------------------------
     Uses the browser's Web Audio API, so no external audio file or
     library is required. The sound is created only after a real user
     interaction (click/tap/keyboard) to satisfy browser autoplay rules.
  ============================================================ */
  var crunchAudioCtx = null;

  function playCrunchSound() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!crunchAudioCtx) crunchAudioCtx = new AudioContext();
      if (crunchAudioCtx.state === "suspended") {
        crunchAudioCtx.resume();
      }

      var ctx = crunchAudioCtx;
      var now = ctx.currentTime;

      // Short filtered noise = the crunchy crack.
      var buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.12), ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) {
        var decay = 1 - i / data.length;
        data[i] = (Math.random() * 2 - 1) * decay * decay;
      }

      var noise = ctx.createBufferSource();
      noise.buffer = buffer;

      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1850, now);
      filter.Q.setValueAtTime(0.9, now);

      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.115);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.12);

      // Tiny low thump underneath the crack for a more tactile pop.
      var osc = ctx.createOscillator();
      var oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.09);
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.11, now + 0.006);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (err) {
      // Sound is enhancement only; never let an audio/browser issue
      // break the Crunch Lab itself.
      console.warn("Crunch sound unavailable:", err);
    }
  }

  /* ============================================================
     3. CRUNCH LAB
  ============================================================ */
  function initCrunchLab() {
    var board = document.getElementById("labBoard");
    var counterEl = document.getElementById("crunchCount");
    var resetBtn = document.getElementById("labReset");
    var count = 0;
    var PIECES = 14;

    function makhanaSVG() {
      return '<svg viewBox="0 0 64 64"><defs><radialGradient id="mg" cx=".35" cy=".3" r=".8">' +
        '<stop offset="0" stop-color="#F3C87A"/><stop offset="1" stop-color="#D98E3B"/></radialGradient></defs>' +
        '<circle cx="32" cy="32" r="26" fill="url(#mg)"/>' +
        '<circle cx="22" cy="24" r="3" fill="#B23A2E"/>' +
        '<circle cx="40" cy="30" r="2.4" fill="#B23A2E"/>' +
        '<circle cx="28" cy="42" r="2" fill="#B23A2E"/>' +
        '<circle cx="24" cy="16" r="8" fill="#ffffff" opacity=".15"/></svg>';
    }

    function place(el) {
      var w = board.clientWidth, h = board.clientHeight;
      var size = 64;
      var x = 40 + Math.random() * (w - 120);
      var y = 60 + Math.random() * (h - 120);
      el.style.left = x + "px";
      el.style.top = y + "px";
    }

    function spawnBoard() {
      board.querySelectorAll(".makhana").forEach(function (m) { m.remove(); });
      for (var i = 0; i < PIECES; i++) {
        var el = document.createElement("div");
        el.className = "makhana";
        el.innerHTML = makhanaSVG();
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", "Crunch this makhana");
        place(el);
        board.appendChild(el);
        el.addEventListener("click", function (e) { crunch(e.currentTarget); });
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); crunch(e.currentTarget); }
        });
      }
    }

    function spawnCrumbs(x, y) {
      for (var i = 0; i < 8; i++) {
        var c = document.createElement("div");
        c.className = "crumb";
        var s = 3 + Math.random() * 4;
        c.style.width = s + "px";
        c.style.height = s + "px";
        c.style.left = x + "px";
        c.style.top = y + "px";
        board.appendChild(c);
        var angle = Math.random() * Math.PI * 2;
        var dist = 24 + Math.random() * 40;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist;
        if (reducedMotion) { c.remove(); continue; }
        c.animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: "translate(" + dx + "px," + dy + "px)", opacity: 0 }
          ],
          { duration: 500, easing: "cubic-bezier(.2,.8,.3,1)" }
        ).onfinish = function () { c.remove(); };
      }
    }

    function crunch(el) {
      if (el.classList.contains("popped")) return;
      playCrunchSound();
      count++;
      counterEl.textContent = count;
      var rect = el.getBoundingClientRect();
      var boardRect = board.getBoundingClientRect();
      spawnCrumbs(rect.left - boardRect.left + rect.width / 2, rect.top - boardRect.top + rect.height / 2);
      el.classList.add("popped");
      setTimeout(function () {
        el.remove();
        if (board.querySelectorAll(".makhana").length === 0) spawnBoard();
      }, reducedMotion ? 0 : 380);
    }

    resetBtn.addEventListener("click", spawnBoard);
    spawnBoard();
  }

  /* ============================================================
     4. FLAVOUR MIXER
  ============================================================ */
  function initMixer() {
    var zestRange = document.getElementById("zestRange");
    var heatRange = document.getElementById("heatRange");
    var zestVal = document.getElementById("zestVal");
    var heatVal = document.getElementById("heatVal");
    var verdict = document.getElementById("mixerVerdict");
    var zestBlob = document.getElementById("zestBlob");
    var heatBlob = document.getElementById("heatBlob");
    var jar = document.querySelector(".mixer__jar");

    if (!zestRange || !heatRange || !zestBlob || !heatBlob || !verdict || !jar) return;

    var badge = document.createElement("div");
    badge.className = "mixer__badge";
    badge.textContent = "Farmley balance";
    jar.appendChild(badge);

    function verdictFor(z, h) {
      if (z > 75 && h < 35) return "All citrus, barely any bite. Refreshing, but not quite Farmley.";
      if (h > 75 && z < 35) return "Mostly fire. Bold — but the lemon's lost in the mix.";
      if (Math.abs(z - 65) < 15 && Math.abs(h - 55) < 15) return "That's it — roughly the Farmley ratio. Zest first, warmth after.";
      if (z < 25 && h < 25) return "Barely seasoned. You'd just be eating plain foxnuts.";
      if (z > 60 && h > 60) return "Loud on both ends — a punchier, spicier take on the can.";
      return "A workable mix — closer to a custom blend than the classic can.";
    }

    function burst(kind) {
      if (reducedMotion) return;
      for (var i = 0; i < 7; i++) {
        var p = document.createElement("span");
        p.className = "mixer-particle " + kind + " burst";
        var angle = (Math.PI * 2 * i / 7) + (Math.random() * .5 - .25);
        var dist = 24 + Math.random() * 42;
        p.style.left = (48 + Math.random() * 4) + "%";
        p.style.top = (48 + Math.random() * 4) + "%";
        p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        jar.appendChild(p);
        p.addEventListener("animationend", function () { p.remove(); }, { once:true });
      }
    }

    var lastZ = Number(zestRange.value);
    var lastH = Number(heatRange.value);
    var pulseTimer;

    function render(source) {
      var z = Number(zestRange.value);
      var h = Number(heatRange.value);
      zestVal.textContent = z + "%";
      heatVal.textContent = h + "%";

      var separation = 54 - Math.abs(z - h) * 0.36;
      var centerBias = (z - h) * 0.16;
      zestBlob.setAttribute("cx", 150 - separation + centerBias);
      heatBlob.setAttribute("cx", 150 + separation + centerBias);
      zestBlob.setAttribute("r", 78 + z * 0.56);
      heatBlob.setAttribute("r", 78 + h * 0.56);
      zestBlob.setAttribute("opacity", 0.48 + (z / 100) * 0.45);
      heatBlob.setAttribute("opacity", 0.45 + (h / 100) * 0.45);

      verdict.textContent = verdictFor(z, h);

      var closeToFarmley = Math.abs(z - 65) < 15 && Math.abs(h - 55) < 15;
      jar.classList.toggle("is-balanced", closeToFarmley);

      if (source) {
        var changedZ = Math.abs(z - lastZ) >= 2;
        var changedH = Math.abs(h - lastH) >= 2;
        jar.classList.add("mixing");
        verdict.classList.remove("is-pulsing");
        void verdict.offsetWidth;
        verdict.classList.add("is-pulsing");
        clearTimeout(pulseTimer);
        pulseTimer = setTimeout(function () {
          verdict.classList.remove("is-pulsing");
          jar.classList.remove("mixing");
        }, 280);
        if (changedZ) burst("lemon");
        if (changedH) burst("chilli");
      }

      lastZ = z;
      lastH = h;
    }

    zestRange.addEventListener("input", function () { render("zest"); });
    heatRange.addEventListener("input", function () { render("heat"); });
    [zestRange, heatRange].forEach(function (range) {
      range.addEventListener("change", function () { render("change"); });
    });

    render();
  }

  /* ============================================================
     5. SCROLL REVEAL + METER FILL
  ============================================================ */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal, .meter");
    if (!("IntersectionObserver" in window) || reducedMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ============================================================ INIT */
  document.addEventListener("DOMContentLoaded", function () {
    hydrate();
    initNav();
    initHero();
    initCrunchLab();
    initMixer();
    initReveal();
  });
})();
