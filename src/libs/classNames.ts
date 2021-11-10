export const classNames = (...classNames: (string | undefined | false)[]) =>
  classNames.reduce((a, b, index) => a + (b ? (index ? ' ' : '') + b : ''), '') as
    | string
    | undefined;
