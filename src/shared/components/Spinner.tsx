import styles from "./Spinner.module.css";

type SpinnerProps = {
  /** Diameter in pixels. */
  size?: number;
  label?: string;
};

export function Spinner({ size = 28, label = "Loading" }: SpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
    />
  );
}
