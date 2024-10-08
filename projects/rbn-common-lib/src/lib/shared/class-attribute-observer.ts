export class ClassAttributeObserver {
  targetNode: HTMLElement;
  classToWatch: string;
  classAddedCallback: Function;
  classRemovedCallback: Function;
  observer: any;
  lastClassState: boolean;

  constructor(targetNode: HTMLElement, classToWatch: string, classAddedCallback?: Function, classRemovedCallback?: Function) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  mutationCallback = (mutationsList: any) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const currentClassState = mutation.target.classList.contains(this.classToWatch);
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          if (currentClassState) {
            if (this.classAddedCallback) {
              this.classAddedCallback();
            }
          } else {
            if (this.classRemovedCallback) {
              this.classRemovedCallback();
            }
          }
        }
      }
    }
  };
}
