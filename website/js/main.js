// Gallery filters
document.querySelectorAll('.filters button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filters button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    var f = btn.dataset.filter;
    document.querySelectorAll('.g-item').forEach(function (item) {
      item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
    });
  });
});

// Mark current page in nav
(function () {
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.site a').forEach(function (a) {
    var href = a.getAttribute('href').split('/').pop();
    if (href === here) a.classList.add('here');
  });
})();
