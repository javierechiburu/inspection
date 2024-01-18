/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldProps } from '@/pages/Form/types';
import DateInput from 'ui/dateInput';
import NumberInput from 'ui/numberInput';
import Select from 'ui/select';
import Textarea from 'ui/textarea';
import TextInput from '@/components/TextInput';
import PhotoUploadList from '../../PhotoUploadList';
import SearchSelect from '../../SearchSelect';
import SelectWithOther from '../../SelectWithOther';
import ThumbSwitch from '../../ThumbSwitch';
import ThumbSwitchSelect from '../../ThumbSwitchSelect';
import ThumbSwitchMultiSelect from '../../ThumbSwitchMultiSelect';
import ThumbSwitchNA from '../../ThumbSwitchNA';
import useWizard from '../../../hooks/useWizard';

const Component = ({ control, field, setValue, ...props }: FieldProps) => {
  const { getGalleriesField } = useWizard();
  /*   const getTodaysDate = () => {
    return new Date().toISOString().split('T')[0];
  }; */

  switch (field.component) {
    case 'Date':
      return <DateInput block {...props} placeholder={' '} />;
    case 'inputNumber':
      return <NumberInput block {...props} />;
    case 'PhotoUploadList':
      return (
        <PhotoUploadList
          field={field}
          saveOnClose={true}
          {...props}
          value={getGalleriesField(field.id)}
        />
      );
    case 'SearchSelect':
      return <SearchSelect control={control} field={field} setValue={setValue} {...props} />;
    case 'SelectWithOther':
      return <SelectWithOther control={control} field={field} setValue={setValue} {...props} />;
    case 'Select':
      return <Select block {...props} options={field.options || []} />;
    case 'Textarea':
      return <Textarea block {...props} />;
    case 'ThumbSwitch':
      return <ThumbSwitch block field={field} {...props} />;
    case 'ThumbSwitchSelect':
      return <ThumbSwitchSelect block field={field} {...props} />;
    case 'ThumbSwitchMultiSelect':
      return <ThumbSwitchMultiSelect block field={field} {...props} />;
    case 'ThumbSwitchNA':
      return <ThumbSwitchNA block field={field} {...props} />;
    default:
      return <TextInput block {...props} />;
  }
};

export default Component;
