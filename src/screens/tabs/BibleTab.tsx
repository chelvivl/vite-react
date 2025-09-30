import TopBar from '../../components/TopBar';
import './BibleTab.css';
import { useNavigate } from 'react-router-dom';


export default function BibleTab() {
    const navigate = useNavigate();

  const openSynodal = () => {
     navigate('/bible');
  };

  const openNewRussian = () => {

  };

  const openBarclay = () => {

  };

  return (
    <div className="bible-alt__container">
      <TopBar title="Чтение" showBackButton={false} />
      <div className="bible-alt__list">
        <button onClick={openSynodal} className="bible-alt__item">
          <span className="bible-alt__label">Синодальный перевод</span>
          <span className="bible-alt__chevron">›</span>
        </button>

        <button onClick={openNewRussian} className="bible-alt__item">
          <span className="bible-alt__label">Новый русский перевод</span>
          <span className="bible-alt__chevron">›</span>
        </button>

        <button onClick={openBarclay} className="bible-alt__item">
          <span className="bible-alt__label">Комментарии Баркли</span>
          <span className="bible-alt__chevron">›</span>
        </button>
      </div>
    </div>
  );
}