import styles from './index.module.scss';

interface Props {
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  formHeader?: string
}

export default function Form({children, onSubmit, formHeader}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.formHeader}>{formHeader}</div>
      <form onSubmit={onSubmit} noValidate>
        <div>{children}</div>
      </form>
    </div>
  );
}
