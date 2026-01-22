
/**
 * Triggers a vibration pattern for tactile feedback.
 * Uses the navigator.vibrate API which is supported on most mobile browsers.
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'warning' | 'success') => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  switch (type) {
    case 'light':
      navigator.vibrate(10);
      break;
    case 'medium':
      navigator.vibrate(25);
      break;
    case 'heavy':
      navigator.vibrate(50);
      break;
    case 'warning':
      navigator.vibrate([50, 30, 50]);
      break;
    case 'success':
      navigator.vibrate([20, 10, 20]);
      break;
  }
};
