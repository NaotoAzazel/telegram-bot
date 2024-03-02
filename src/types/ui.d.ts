export type ButtonItem = {
  name: string;
  value: string;
}

export type MenuItem = {
  switchToInline?: ButtonItem[];
  buttons?: ButtonItem[]; 
}