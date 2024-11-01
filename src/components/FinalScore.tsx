import Score from './Score';

import './Score.css'

type Props = {
    correctAnswers: number,
    totalAnswers: number,
}

export default function FinalScore({ correctAnswers, totalAnswers }: Props) {
    return (
        <>
            <Score
            correctAnswers={ correctAnswers }
            totalAnswers={ totalAnswers }
            />
            <div className='score'>
                { `${Math.round(correctAnswers / totalAnswers * 100)}%` }
            </div>
        </>
    );
}
  