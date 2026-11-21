/**
 * ObservEarth Documentation - Image Lightbox & Zoom Popup
 * Provides high-resolution modal popup viewing for documentation images
 */

(function () {
  'use strict';

  let modalEl = null;
  let modalImgEl = null;
  let modalTitleEl = null;
  let modalExternalLink = null;

  function createModal() {
    if (document.getElementById('image-lightbox-modal')) {
      modalEl = document.getElementById('image-lightbox-modal');
      modalImgEl = modalEl.querySelector('.image-lightbox-content');
      modalTitleEl = modalEl.querySelector('.image-lightbox-title');
      modalExternalLink = modalEl.querySelector('.image-lightbox-external');
      return;
    }

    modalEl = document.createElement('div');
    modalEl.id = 'image-lightbox-modal';
    modalEl.className = 'image-lightbox-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');

    modalEl.innerHTML = `
      <div class="image-lightbox-backdrop"></div>
      <div class="image-lightbox-header">
        <span class="image-lightbox-title">Image Preview</span>
        <div class="image-lightbox-actions">
          <a class="image-lightbox-btn image-lightbox-external" target="_blank" rel="noopener noreferrer" title="Open original image in new tab">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span style="margin-left: 6px; font-size: 12px;">Full Size</span>
          </a>
          <button type="button" class="image-lightbox-btn image-lightbox-close" title="Close Preview (Esc)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="image-lightbox-body">
        <img class="image-lightbox-content" src="" alt="" title="Click to close">
      </div>
    `;

    document.body.appendChild(modalEl);

    modalImgEl = modalEl.querySelector('.image-lightbox-content');
    modalTitleEl = modalEl.querySelector('.image-lightbox-title');
    modalExternalLink = modalEl.querySelector('.image-lightbox-external');

    // Close handlers
    const closeBtn = modalEl.querySelector('.image-lightbox-close');
    const backdrop = modalEl.querySelector('.image-lightbox-backdrop');

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    modalImgEl.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalEl.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  function openModal(src, alt) {
    if (!modalEl) createModal();

    modalImgEl.src = src;
    modalImgEl.alt = alt || 'ObservEarth Image Preview';
    modalTitleEl.textContent = alt || 'Image Preview';
    modalExternalLink.href = src;

    modalEl.classList.add('is-active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initLightboxes() {
    createModal();

    // Select content images, excluding icons, logos, or badges
    const images = document.querySelectorAll(
      '.md-content img:not(.twemoji):not(.emojione):not(.emoji):not([width="16"]):not([width="20"]):not([width="24"])'
    );

    images.forEach(function (img) {
      // Avoid double-wrapping
      if (img.closest('.image-lightbox-wrapper')) {
        return;
      }

      // Skip tiny icons
      if (img.naturalWidth > 0 && img.naturalWidth < 48) {
        return;
      }

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'image-lightbox-wrapper';

      // Insert wrapper before image, then move image into wrapper
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      // Create floating zoom icon badge
      const badge = document.createElement('div');
      badge.className = 'image-lightbox-badge';
      badge.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        <span>Enlarge</span>
      `;
      wrapper.appendChild(badge);

      // Click to open full image modal
      wrapper.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(img.currentSrc || img.src, img.alt);
      });
    });
  }

  // Support both Material/Zensical instant navigation observable and standard DOMContentLoaded
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(function () {
      initLightboxes();
    });
  } else {
    document.addEventListener('DOMContentLoaded', initLightboxes);
  }
})();
