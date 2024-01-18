import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PageHeading from 'ui/pageHeading';
import Gallery from 'ui/gallery';
import Accordion from 'ui/accordion';
import { CheckIcon, PhotoIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { InspectionData, ReportItemData, Gallery as GalleryData, PhotoList } from './types';
import styles from './inspection.module.css';
import { useParams } from 'react-router-dom';

const Inspection = () => {
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { id } = useParams();
  const photoGallery = inspectionData?.gallery.find((gallery) => gallery.gallery === 'photos');
  const baseUrl = 'https://api.grupoamericar.com/ms-proxy-inspection';
  //const baseUrl = 'http://localhost:3000/ms-proxy-inspection';

  useEffect(() => {
    axios
      .get(`${baseUrl}/inspection/${id}`)
      .then((response) => {
        const gallery = response.data?.gallery.map((gallery: GalleryData) => {
          return {
            ...gallery,
            images: gallery.images.map((image) => {
              const imageId = image.id;
              const src = `${baseUrl}/inspection/${id}/image/${imageId}?width=640`;
              const alt =
                gallery.gallery !== 'photos' && image.description
                  ? `Descripción: ${image.description}`
                  : '';
              const description =
                gallery.gallery === 'photos'
                  ? image.name
                  : image.description
                  ? image.description
                  : '';
              return {
                ...image,
                src,
                alt,
                description,
              };
            }),
          };
        });
        //response.data.categories = categories;
        response.data.gallery = gallery;

        setInspectionData(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar datos:', error);
      });
  }, [id]);

  const handlePercentageClick = (id: number) => {
    const divElement = accordionRefs.current[id];
    if (divElement) {
      divElement.click();
      divElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleDownload = (galleryData: any) => {
    window.open(`${baseUrl}/inspection/${id}/gallery/${galleryData.gallery}/images`, '_blank');
  };

  const selectIconsAlert = (item: ReportItemData) => {
    if (item.photos && item.photos.imageIds) {
      const images = item.photos.imageIds.map((photo) => {
        return {
          src: `${baseUrl}/inspection/${id}/image/${photo}`,
          alt: `${item.photos?.description}`,
        };
      });
      return (
        <Gallery
          images={images}
          current={0}
          description={Array.isArray(item.photos.tags) ? item.photos.tags.join(',') : ''}>
          <PhotoIcon className={styles.iconWarning}></PhotoIcon>
        </Gallery>
      );
    } else if (item.value === true) {
      return <CheckIcon className={styles.iconSuccess}></CheckIcon>;
    } else if (Array.isArray(item.value) && item.value.length === 1 && item.value[0] === 'ok') {
      return <CheckIcon className={styles.iconSuccess}></CheckIcon>;
    } else if (typeof item.value === 'string') {
      return <CheckIcon className={styles.iconSuccess}></CheckIcon>;
    } else if (typeof item.value === 'undefined') {
      return null;
    } else {
      return <CheckIcon className={styles.iconWarning}></CheckIcon>;
    }
  };

  const textTable = (item: ReportItemData) => {
    if (typeof item.value !== 'undefined') {
      if (typeof item.value === 'boolean') {
        return item.value === true ? 'Si' : 'No';
      } else if (typeof item.value === 'string') {
        return item.value;
      } else if (typeof item.value === 'number') {
        return item.value;
      } else if (Array.isArray(item.value)) {
        if (typeof item.value[0] === 'string') {
          return item.value.join(', ');
        } else {
          const descriptions = item.value.map((list) => {
            const aux = list as PhotoList;
            return aux.description ? aux.description : '';
          });
          return descriptions.join(',');
        }
      }
    }
    if (typeof item.value === 'undefined') {
      return 'No Aplica';
    }
    return '';
  };

  return (
    <div className={styles.content}>
      <div className={styles.row}>
        {/* HEADER */}
        <div className={styles.header}>
          <PageHeading
            title={inspectionData?.configId}
            section="Portal Inspección"
            description={inspectionData?.inspector}
            className={styles.heading}></PageHeading>
          <div className={styles.headerTable}>
            <table className={styles.table}>
              <tbody>
                {inspectionData?.car &&
                  Object.entries(inspectionData.car).map(([key, value], index) => (
                    <tr key={key} className={`${index % 2 === 0 ? styles.gray : styles.white} `}>
                      <td className={styles.textLeft}>{key}</td>
                      <td className={styles.textRight}>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* GALLERY */}
        <div className={styles.gallery}>
          {photoGallery && (
            <Gallery images={photoGallery.images} current={0} description="Galería de fotos">
              <div className={styles.container}>
                <img className={styles.img} src={photoGallery.images[0].src} alt="first image" />
              </div>
            </Gallery>
          )}
        </div>
        {/* DATA */}
        <div className={styles.mobileData}>
          <div className={styles.container}>
            <table className={styles.table}>
              <tbody>
                {inspectionData?.car &&
                  Object.entries(inspectionData.car).map(([key, value], index) => (
                    <tr key={key} className={`${index % 2 === 0 ? styles.gray : styles.white} `}>
                      <td className={styles.textLeft}>{key}</td>
                      <td className={styles.textRight}>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PERCENT */}
        <div className={styles.percent}>
          <div className={styles.container}>
            <div className={styles.grids}>
              {inspectionData?.categories?.map((category, index) => (
                <div
                  key={index}
                  className={`${styles.item} 
                    ${
                      index % 2 === 0 &&
                      index !== inspectionData.categories.length - 1 &&
                      styles.border
                    }
                    ${
                      index === inspectionData.categories.length - 1 &&
                      index % 2 === 0 &&
                      styles.colspan
                    }`}
                  onClick={() => handlePercentageClick(index)}>
                  <h2>{category.title}</h2>
                  <h3>{(category.score * 100).toFixed(0) + '%'}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* DETAIL ACCORDION */}
      <div className={styles.accordion}>
        {inspectionData?.report[0] && (
          <div className={`${styles.full} ${styles.container} `}>
            <Accordion
              id={`accordion-${inspectionData?.report[0].id}`}
              title={inspectionData?.report[0].title}>
              <div className={styles.responsiveTables}>
                {inspectionData?.report[0].data.length > 0 && (
                  <table>
                    <tbody>
                      {inspectionData?.report[0].data
                        .slice(0, Math.ceil(inspectionData?.report[0].data.length / 2))
                        .map((dataItem, index) => (
                          <tr
                            key={index}
                            className={`${styles.item__h} ${
                              index % 2 === 0 ? styles.gray : styles.white
                            } `}>
                            <td className={styles.contentTitle}>
                              <h6 className={styles.title}>{dataItem.title}</h6>
                              <p className={styles.mobileDescription}>{textTable(dataItem)}</p>
                            </td>
                            <td className={styles.description}>
                              <span>{textTable(dataItem)}</span>
                            </td>
                            {/* <td className={styles.right}>
                              <div className={styles.center}>{selectIconsAlert(dataItem)}</div>
                            </td> */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}

                {inspectionData?.report[0].data.length > 0 && (
                  <table>
                    <tbody>
                      {inspectionData?.report[0].data
                        .slice(Math.ceil(inspectionData?.report[0].data.length / 2))
                        .map((dataItem, index) => (
                          <tr
                            key={index}
                            className={`${styles.item__h} ${
                              index % 2 === 0 ? styles.gray : styles.white
                            } `}>
                            <td className={styles.contentTitle}>
                              <h6 className={styles.title}>{dataItem.title}</h6>
                              <p className={styles.mobileDescription}>{textTable(dataItem)}</p>
                            </td>
                            <td className={styles.description}>{textTable(dataItem)}</td>
                            <td className={styles.right}>
                              {/* <div className={styles.center}>{selectIconsAlert(dataItem)}</div> */}
                            </td>
                          </tr>
                        ))}
                      {inspectionData?.report[0].data.length % 2 === 1 && <tr></tr>}
                    </tbody>
                  </table>
                )}
              </div>
            </Accordion>
          </div>
        )}
      </div>
      {/* ACCORDIONS */}
      <div className={styles.accordion}>
        {inspectionData?.report.slice(1).map((report, index) => (
          <div className={styles.container} key={index}>
            <Accordion
              ref={(el) => (accordionRefs.current[index] = el)}
              id={`accordion-${index}`}
              title={report.title}>
              <div>
                <table>
                  <tbody>
                    {report.data.map((dataItem, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? styles.gray : styles.white} `}>
                        <td className={styles.contentTitle}>
                          <h6 className={styles.title}>{dataItem.title}</h6>
                          <p className={styles.mobileDescription}>{textTable(dataItem)}</p>
                        </td>
                        <td className={styles.description}>{textTable(dataItem)}</td>
                        <td className={styles.right}>
                          <div className={styles.center}>{selectIconsAlert(dataItem)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Accordion>
          </div>
        ))}
      </div>
      {/* GALLERY */}
      <div className={styles.galleries}>
        <Accordion title={'galerias'}>
          <div className={styles.container}>
            {inspectionData?.gallery.map((item, index) => (
              <div
                className={`${styles.galleryAccordion} 
            ${index % 2 === 0 ? styles.gray : styles.white}`}
                key={index}>
                <div className={styles.title}>
                  <h2>{item.gallery}</h2>
                  <span className={styles.counter}>
                    {item.images.length + ' Fotos '}{' '}
                    <button onClick={() => handleDownload(item)}>
                      <ArrowDownTrayIcon className={styles.icon} />
                    </button>
                  </span>
                </div>
                <Gallery images={item.images} current={0} description={item.gallery} key={item.id}>
                  <div className={styles.imageContainer}>
                    <img src={item.images[0].src} alt={item.images[0].description} />
                  </div>
                </Gallery>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default Inspection;
