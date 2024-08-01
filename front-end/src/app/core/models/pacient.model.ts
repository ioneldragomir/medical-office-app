export interface Pacient {
  id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password?: string;
  passwordConfirm?: string;
  type?: string;
}