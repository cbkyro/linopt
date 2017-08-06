export default function scrollTarget(scrollTarget, $context) {
  const duration = 500;
  const easing = 'linear';
  $context = ($context ? $context : $('html, body'));

  $context.animate({
    scrollTop: $(scrollTarget).offset().top,
  }, duration, easing);
}
