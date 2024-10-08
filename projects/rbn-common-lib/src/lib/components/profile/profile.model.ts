export interface ILogoutCustomMessage {
  title?: string;
  content?: string;
  titleAccept?: string;
  titleReject?: string;
}

export interface IProfileInfoShowing {
  general?: boolean;
  changePassword?: IPasswordCheck;
  timezone?: boolean;
}

export interface IProfileInfoEmit {
  general?: any;
  changePassword?: any;
  timezone?: any;
}

export interface IProfileInfoData {
  general?: any;
  changePassword?: any;
  timezone?: any;
}

export interface IPasswordCheck {
  expiredPassword?: boolean;
  forcedToResetPassword?: boolean;
}
