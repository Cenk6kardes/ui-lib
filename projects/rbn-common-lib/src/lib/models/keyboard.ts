const keydown = 'keydown';
const keyup = 'keyup';

export const KeyEvent = {
  keydown,
  keyup
};

export const KeyCode = {
  Enter: 'Enter',
  Space: 'Space',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Escape: 'Escape'
};

export const Keydown = {
  Escape: keydown + '.escape',
  Enter: keydown + '.enter',
  Shift: {
    Tab: keydown + '.shift.tab'
  },
  Tab: keydown + '.tab',
  ArrowDown: keydown + '.ArrowDown'
};

export const Keyup = {
  Tab: keyup + '.tab'
};


