import { useState } from "react"
import styles from "./index.module.scss"
import { ChevronDown } from "lucide-react"
import clsx from "clsx"

interface IProps {
  selectedColor: string
  colors: string[]
  gradientColors: string[]
  onSelect: (color: string) => void
}

export default function ColorPicker({
  selectedColor,
  colors,
  gradientColors,
  onSelect,
}: IProps) {
  const [gradientsVisible, setGradientsVisible] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.label}>Colors</div>
        <div className={styles.grid}>
          {colors.map((color, index) => {
            return (
              <div
                key={index}
                onClick={() => onSelect(color)}
                style={{ background: color }}
                className={clsx(
                  styles.color,
                  color === selectedColor && styles.selected
                )}
              />
            )
          })}
        </div>
        {gradientColors && gradientsVisible && (
          <div className={styles.wrapper}>
            <div className={styles.label}>Gradients</div>
            <div className={styles.grid}>
              {gradientColors.map((color, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => onSelect(color)}
                    style={{ background: color }}
                    className={clsx(
                      styles.color,
                      color === selectedColor && styles.selected
                    )}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div
        onClick={() => setGradientsVisible(!gradientsVisible)}
        className={clsx(styles.arrow, gradientsVisible && styles.rotate)}
      >
        <ChevronDown />
      </div>
    </div>
  )
}
