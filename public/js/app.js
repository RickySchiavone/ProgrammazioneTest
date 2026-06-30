document.querySelectorAll('.sidebar-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-nav a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
