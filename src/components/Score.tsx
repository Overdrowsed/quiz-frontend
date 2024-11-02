import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import './Score.css';

export default function Score() {
    const { correctAnswers, totalAnswers } = useSelector((state: RootState) => state.score);

    return (
        <div className='score'>
            {`${correctAnswers}/${totalAnswers}`}
        </div>
    );
}
  