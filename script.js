// Inicializa AOS
AOS.init({
  duration: 400,
  easing: 'ease-out-quart',
  once: true
});

// Typewriter manual (caso queira mais controle)
document.addEventListener("DOMContentLoaded", function() {
  const title = document.querySelector('.typewriter');
  if (title) {
    title.innerHTML = title.textContent.replace(/\S/g, "<span>$&</span>");
    const spans = title.querySelectorAll('span');
    spans.forEach((span, i) => {
      span.style.animation = `fadeIn 0.05s forwards ${i * 0.06}s`;
    });
  }
  // Garantir que a página sempre abra no topo (logo visível)
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  } catch (e) {
    // ignore
  }
  // pequenas esperas garantem que navegadores que restauram scroll não sobreponham
  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 50);
  setTimeout(() => window.scrollTo(0, 0), 250);
});