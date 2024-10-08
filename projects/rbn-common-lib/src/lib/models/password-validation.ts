export interface IPwValidationConfig {
  idElm?: string,
  pwdClass?: string,
  displayInRow?: boolean,
  usePasswordPolicy?: boolean,
  usePasswordRequired?: boolean,
  minLength?: number,
  maxLength?: number,
  pwNoSpecialCharacter?: boolean,
  requiredSpecialCharacter?: boolean,
  specialCharacterList?: RegExp
}
