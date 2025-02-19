export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};