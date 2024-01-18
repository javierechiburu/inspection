import type { ImageListItem } from '@/pages/Form/types';
import useWizard from '@/pages/Form/hooks/useWizard';
import { useAxios } from 'library/api';
import styles from './imageItem.module.css';

type ImageItemProps = {
  image: ImageListItem;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const ImageItem = ({ image, onClick }: ImageItemProps) => {
  const { id } = useWizard();
  const { api } = useAxios();
  const baseUrl = api.getUri();

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.image}>
        <div className={styles.loading}>Cargando...</div>
        {typeof image.value !== 'string' ? (
          <img src={URL.createObjectURL(image.value as File)} alt={image.description} />
        ) : (
          <img
            src={`${baseUrl}inspection/${id}/image/${image.value as string}?width=320`}
            alt={image.description}
          />
        )}
      </div>
    </div>
  );
};

export default ImageItem;
