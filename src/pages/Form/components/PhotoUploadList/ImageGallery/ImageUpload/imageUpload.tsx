import type { ImageGalleryItem } from '@/pages/Form/types';
import { CameraIcon } from '@heroicons/react/24/solid';
import styles from './imageUpload.module.css';

type ImageUploadProps = {
  image: ImageGalleryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload = ({ image, ...props }: ImageUploadProps) => {
  return (
    <div className={styles.wrapper}>
      <input id={image.id} hidden type="file" accept="image/*" {...props} />
      <label className={styles.label} htmlFor={image.id}>
        <div>
          <CameraIcon />
          Cargar Foto
          <br />
          {image.name}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;
