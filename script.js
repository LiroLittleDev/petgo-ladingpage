// Script: ajustar AOS para exibicao mais rápida e trigger mais cedo
// Reduz delays/duration existentes e inicializa AOS com offsets maiores
document.addEventListener("DOMContentLoaded", function() {
  // Ajuste automático de atributos data-aos-delay/data-aos-duration para acelerar aparição
  try {
    document.querySelectorAll('[data-aos-delay]').forEach(el => {
      const raw = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
      if (!isNaN(raw)) {
        // reduzir para ~40% do valor original para ficar mais responsivo
        const reduced = Math.max(0, Math.round(raw * 0.4));
        el.setAttribute('data-aos-delay', String(reduced));
      }
    });

    document.querySelectorAll('[data-aos-duration]').forEach(el => {
      const raw = parseInt(el.getAttribute('data-aos-duration') || '0', 10);
      if (!isNaN(raw) && raw > 0) {
        const reduced = Math.max(120, Math.round(raw * 0.5));
        el.setAttribute('data-aos-duration', String(reduced));
      }
    });
  } catch (e) {
    // não bloquear caso algo falhe
    console.warn('Ajuste automático AOS falhou', e);
  }

  // Inicializa AOS com duração menor e offset maior para iniciar animações antes
  AOS.init({
    duration: 300,         // animações mais rápidas
    easing: 'ease-out-quart',
    once: true,            // anima apenas uma vez
    offset: 220,           // inicia a animação 220px antes do elemento entrar na viewport
    delay: 0
  });

  // Força recalcular posições após alterar atributos
  setTimeout(() => AOS.refresh(), 60);

  // Typewriter manual (caso queira mais controle)
  const tw = document.querySelector('.typewriter');
  if (tw) {
    tw.innerHTML = tw.textContent.replace(/\S/g, "<span>$&</span>");
    const spans = tw.querySelectorAll('span');
    spans.forEach((span, i) => {
      span.style.animation = `fadeIn 0.04s forwards ${i * 0.04}s`;
    });
  }

  // Garantir que a página sempre abra no topo (logo visível)
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 50);
  setTimeout(() => window.scrollTo(0, 0), 250);

  // IntersectionObserver: reproduzir cada vídeo UMA vez quando estiver próximo
  try {
    const videos = Array.from(document.querySelectorAll('video[data-autoplay-once]'));
    if (videos.length) {
      const options = {
        root: null,
        rootMargin: '0px 0px -180px 0px', // dispara antes de chegar totalmente na viewport
        threshold: 0.15
      };

      const onEntry = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const v = entry.target;
            // só tocar se ainda não foi tocado
            if (!v.dataset.played) {
              // garantir que esteja silenciado para permitir autoplay
              v.muted = true;
              const playPromise = v.play();
              if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(() => {
                  // marcar como tocado
                  v.dataset.played = 'true';
                  // tentar desmutar após reprodução começar (melhor esforço)
                  try {
                    v.muted = false;
                    v.volume = 1.0;
                  } catch (err) {
                    // se navegador bloquear, nada a fazer
                    console.warn('Não foi possível desmutar automaticamente', err);
                  }
                }).catch(() => {
                  // autoplay bloqueado; deixar controls para que usuário toque manualmente
                  v.dataset.played = 'true';
                });
              } else {
                v.dataset.played = 'true';
              }
              observer.unobserve(v);
            }
          }
        });
      };

      const io = new IntersectionObserver(onEntry, options);
      videos.forEach(v => io.observe(v));
    }
  } catch (e) {
    console.warn('Observer de vídeo falhou', e);
  }
});