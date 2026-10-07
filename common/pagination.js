(function initializePortalPagination() {
  function pageNumbers(currentPage, totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    if (currentPage >= totalPages - 3) return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }

  function renderPagination(container, currentPage, totalPages, onPageChange) {
    if (!container) return;

    container.hidden = totalPages <= 1;
    if (totalPages <= 1) {
      container.replaceChildren();
      container.onclick = null;
      return;
    }

    const control = (page, label, symbol, disabled = false) =>
      `<button class="btn btn--icon btn--sm btn--ghost" type="button" data-page="${page}" aria-label="${label}"${disabled ? ' disabled' : ''}><span aria-hidden="true">${symbol}</span></button>`;
    const numbers = pageNumbers(currentPage, totalPages).map((page) => {
      if (page === 'ellipsis') return '<span class="portal-pagination-ellipsis" aria-hidden="true">…</span>';
      const active = page === currentPage;
      return `<button class="btn btn--icon btn--sm btn--pill" type="button" data-page="${page}" aria-label="${page}페이지"${active ? ' aria-current="page"' : ''}>${page}</button>`;
    }).join('');

    container.innerHTML =
      control(1, '첫 페이지', '«', currentPage === 1) +
      control(currentPage - 1, '이전 페이지', '‹', currentPage === 1) +
      numbers +
      control(currentPage + 1, '다음 페이지', '›', currentPage === totalPages) +
      control(totalPages, '마지막 페이지', '»', currentPage === totalPages);

    container.onclick = (event) => {
      const button = event.target.closest('[data-page]');
      if (!button || button.disabled) return;
      onPageChange(Number(button.dataset.page));
    };
  }

  window.PortalPagination = {
    pageNumbers,
    renderPagination
  };
}());
