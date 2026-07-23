    // --- QUOTES DATABASE ---
    const quotes = [
      { text: "The best among you are those who have the best manners and character.", source: "Sahih al-Bukhari" },
      { text: "None of you truly believes until he wishes for his brother what he wishes for himself.", source: "Sahih al-Bukhari & Muslim" },
      { text: "Do not consider any act of goodness insignificant, even if it is just meeting your brother with a cheerful face.", source: "Sahih Muslim" },
      { text: "The strong person is not the one who can wrestle someone down. The strong person is the one who controls himself when angry.", source: "Sahih al-Bukhari" },
      { text: "God does not look at your forms or your wealth, but He looks at your hearts and your deeds.", source: "Sahih Muslim" }
    ];

    let currentQuoteIdx = 0;
    function nextQuote() {
      currentQuoteIdx = (currentQuoteIdx + 1) % quotes.length;
      document.getElementById('quoteDisplay').textContent = `"${quotes[currentQuoteIdx].text}"`;
      document.getElementById('quoteAuthor').textContent = `— Prophet Muhammad (ﷺ) [${quotes[currentQuoteIdx].source}]`;
    }

    // --- THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    });

    // --- NASHEED AUDIO TOGGLE ---
    const audioToggleBtn = document.getElementById('audioToggle');
    const bgAudio = document.getElementById('bgAudio');
    let isPlaying = false;

    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgAudio.pause();
        audioToggleBtn.textContent = '🕌 Nasheed';
      } else {
        bgAudio.play().then(() => {
          audioToggleBtn.textContent = '🔇 Mute';
        }).catch(() => {
          alert("Audio playback was blocked. Please click on the page and try again.");
        });
      }
      isPlaying = !isPlaying;
    });

    // --- SHARE FUNCTION ---
    function shareTribute() {
      if (navigator.share) {
        navigator.share({
          title: 'Tribute to Prophet Muhammad (ﷺ)',
          text: 'Explore the detailed life, character, and legacy of Prophet Muhammad (ﷺ).',
          url: window.location.href,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Tribute page link copied to clipboard!');
      }
    }

    // --- ANIMATED COUNTER ---
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    window.addEventListener('scroll', () => {
      const statsSection = document.getElementById('stats');
      if (!statsSection) return;
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight;

      if (sectionPos < screenPos && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const speed = target / 40;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 30);
            } else {
              counter.innerText = target + (target === 2 ? 'B+' : '+');
            }
          };
          updateCount();
        });
      }
    });

    // =========================================================
    // --- QURAN READER MODAL & API LOGIC ---
    // =========================================================
    let chapters = [];
    let currentAudio = null;
    let currentVerseList = [];
    let currentPlayingIndex = -1;

    function openQuranModal() {
      document.getElementById('quranModal').classList.add('active');
      if (chapters.length === 0) {
        initQuran();
      }
    }

    function closeQuranModal() {
      document.getElementById('quranModal').classList.remove('active');
      if (currentAudio) currentAudio.pause();
    }

    async function initQuran() {
      try {
        const res = await fetch('https://api.quran.com/api/v4/chapters?language=en');
        const data = await res.json();
        chapters = data.chapters;
        renderDropdown(chapters);
        loadSurah(1); // Default: Al-Fatiha
      } catch (e) {
        document.getElementById('quranView').innerHTML = `<div class="loading-box" style="color:#ef4444;">Failed to load data. Please check your connection.</div>`;
      }
    }

    function renderDropdown(list) {
      const select = document.getElementById('surahSelect');
      select.innerHTML = list.map(c => 
        `<option value="${c.id}">${c.id}. ${c.name_simple} (${c.name_arabic}) — ${c.translated_name.name}</option>`
      ).join('');
    }

    function filterSurah() {
      const q = document.getElementById('surahSearch').value.toLowerCase();
      const filtered = chapters.filter(c => 
        c.name_simple.toLowerCase().includes(q) || 
        c.id.toString().includes(q) ||
        c.translated_name.name.toLowerCase().includes(q)
      );
      renderDropdown(filtered);
      if (filtered.length > 0) loadSurah(filtered[0].id);
    }

    async function loadSurah(id) {
      const view = document.getElementById('quranView');
      view.innerHTML = `<div class="loading-box">Loading Surah... 📖</div>`;

      try {
        const [chapterRes, versesRes] = await Promise.all([
          fetch(`https://api.quran.com/api/v4/chapters/${id}?language=en`),
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&words=false&translations=161,131&fields=text_uthmani&per_page=300`)
        ]);

        const chapterData = await chapterRes.json();
        const versesData = await versesRes.json();

        const ch = chapterData.chapter;
        currentVerseList = versesData.verses;

        let html = `
          <div class="surah-header-card">
            <div class="surah-title-ar">${ch.name_arabic}</div>
            <div class="surah-title-en">${ch.name_simple}</div>
            <div class="surah-meta">
              Meaning: <strong>${ch.translated_name.name}</strong> | Type: <strong>${ch.revelation_place === 'makkah' ? 'Makki' : 'Madani'}</strong> | Verses: <strong>${ch.verses_count}</strong>
            </div>
          </div>
        `;

        currentVerseList.forEach((v, index) => {
          const bnText = v.translations[0] ? v.translations[0].text.replace(/<[^>]*>/g, '') : 'অনুবাদ পাওয়া যায়নি';
          const enText = v.translations[1] ? v.translations[1].text.replace(/<[^>]*>/g, '') : '';

          html += `
            <article class="ayah-card" id="ayah-${index}">
              <div class="ayah-top-bar">
                <span class="verse-key-badge">${v.verse_key}</span>
                <div class="action-buttons">
                  <button class="btn-action" onclick="playAyahAudio(${index})">▶ Play Audio</button>
                  <button class="btn-action" onclick="copyAyah('${v.verse_key}', \`${v.text_uthmani}\`, \`${bnText}\`, \`${enText}\`)">📋 Copy</button>
                  <button class="btn-action" onclick="shareAyah('${v.verse_key}', \`${enText}\`)">🔗 Share</button>
                </div>
              </div>

              <div class="ayah-arabic">${v.text_uthmani}</div>

              <div class="translation-container">
                <div class="bangla-translation">
                  <strong style="color:var(--primary-accent);">বাংলা অর্থ:</strong> ${bnText}
                </div>
                ${enText ? `
                <div class="english-translation">
                  <strong style="color:var(--gold-accent);">English:</strong> ${enText}
                </div>` : ''}
              </div>
            </article>
          `;
        });

        view.innerHTML = html;
      } catch (err) {
        view.innerHTML = `<div class="loading-box" style="color:#ef4444;">Failed to load Surah.</div>`;
      }
    }

    function playAyahAudio(index) {
      if (currentAudio) currentAudio.pause();
      currentPlayingIndex = index;
      
      const verseKey = currentVerseList[index].verse_key;
      const [s, a] = verseKey.split(':');
      const formattedS = s.padStart(3, '0');
      const formattedA = a.padStart(3, '0');
      const url = `https://everyayah.com/data/Alafasy_128kbps/${formattedS}${formattedA}.mp3`;
      
      currentAudio = new Audio(url);
      currentAudio.play();

      showToast(`Playing Recitation: Verse ${verseKey}`);

      currentAudio.onended = () => {
        const isAutoPlay = document.getElementById('autoPlayToggle').checked;
        if (isAutoPlay && currentPlayingIndex + 1 < currentVerseList.length) {
          playAyahAudio(currentPlayingIndex + 1);
          const nextAyah = document.getElementById(`ayah-${currentPlayingIndex + 1}`);
          if(nextAyah) nextAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }

    function copyAyah(key, arabic, bangla, english) {
      const fullText = `[Surah Verse: ${key}]\n\n${arabic}\n\nBangla: ${bangla}\n\nEnglish: ${english}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast('Verse and translations copied! 📋');
      });
    }

    function shareAyah(key, text) {
      if (navigator.share) {
        navigator.share({
          title: `Holy Quran - Verse ${key}`,
          text: `[Surah Verse ${key}]\n${text}`,
          url: window.location.href,
        });
      } else {
        copyAyah(key, '', '', text);
      }
    }

    let fontScale = 1;
    function adjustFontSize(delta) {
      fontScale = Math.max(0.8, Math.min(1.5, fontScale + delta));
      document.documentElement.style.setProperty('--arabic-scale', `${2.3 * fontScale}rem`);
      document.documentElement.style.setProperty('--translation-scale', `${1.05 * fontScale}rem`);
      showToast(`Font Size: ${Math.round(fontScale * 100)}%`);
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }

    // Scroll Progress in Quran Modal
    document.getElementById('quranModalBody').onscroll = function() {
      let scroll = this.scrollTop;
      let height = this.scrollHeight - this.clientHeight;
      document.getElementById("progress-bar").style.width = (scroll / height) * 100 + "%";
    };
