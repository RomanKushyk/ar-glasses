import './add-new-glasses.scss';

import { FC } from 'react';
import { FileUpload } from '../FileUpload';
import { GlassesList } from '../GlassesList';

export const AddNewGlasses: FC = () => {
  return (
    <section className="add-new-glasses">
      <FileUpload/>

      <GlassesList/>
    </section>
  );
};
