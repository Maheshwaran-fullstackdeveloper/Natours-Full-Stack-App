export const hideAlert = () => {
  const alertEl = document.querySelector('.alert');
  if (alertEl) alertEl.parentElement.removeChild(alertEl);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const alertMarkup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alertMarkup);
  window.setTimeout(hideAlert, 5000);
};
