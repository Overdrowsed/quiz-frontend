import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import Score from './Score';

import './Score.css'
import { PropsWithChildren } from 'react';

type Props = {
    showPercentage?: boolean,
};

export default function FinalScore({ showPercentage = false }: PropsWithChildren<Props>) {
    const { correctAnswers, totalAnswers } = useSelector((state: RootState) => state.score)
    console.log(showPercentage)
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
  