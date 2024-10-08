export interface ITopBar {
  logo: {
    action?: any,
    image?: string,
    productName?: string
    altImage?: string
  };
  toogleButton: {
    action?: any,
    icon?: string,
    ariaLabel?: string
  };
  userInfo: {
    label?: string,
    name?: string,
    email?: string,
    image?: string,
    lastLogin?: string,
    model?: any[],
    expandAriaLabel?: string
    altImage?: string
  };
  contentRightLabel?: string;
}
