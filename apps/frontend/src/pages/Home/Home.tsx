import './Home.css';
import { Link } from '@tanstack/react-router';

export const Home = () => {
    const heroLetters = ['G', 'U', 'E', 'S', 'S'];

    return (
        <div className="home-page">
            <section className="home-page__hero">
                <div className="home-page__hero-word" aria-hidden="true">
                    {heroLetters.map((letter, index) => (
                        <span key={index} className="home-page__hero-letter">
                            {letter}
                        </span>
                    ))}
                </div>
                <h1 className="home-page__title">Zeewordle</h1>
                <p className="home-page__subtitle">
                    Guess the hidden word in 6 tries.
                </p>
                <Link to="/auth/register" className="home-page__cta">
                    Start playing
                </Link>
            </section>

            <section className="home-page__rules">
                <h2 className="home-page__rules-title">How to play</h2>
                <ul className="home-page__rules-list">
                    <li className="home-page__rules-item">
                        Each game picks a random word to guess
                    </li>
                    <li className="home-page__rules-item">
                        Every guess must be a valid word
                    </li>
                    <li className="home-page__rules-item">
                        Letter colors show how close your guess is
                    </li>
                </ul>
            </section>

            <section className="home-page__legend">
                <div className="home-page__legend-item">
                    <span className="tile tile--correct">A</span>
                    <p className="home-page__legend-label">
                        Correct letter, correct spot
                    </p>
                </div>
                <div className="home-page__legend-item">
                    <span className="tile tile--present">B</span>
                    <p className="home-page__legend-label">
                        Correct letter, wrong spot
                    </p>
                </div>
                <div className="home-page__legend-item">
                    <span className="tile tile--absent">C</span>
                    <p className="home-page__legend-label">
                        Letter not in the word
                    </p>
                </div>
            </section>
        </div>
    );
};
