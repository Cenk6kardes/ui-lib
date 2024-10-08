export class ActiveElementHandler {

  public static oldActiveElements: any[] = [];

  // add temporary element to focusable temporary element list
  public static pushActiveElement(el: HTMLElement | Element) {
    const latestEl = this.oldActiveElements[this.oldActiveElements.length - 1];
    if (latestEl) {
      if (!latestEl.isEqualNode(el)) {
        this.oldActiveElements.push(el);
      }
    } else {
      this.oldActiveElements.push(el);
    }
  }

  public static popActiveElement() {
    return this.oldActiveElements.pop();
  }

  // focus on focusable temporary element
  public static focusValuableOldActiveElements() {
    const tempActiveEl = this.popActiveElement();
    if (tempActiveEl) {
      tempActiveEl.focus();
      if (!tempActiveEl.isEqualNode(document.activeElement) || tempActiveEl.tagName === 'BODY') {
        this.focusValuableOldActiveElements();
      }
    }
  }

  public static clearOldActiveElements() {
    this.oldActiveElements = [];
  }

  public static isHasTriggerAnimationOnDOM() {
    const overlay = [
      '.ng-trigger-overlayAnimation',
      '.ng-trigger-animation'
    ].join(',');
    const animationEl = document.querySelector(overlay);
    if (animationEl) {
      return true;
    } else {
      return false;
    }
  }

  // clear focusable temporary element list if the overlay is not on DOM
  public static clearOldActiveElementsWithCondition() {
    setTimeout(() => {
      if (!ActiveElementHandler.isHasTriggerAnimationOnDOM()) {
        ActiveElementHandler.clearOldActiveElements();
      }
    }, 300);
  }
}
