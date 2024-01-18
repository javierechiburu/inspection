/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  InspectionConfig,
  InspectionData,
  InspectionConfigGroup,
  InspectionConfigField,
  ImageGalleryItem,
  Gallery,
  ImageListItem,
  Report,
  InspectionConfigImage,
  NotAnsweredField,
} from '../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import WizardContext from '../contexts/wizard.context';
import { useAxios } from 'library/api';
export type WizardProviderProps = {
  id?: string;
  config: InspectionConfig;
  data: InspectionData;
};

const WizardProvider: React.FC<React.PropsWithChildren<WizardProviderProps>> = ({
  id,
  children,
  config,
  data,
}) => {
  const [galleriesDescription, setGalleriesDescription] = useState<Record<string, any>>({});
  const { api } = useAxios();
  const [fields, setFields] = useState<Record<string, any>>(
    getFieldsInitialValues(config.groups, data)
  );
  const [galleries, setGalleries] = useState<Record<string, any>>(
    getGalleriesInitialValues(config.groups, data)
  );
  const [lastReportSent, setLastReportSent] = useState<Report>({});
  const [step, setStep] = useState<number>(0);

  //console.log('wizard fields', fields);
  useEffect(() => {
    const setGalleriesDescriptionDefault = () => {
      data.gallery.forEach((gallery) => {
        gallery.image.forEach((image) => {
          setGalleriesDescription((prev) => ({
            ...prev,
            ...{ [image.questionId]: image.description },
          }));
        });
      });
    };
    if (data) {
      setGalleriesDescriptionDefault();
    }
  }, [setGalleriesDescription, data.gallery, data]);
  //console.log('galleries', galleriesDescription);

  const changeStep = (value: number) => {
    setStep(value);
  };

  const updateField = (key: string, value: any) => {
    setFields((prev) => ({ ...prev, ...{ [key]: value } }));
  };

  const updateGallery = (key: string, value: any) => {
    setGalleries((prev) => ({ ...prev, ...{ [key]: value } }));
  };
  const updateGalleriesDescription = (key: string, value: any) => {
    setGalleriesDescription((prev) => ({
      ...prev,
      ...{ [key]: value },
    }));
  };

  const getField = useCallback((key: string) => fields[key], [fields]);
  const getGalleriesField = useCallback((key: string) => galleries[key], [galleries]);

  const saveDraft = useCallback(
    async (type: string) => {
      const report: Report = {};
      Object.keys(fields).forEach((questionId) => {
        if (fields[questionId] !== '' && questionId !== 'photos') {
          report[questionId] = fields[questionId];
        }
      });
      if (JSON.stringify(lastReportSent) !== JSON.stringify(report) || type === 'save') {
        const saveInspectionResponse = await api.patch(`/bff/inspection/${id}/${type}`, { report });
        //refinar lógica, es para evitar envíos al backend si solo se mueven por las pestañas sin hacer nada
        setLastReportSent(report);
        return saveInspectionResponse;
      }
    },
    [fields, api, id, lastReportSent]
  );
  const getGalleriesDescription = useCallback(
    (questionId: string) => galleriesDescription[questionId],
    [galleriesDescription]
  );

  const checkRequiredFields = useCallback(
    (section: string | null) => {
      const requiredQuestionsNotAnswered: NotAnsweredField[] = [];
      const filteredGroups = config.groups.filter((group) =>
        section ? group.id === section : group
      );
      filteredGroups.map((group) =>
        group.data
          .filter((question) => question.required)
          .forEach((question) => {
            if (question.component !== 'PhotoUploadList') {
              const fieldFound = getField(question.id);
              if (!question.visibleWhen) {
                //Flujo normal que no pueden quedar sin respuesta
                if (typeof fieldFound === 'undefined' || fieldFound === '' || fieldFound === null) {
                  requiredQuestionsNotAnswered.push({
                    question: question.id,
                    questionTitle: question.title,
                    section: group.title,
                  });
                }
              } else {
                const referencedQuestionValue = getField(question.visibleWhen.id);
                let isVisible = false;
                if (question.visibleWhen.equals) {
                  isVisible = Array.isArray(question.visibleWhen?.value)
                    ? question.visibleWhen.value.includes(referencedQuestionValue)
                    : referencedQuestionValue;
                } else if (question.visibleWhen.notIn) {
                  isVisible = !question.visibleWhen.notIn.includes(referencedQuestionValue);
                } else if (question.visibleWhen.in) {
                  isVisible = question.visibleWhen.in.includes(referencedQuestionValue);
                }
                if (
                  isVisible &&
                  (typeof fieldFound === 'undefined' || fieldFound === '' || fieldFound === null)
                ) {
                  requiredQuestionsNotAnswered.push({
                    question: question.id,
                    questionTitle: question.title,
                    section: group.title,
                  });
                }
              }
            } else {
              if (question.data) {
                const galleryFound = galleries[question.galleryId];
                question.data.forEach((photo: InspectionConfigImage) => {
                  const photoFound = galleryFound.find(
                    (galleryImage: ImageGalleryItem) => galleryImage.id === photo.id
                  );
                  if (!photoFound || typeof photoFound.value !== 'undefined') {
                    requiredQuestionsNotAnswered.push({
                      question: photoFound.id,
                      questionTitle: photoFound.name,
                      section: group.title,
                    });
                  }
                });
              } else {
                const galleryFound = galleries[question.id];
                if (!galleryFound || galleryFound.length === 0) {
                  requiredQuestionsNotAnswered.push({
                    question: question.id,
                    questionTitle: question.title,
                    section: group.title,
                  });
                }
              }
            }
          })
      );
      return requiredQuestionsNotAnswered;
    },
    [config.groups, getField, galleries]
  );

  useEffect(() => {
    const element = document.getElementById('main');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  const contextValue = useMemo(
    () => ({
      id,
      fields,
      step,
      changeStep,
      updateField,
      getField,
      getGalleriesField,
      updateGallery,
      getGalleriesDescription,
      updateGalleriesDescription,
      checkRequiredFields,
      saveDraft,
      galleries,
    }),
    [
      id,
      fields,
      step,
      getField,
      getGalleriesField,
      getGalleriesDescription,
      checkRequiredFields,
      saveDraft,
      galleries,
    ]
  );

  return <WizardContext.Provider value={contextValue}>{children}</WizardContext.Provider>;
};

export default WizardProvider;

const getGalleriesInitialValues = (groups: InspectionConfigGroup[], data: InspectionData) => {
  const fields = groups.reduce((acc, cur) => {
    const group = cur.data.reduce((prev, field: InspectionConfigField) => {
      if (field.component === 'PhotoUploadList') {
        const gallery = data.gallery.find((el) => el.type === field.galleryId);
        if (field.data) {
          const value: ImageGalleryItem[] = field.data.map((el) => ({
            id: el.id,
            name: el.name,
            value: gallery ? getImageValue(gallery, el.id, true) : new File([], ''),
          }));
          return { ...prev, [field.id]: value };
        }
        const value: ImageListItem[] = [];
        if (gallery) {
          const images = gallery.image.find((el) => el.questionId === field.id);
          if (images) {
            images.items.forEach((el) =>
              value.push({
                id: el.id,
                description: el.description,
                value: el.key,
                tags: images.tags,
              })
            );
          }
        }
        return { ...prev, [field.id]: value };
      } else {
        if (field.addGalleryWhen) {
          const gallery = data.gallery.find(
            (el) => field.addGalleryWhen && el.type === field.addGalleryWhen.galleryId
          );
          const value: ImageListItem[] = [];
          if (gallery) {
            const images = gallery.image.find((photo) => photo.questionId === field.id);
            if (images) {
              images.items.forEach((el) => {
                value.push({
                  id: el.id,
                  description: images.description,
                  value: el.key,
                  tags: images.tags,
                });
              });
            }
            return { ...prev, [field.id]: value };
          }
        }
      }
      return { ...prev };
    }, {});
    return { ...acc, ...group };
  }, {});

  return { ...fields };
};

const getFieldsInitialValues = (groups: InspectionConfigGroup[], data: InspectionData) => {
  const fields = groups.reduce((acc, cur) => {
    const group = cur.data.reduce((prev, field: InspectionConfigField) => {
      if (field.component !== 'PhotoUploadList') {
        return { ...prev, [field.id]: '' };
      }
      return { ...prev };
    }, {});
    return { ...acc, ...group };
  }, {});

  return { ...fields, ...data.report };
};

const getImageValue = (gallery: Gallery, id: string, isGallery?: boolean) => {
  if (isGallery) {
    const item = gallery.image.find((image) => image.items.find((el) => el.key === id));
    return item ? undefined : new File([], '');
  }
  return undefined;
};
