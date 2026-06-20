document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENÚ DE NAVEGACIÓN MÓVIL ---
  const navToggle = document.getElementById('js-nav-toggle');
  const navMenu = document.getElementById('js-nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- 2. FILTRADO DEL CATÁLOGO ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase activa de todos y añadir al actual
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Efecto de desvanecimiento suave
        card.style.opacity = '0';
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 200);
      });
    });
  });

  // --- 3. MODAL DE DETALLE DE PRODUCTO ---
  const modal = document.getElementById('js-product-modal');
  const modalClose = document.getElementById('js-modal-close');
  const modalImage = document.getElementById('js-modal-image');
  const modalCategory = document.getElementById('js-modal-category');
  const modalTitle = document.getElementById('js-modal-title');
  const modalDesc = document.getElementById('js-modal-desc');
  const modalCta = document.getElementById('js-modal-cta');

  productCards.forEach(card => {
    const viewDetailsBtn = card.querySelector('.js-view-details');
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obtener datos de la tarjeta
        const title = card.querySelector('.product-title').textContent;
        const category = card.querySelector('.product-category-tag').textContent;
        const image = card.getAttribute('data-image');
        const details = card.getAttribute('data-details');
        
        // Rellenar modal
        modalImage.src = image;
        modalImage.alt = title;
        modalCategory.textContent = category;
        modalTitle.textContent = title;
        modalDesc.textContent = details;
        
        // Configurar enlace personalizado de WhatsApp
        const waText = encodeURIComponent(`Hola Recuerditos! Me interesa cotizar y saber más detalles sobre el producto: ${title}`);
        modalCta.href = `https://api.whatsapp.com/send?phone=56988893336&text=${waText}`;
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
      });
    }
  });

  // Cerrar modal
  if (modalClose && modal) {
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restaurar scroll
    };

    modalClose.addEventListener('click', closeModal);
    
    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // --- 4. FORMULARIO DE COTIZACIÓN + WHATSAPP ---
  const cotizarForm = document.getElementById('js-cotizar-form');

  if (cotizarForm) {
    cotizarForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Recopilar datos
      const nombre = document.getElementById('form-nombre').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const fecha = document.getElementById('form-fecha').value;
      const evento = document.getElementById('form-evento').value;
      const detalles = document.getElementById('form-detalles').value.trim();

      // Recopilar productos seleccionados
      const productosCheckboxes = document.querySelectorAll('.js-prod-check:checked');
      const productosSeleccionados = [];
      productosCheckboxes.forEach(cb => {
        productosSeleccionados.push(cb.value);
      });

      // Validación simple de checkboxes
      if (productosSeleccionados.length === 0) {
        alert('Por favor, selecciona al menos un producto que te interese.');
        return;
      }

      // Dar formato de fecha amigable (DD/MM/AAAA)
      let fechaFormateada = fecha;
      if (fecha) {
        const partes = fecha.split('-');
        fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }

      // Construir mensaje para WhatsApp
      const mensaje = `¡Hola Recuerditos.cl! 🧁\n\n` +
                      `Me gustaría cotizar para un evento. Aquí están los detalles:\n\n` +
                      `• Nombre: ${nombre}\n` +
                      `• Email: ${email}\n` +
                      `• Tipo de Evento: ${evento}\n` +
                      `• Fecha del Evento: ${fechaFormateada}\n` +
                      `• Productos de Interés: ${productosSeleccionados.join(', ')}\n\n` +
                      `• Idea de diseño y detalles:\n"${detalles}"`;

      // Codificar el texto para URL
      const mensajeCodificado = encodeURIComponent(mensaje);
      
      // WhatsApp URL (Número de Laly: +56 9 8889 3336)
      const whatsappURL = `https://api.whatsapp.com/send?phone=56988893336&text=${mensajeCodificado}`;

      // Abrir en una nueva pestaña
      window.open(whatsappURL, '_blank');

      // Feedback al usuario y resetear formulario
      alert('¡Gracias por tu cotización! Se abrirá WhatsApp para que nos envíes los detalles y conversemos directamente.');
      cotizarForm.reset();
    });
  }
});
