
export default function (breakpoint) {
  const windowWidth = document.documentElement.clientWidth;

  let jsBreakpoint = windowWidth > 1350;

  if (windowWidth >= 1280) {
    jsBreakpoint = 'xl';
  } else if (windowWidth >= 1060) {
    jsBreakpoint = 'l';
  } else if (windowWidth >= 960) {
    jsBreakpoint = 'm';
  } else if (windowWidth >= 720) {
    jsBreakpoint = 'ms';
  } else if (windowWidth >= 500) {
    jsBreakpoint = 's';
  } else {
    jsBreakpoint = 'xs';
  }

  return (jsBreakpoint === breakpoint);
}
