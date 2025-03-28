import clsx from 'clsx';
import styles from './index.module.scss';

interface Props {
  onClick: () => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  text?: string
  className?: string
  type: 'submit' | 'button'
}

export default function Button({
  onClick,
  prefix,
  suffix,
  text,
  className,
  type,
}: Props) {
  return (
    <button
      type={type}
      className={clsx(className ? className : styles.button)}
      onClick={onClick}
    >
      <span className={styles.prefix}>{prefix}</span>
      <span className={styles.text}>{text}</span>
      <span className={styles.suffix}>{suffix}</span>
    </button>
  );
}
