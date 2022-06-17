import './top-navigation-bar.scss';
import {FC, ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

interface Props {
  children: ReactNode,
}

export const TopNavigationBar: FC<Props> = ({children}) => {
  const navigate = useNavigate();

  return (
    <nav className="top-navigation-bar admin-page__top-navigation-bar">
      <button
        className="top-navigation-bar__button top-navigation-bar__button_back"
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      />

      {children}
    </nav>
  );
};
