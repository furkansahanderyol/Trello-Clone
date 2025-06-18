import { useState } from "react"
import styles from "./index.module.scss"
import Dropzone from "react-dropzone"
import { CloudUpload } from "lucide-react"
import Button from "@/components/Button"
import Image from "next/image"
import { useAtom } from "jotai"
import { modalContentAtom } from "@/store"
import Cropper, { Area } from "react-easy-crop"
import { userSettingsService } from "@/services/userSettingsService"

export default function UploadImageModal() {
  const [, setModalContent] = useAtom(modalContentAtom)
  const [step, setStep] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedImage, setCroppedImage] = useState<Blob | undefined>(undefined)

  function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImageUrl(imageUrl)
    }
  }

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = document.createElement("img")
      image.src = url
      image.onload = () => resolve(image)
      image.onerror = (error) => reject(error)
    })
  }

  async function getCroppedImg(
    imageSrc: string,
    zoom: number,
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ): Promise<Blob | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      image,
      croppedAreaPixels.x / zoom,
      croppedAreaPixels.y / zoom,
      croppedAreaPixels.width / zoom,
      croppedAreaPixels.height / zoom,
      0,
      0,
      canvas.width,
      canvas.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, "image/jpeg")
    })
  }

  return step === 0 ? (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {imageUrl ? (
          <div className={styles.selectedImage}>
            <Image src={imageUrl} fill alt="Selected profile image." />
          </div>
        ) : (
          <Dropzone maxFiles={1} accept={{ "image/*": [] }} onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div className={styles.inner}>
                <div className={styles.inputWrapper} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <CloudUpload />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </div>
            )}
          </Dropzone>
        )}

        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setModalContent(undefined)
            }}
            className={styles.button}
            type="button"
            text="Cancel"
          />
          <Button
            onClick={() => setStep(1)}
            className={styles.button}
            type="button"
            text="Continue"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Cropper
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          image={imageUrl}
          style={{
            containerStyle: {
              position: "relative",
              width: "60%",
              height: "60%",
            },
          }}
          onCropComplete={async (_, croppedAreaPixels) => {
            const croppedImage = await getCroppedImg(
              imageUrl!,
              zoom,
              croppedAreaPixels
            )

            if (croppedImage) {
              setCroppedImage(croppedImage)
            }
          }}
        />
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setModalContent(undefined)
            }}
            className={styles.button}
            type="button"
            text="Cancel"
          />
          <Button
            onClick={() => {
              if (croppedImage) {
                userSettingsService.uploadProfileImage(croppedImage)
              }
            }}
            className={styles.button}
            type="button"
            text="Continue"
          />
        </div>
      </div>
    </div>
  )
}
