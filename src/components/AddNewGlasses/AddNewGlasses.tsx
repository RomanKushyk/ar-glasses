import './add-new-glasses.scss';

import { FC } from 'react';
import { FileUpload } from '../FileUpload/FileUpload';
import { GlassesList } from '../GlassesList/GlassesList';

export const AddNewGlasses: FC = () => {
  return (
    <section className="add-new-glasses">
      <FileUpload/>

      <GlassesList/>
    </section>
  );
};
