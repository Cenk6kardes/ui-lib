import { Message } from 'primeng/api';

export enum Types {
  CLOSE_ITEM = 'closeItem',
  CLOSE_ALL = 'clearAll'
}
export enum TFrom {
  SERVER = 'server',
  LOCAL = 'local'
}

export enum Severity {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export enum AlertType {
  BASIC = 'basic',
  LARGE = 'large'
}

export interface MessageType {
  type: string;
  message?: Message;
}

export interface MessageToggle {
  count: number;
  messages?: Message[];
  toggle?: boolean;
}
