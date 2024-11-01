import './Score.css'

type Props = {
    correctAnswers: number,
    totalAnswers: number,
}

export default function Score({ correctAnswers, totalAnswers }: Props) {
    return (
        <div className='score'>
            {`${correctAnswers}/${totalAnswers}`}
        </div>
    );
}
  