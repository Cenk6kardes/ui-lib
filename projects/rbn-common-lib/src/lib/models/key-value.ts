export class KeyValue {
  key = '';
  value = '';
  valid = true;

  constructor(key: string, value: string, valid: boolean) {
    this.key = key;
    this.value = value;
    this.valid = valid;
  }
}
