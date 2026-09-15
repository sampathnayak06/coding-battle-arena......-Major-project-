export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  
  // Check touch capability / Mobile user agent
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Check screen width against mobile target breakpoint
  const isMobileWidth = window.innerWidth <= 768;
  
  return isMobileUA || isMobileWidth;
}
