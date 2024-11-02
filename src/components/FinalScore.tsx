import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import Score from './Score';

import './Score.css'

type Props = {
    showPercentage?: boolean,
};

export default function FinalScore({ showPercentage = false }: Props) {
    const { correctAnswers, totalAnswers } = useSelector((state: RootState) => state.score);

    return (
        <>
            <Score />
            { showPercentage &&
            <div className='score'>
                { `${Math.round(correctAnswers / totalAnswers * 100)}%` }
            </div>
            }
        </>
    );
}
  