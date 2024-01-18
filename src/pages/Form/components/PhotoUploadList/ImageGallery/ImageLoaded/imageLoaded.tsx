import type { ImageGalleryItem } from '@/pages/Form/types';
import { XMarkIcon } from '@heroicons/react/24/solid';
import useWizard from '@/pages/Form/hooks/useWizard';
import { useAxios } from 'library/api';
import styles from './imageLoaded.module.css';

type ImageLoadedProps = {
  image: ImageGalleryItem;
  onDelete: () => void;
};

const ImageLoaded = ({ image, onDelete }: ImageLoadedProps) => {
  const { id } = useWizard();
  const { api } = useAxios();
  const baseUrl = api.getUri();
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <div className={styles.loading}>Cargando...</div>
        {image.value ? (
          <img src={URL.createObjectURL(image.value)} alt={image.name} />
        ) : (
          <img src={`${baseUrl}inspection/${id}/image/${image.id}?width=320`} alt={image.name} />
        )}
      </div>
      <h4 className={styles.title}>{image.name}</h4>
      <button className={styles.delete} onClick={() => onDelete()} type="button">
        <XMarkIcon />
      </button>
    </div>
  );
};

export default ImageLoaded;
