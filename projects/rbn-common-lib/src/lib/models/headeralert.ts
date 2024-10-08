export class Headeralert {
  info = 0;
  debug = 0;
  error = 0;

  constructor(info: number, debug: number, error: number) {
    this.info = info;
    this.debug = debug;
    this.error = error;
  }
}
