"use strict";
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const flowerMarkup = (variant = "standard") =>
    `<svg viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path class="stem" d="M161 463C148 376 190 275 161 134" stroke="#77805a" stroke-width="5" stroke-linecap="round"/><path class="leaf" d="M167 346C91 342 75 289 72 272C134 277 165 309 167 346Z" fill="#87906a"/><path d="M166 345L99 297" stroke="#626f4d" stroke-width="1.5"/><path class="leaf" d="M173 287C224 280 248 238 248 218C202 226 177 250 173 287Z" fill="#9aa17b"/><path d="M174 286L231 238" stroke="#77805a" stroke-width="1.5"/><g class="bloom-head"><g fill="#e9b834">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="160" cy="77" rx="20" ry="55" transform="rotate(${i * 30} 160 133)"/>`).join("")}</g><g fill="#f1ca52">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="160" cy="87" rx="13" ry="46" transform="rotate(${i * 30 + 15} 160 133)"/>`).join("")}</g><circle cx="160" cy="133" r="${variant === "sunflower" ? 43 : 30}" fill="${variant === "sunflower" ? "#644923" : "#9b702d"}"/><circle cx="160" cy="133" r="${variant === "sunflower" ? 36 : 24}" fill="${variant === "sunflower" ? "#82612d" : "#ad8339"}"/>${Array.from(
      { length: variant === "sunflower" ? 43 : 19 },
      (_, i) => {
        const a = i * 2.4,
          r = 5 * Math.sqrt(i);
        return `<circle cx="${160 + Math.cos(a) * r}" cy="${133 + Math.sin(a) * r}" r="1.7" fill="#705323"/>`;
      },
    ).join("")}</g><g class="closed-bud"><path d="M160 143C137 139 124 119 127 96C129 77 141 60 151 52C151 66 157 73 160 78C165 66 173 59 180 56C180 73 196 89 194 107C192 127 179 141 160 143Z" fill="#d9a327"/><path d="M160 140C140 126 137 107 143 87C147 73 155 62 160 47C166 63 178 78 180 95C183 116 175 132 160 140Z" fill="#f4cf5b"/><path d="M159 139C132 133 120 111 125 82C139 91 156 105 159 139Z" fill="#e9b735"/><path d="M159 139C160 113 178 91 194 82C197 110 185 134 159 139Z" fill="#edc34b"/><path d="M160 134C155 111 154 88 160 66" stroke="#ffe5a0" stroke-width="2.5" stroke-linecap="round"/><path d="M161 151C144 142 131 129 129 110C143 117 154 129 161 143C166 128 180 116 190 111C187 131 176 146 161 151Z" fill="#87906a"/><path d="M161 150C155 143 153 132 158 123C164 130 168 140 161 150Z" fill="#a4ac7b"/></g></svg>`;
  document.querySelectorAll("[data-flower]").forEach((el) => {
    el.innerHTML = flowerMarkup(el.dataset.flower);
  });
  let firstFlowerOpened = false;
  document.querySelector("#open-first").addEventListener("click", (event) => {
    if (firstFlowerOpened) {
      showScene(1);
      return;
    }
    const button = event.currentTarget;
    document.querySelector(".flower-hero").classList.remove("is-bud");
    document.querySelector(".flower-hero").classList.add("blooming");
    document.querySelector(".hero").classList.add("bloomed");
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = "Flores abiertas ✓";
    setTimeout(
      () => {
        document.querySelector("#first-message").textContent = "Bueno… esta es la primera.";
        firstFlowerOpened = true;
        button.disabled = false;
        button.textContent = "Esto recién empieza →";
        button.setAttribute("aria-controls", "intro");
        document.querySelector("#hero-cue").textContent = "HAY ALGO MÁS PARA TI";
      },
      reducedMotion.matches ? 0 : 1300,
    );
  });
  // The setlist uses native details so it remains keyboard accessible without JS.
  const tracks = [...document.querySelectorAll(".track")];
  let unlockedTrack = 0;
  tracks.forEach((track, index) => {
    track.hidden = index > 0;
  });
  document.querySelector("#next-track").addEventListener("click", () => {
    if (unlockedTrack >= tracks.length - 1) return;
    tracks.forEach((track) => {
      track.open = false;
    });
    const track = tracks[++unlockedTrack];
    track.hidden = false;
    track.open = true;
    track.querySelector("summary").focus({ preventScroll: true });
    track.scrollIntoView({
      block: "nearest",
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
    if (unlockedTrack === tracks.length - 1) document.querySelector("#next-track").hidden = true;
  });
  let surpriseTimer;
  tracks.forEach((track) =>
    track.addEventListener("toggle", () => {
      document
        .querySelector(".setlist-section")
        .classList.toggle(
          "concert-lights",
          !!document.querySelector('[data-track="concert"][open]'),
        );
      if (track.dataset.track === "surprise") {
        clearTimeout(surpriseTimer);
        if (track.open && !document.querySelector("#surprise").textContent) {
          surpriseTimer = setTimeout(
            () => {
              document.querySelector("#surprise").textContent = "One Direction. Obviamente.";
              document.querySelector(".corner-link").hidden = false;
            },
            reducedMotion.matches ? 0 : 1100,
          );
        }
      }
    }),
  );

  const songs = [
    { title: "Best Song Ever", file: "best-song-ever.mp3" },
    { title: "Live While We're Young", file: "live-while-were-young.mp3" },
    { title: "Story of My Life", file: "story-of-my-life.mp3" },
    { title: "Steal My Girl", file: "steal-my-girl.mp3" },
    { title: "Drag Me Down", file: "drag-me-down.mp3" },
    { title: "History", file: "history.mp3" },
  ];
  const player = document.querySelector(".player");
  const musicSection = document.querySelector(".music-section");
  const audio = document.querySelector("#music-audio");
  const playButton = document.querySelector("#play-pause");
  const seek = document.querySelector("#song-seek");
  const audioStatus = document.querySelector("#audio-status");
  let songIndex = 0;
  let wantsPlayback = false;
  let playRequest = 0;
  const formatTime = value => {
    const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  };
  const updatePlayButton = () => {
    playButton.setAttribute("aria-pressed", String(wantsPlayback));
    playButton.setAttribute("aria-label", (wantsPlayback ? "Pausar " : "Reproducir ") + songs[songIndex].title);
    player.classList.toggle("play-requested", wantsPlayback);
  };
  const setPlaying = active => {
    player.classList.toggle("is-playing", active);
    musicSection.classList.toggle("active-lights", active);
  };
  const updateTimeline = () => {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    const position = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    seek.disabled = !ready;
    seek.max = ready ? audio.duration : 100;
    seek.value = position;
    seek.style.setProperty("--played", (ready ? position / audio.duration * 100 : 0) + "%");
    seek.setAttribute("aria-valuetext", formatTime(position) + (ready ? " de " + formatTime(audio.duration) : ""));
    document.querySelector("#elapsed").textContent = formatTime(position);
    document.querySelector("#duration").textContent = ready ? formatTime(audio.duration) : "—:—";
  };
  const stopPlayback = () => {
    playRequest++;
    wantsPlayback = false;
    audio.pause();
    setPlaying(false);
    updatePlayButton();
    if (audioStatus.textContent === "Cargando canción…") audioStatus.textContent = "";
  };
  const loadSong = () => {
    audioStatus.textContent = "";
    audio.preload = "metadata";
    audio.src = "assets/audio/" + songs[songIndex].file;
    audio.load();
    updateTimeline();
  };
  const startPlayback = async () => {
    if (!audio.getAttribute("src") || audio.error) loadSong();
    const request = ++playRequest;
    wantsPlayback = true;
    audioStatus.textContent = "";
    updatePlayButton();
    try {
      await audio.play();
      if (request !== playRequest) return;
      if (musicSection.hidden || document.hidden) stopPlayback();
    } catch (error) {
      if (request !== playRequest || error.name === "AbortError") return;
      wantsPlayback = false;
      setPlaying(false);
      updatePlayButton();
      audioStatus.textContent = "No se pudo reproducir. Pulsa play para reintentar.";
    }
  };
  const changeSong = (direction, continuePlaying = wantsPlayback) => {
    stopPlayback();
    songIndex = (songIndex + direction + songs.length) % songs.length;
    document.querySelector("#song-title").textContent = songs[songIndex].title;
    document.querySelector(".player-count").textContent = String(songIndex + 1).padStart(2, "0") + " / 06";
    loadSong();
    updatePlayButton();
    if (continuePlaying) startPlayback();
  };
  playButton.addEventListener("click", () => { if (wantsPlayback) stopPlayback(); else startPlayback(); });
  document.querySelector("#previous-song").addEventListener("click", () => changeSong(-1));
  document.querySelector("#next-song").addEventListener("click", () => changeSong(1));
  seek.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(audio.duration, Math.max(0, Number(seek.value)));
    updateTimeline();
  });
  for (const event of ["loadedmetadata", "durationchange", "timeupdate", "seeked", "emptied"]) audio.addEventListener(event, updateTimeline);
  audio.addEventListener("playing", () => {
    if (!wantsPlayback || musicSection.hidden || document.hidden) { stopPlayback(); return; }
    audioStatus.textContent = "";
    setPlaying(true);
  });
  audio.addEventListener("waiting", () => {
    if (wantsPlayback) audioStatus.textContent = "Cargando canción…";
    setPlaying(false);
  });
  audio.addEventListener("canplay", () => { if (audioStatus.textContent === "Cargando canción…") audioStatus.textContent = ""; });
  audio.addEventListener("pause", () => {
    if (!audio.paused) return;
    setPlaying(false);
    if (!audio.ended) { wantsPlayback = false; updatePlayButton(); }
  });
  audio.addEventListener("ended", () => {
    if (!musicSection.hidden && !document.hidden) changeSong(1, true);
    else stopPlayback();
  });
  audio.addEventListener("error", () => {
    stopPlayback();
    audioStatus.textContent = "No se pudo cargar esta canción. Prueba la siguiente.";
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopPlayback(); });
  window.addEventListener("pagehide", stopPlayback);

  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-waiting");
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.08, rootMargin: "0px 0px 30px 0px" },
  );
  reveals.forEach((el) => {
    if (!reducedMotion.matches) el.classList.add("is-waiting");
    revealObserver.observe(el);
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) reveals.forEach((el) => el.classList.remove("is-waiting"));
  });

  document.querySelector("#back-button").addEventListener("click", () => {
    musicSection.classList.add("leaving");
    stopPlayback();
  });

  const gardenPositions = [
    { left: 35, height: 100, tilt: 3 },
    { left: 15, height: 80, tilt: -15 },
    { left: 55, height: 88, tilt: 15 },
    { left: 2, height: 64, tilt: -20 },
    { left: 72, height: 66, tilt: 14 },
  ];
  let flowerCount = 0;
  const addFlower = document.querySelector("#add-flower");
  addFlower.addEventListener("click", () => {
    if (flowerCount >= gardenPositions.length) {
      showScene(7);
      return;
    }
    const position = gardenPositions[flowerCount];
    const flower = document.createElement("div");
    flower.className = "flower garden-flower";
    flower.style.left = `${position.left}%`;
    flower.style.height = `${position.height}%`;
    flower.style.transform = `translateX(-25%) rotate(${position.tilt}deg)`;
    flower.innerHTML = flowerMarkup();
    document.querySelector("#garden-scene").append(flower);
    flowerCount++;
    document.querySelector("#garden-status").textContent =
      flowerCount === 5
        ? "Ahora sí. Mucho mejor."
        : `${flowerCount} de 5 flores. Siempre cabe una más.`;
    if (flowerCount === 5) {
      addFlower.textContent = "El ramo final →";
      addFlower.setAttribute("aria-controls", "ultima-flor");
    }
  });

  let finalFlowerOpened = false;
  document.querySelector("#open-final").addEventListener("click", (event) => {
    if (finalFlowerOpened) {
      showScene(8);
      return;
    }
    const button = event.currentTarget;
    document.querySelectorAll(".final-flower").forEach(flower => { flower.classList.remove("is-bud"); flower.classList.add("blooming"); });
    document.querySelector(".final-flower-section").classList.add("final-open");
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = "Abriendo el ramo…";
    if (!reducedMotion.matches) {
      const container = document.querySelector(".final-petals");
      for (let i = 0; i < 6; i++) {
        const petal = document.createElement("span");
        petal.className = "petal";
        petal.style.cssText = `left:${25 + i * 9}%;top:${20 + (i % 3) * 7}%;--petal-x:${(i - 3) * 23}px;animation-delay:${i * 0.13}s`;
        container.append(petal);
      }
      setTimeout(() => container.replaceChildren(), 4200);
    }
    setTimeout(
      () => {
        const message = document.querySelector("#final-flower-message");
        const title = document.createElement("strong");
        title.textContent = "Este es oficialmente tu ramo de flores amarillas.";
        const note = document.createElement("p");
        note.textContent = "Las demás eran parte de la producción.";
        message.append(title, note);
        finalFlowerOpened = true;
        button.disabled = false;
        button.textContent = "Leer el mensaje →";
        button.setAttribute("aria-controls", "mensaje");
      },
      reducedMotion.matches ? 0 : 2300,
    );
  });

  // Each scene is revealed by an intentional action; previous states stay in the DOM.
  const scenes = [...document.querySelectorAll("main > section")];
  const sceneNames = [
    "UNA FLOR",
    "EL PLAN",
    "TU SETLIST",
    "ONE DIRECTION",
    "BACK TO YELLOW",
    "MUY DANNA",
    "UNAS FLORES MÁS",
    "EL RAMO FINAL",
    "PARA TI",
  ];
  const journeyBar = document.querySelector(".journey-bar");
  const scrollProgress = document.querySelector(".reading-progress");
  let currentScene = 0;
  let furthestScene = 0;
  const setHistory = (index, replace = false) => {
    try {
      history[replace ? "replaceState" : "pushState"](
        { yellowDayScene: index },
        "",
        `#${scenes[index].id}`,
      );
    } catch {
      /* The internal back button also works when file URLs restrict history. */
    }
  };
  function showScene(index, { fromHistory = false, focus = true } = {}) {
    if (index < 0 || index >= scenes.length || index > furthestScene + 1) return;
    if (currentScene === 3 && index !== 3) {
      stopPlayback();
    }
    currentScene = index;
    furthestScene = Math.max(furthestScene, index);
    scenes.forEach((scene, sceneIndex) => {
      scene.hidden = sceneIndex !== index;
      scene.classList.toggle("is-current", sceneIndex === index);
      scene.classList.remove("scene-enter");
    });
    const scene = scenes[index];
    scene.classList.add("scene-enter");
    musicSection.classList.remove("leaving");
    journeyBar.hidden = index === 0;
    document.body.classList.toggle("scene-dark", index === 3);
    document.querySelector(".journey-position").textContent =
      `${String(index + 1).padStart(2, "0")} / 09 · ${sceneNames[index]}`;
    scrollProgress.style.transform = `scaleX(${(index + 1) / scenes.length})`;
    const heading = scene.querySelector("h1, h2");
    heading.tabIndex = -1;
    const skipLink = document.querySelector(".skip-link");
    skipLink.href = `#${heading.id}`;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (focus) heading.focus({ preventScroll: true });
    if (index === 3 && !audio.getAttribute("src")) loadSong();
    if (!fromHistory) setHistory(index);
  }
  document
    .querySelectorAll("[data-next]")
    .forEach((button) => button.addEventListener("click", () => showScene(currentScene + 1)));
  document
    .querySelector(".journey-back")
    .addEventListener("click", () => showScene(currentScene - 1));
  window.addEventListener("popstate", (event) => {
    const index = event.state?.yellowDayScene;
    if (Number.isInteger(index) && index <= furthestScene) showScene(index, { fromHistory: true });
  });
  showScene(0, { fromHistory: true, focus: false });
  setHistory(0, true);
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const art = document.querySelector(".hero-art");
    art.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches) return;
      const rect = art.getBoundingClientRect();
      art.querySelector(".flower-hero").style.translate =
        `${(event.clientX - rect.left - rect.width / 2) * 0.025}px 0`;
    });
    art.addEventListener("pointerleave", () => {
      art.querySelector(".flower-hero").style.translate = "0 0";
    });
  }
})();
