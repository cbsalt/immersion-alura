import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import QuizLogo from '../../components/QuizLogo';
import Widget from '../../components/Widget';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import BackLinkArrow from '../../components/BackLinkArrow';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <Loader />
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Performance:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {results.reduce((acc, currentResult) => {
            const isCorrect = currentResult === true;
            if (isCorrect) {
              return acc + 1;
            }
            return acc;
          }, 0)}
          {' '}
          questões
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${Math.random(result)}`}>
              #
              {index + 1}
              {' '}
              Pergunta:
              {' '}
              {result === true ? 'Acertou' : 'Errou!'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question, totalQuestions, questionIndex, onSubmit, addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm onSubmit={(event) => {
          event.preventDefault();
          setIsQuestionSubmitted(true);
          setTimeout(() => {
            addResult(isCorrect);
            onSubmit();
            setIsQuestionSubmitted(false);
            setSelectedAlternative(undefined);
          }, 3 * 1000);
        }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmitted && alternativeStatus}
              >
                {alternative}
                <input
                  style={{ display: 'none' }}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmitted && isCorrect && <p>Certa a resposta!</p>}
          {isQuestionSubmitted && !isCorrect && <p>Errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ externalQuestions, dbExterno }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const totalQuestions = externalQuestions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const bg = dbExterno;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            question={question}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT
        && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}

QuestionWidget.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
  totalQuestions: PropTypes.number.isRequired,
  questionIndex: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  addResult: PropTypes.func.isRequired,
};

ResultWidget.propTypes = {
  results: PropTypes.instanceOf(Array).isRequired,
};

QuizPage.defaultProps = {
  dbExterno: {},
};

QuizPage.propTypes = {
  externalQuestions: PropTypes.instanceOf(Array).isRequired,
  dbExterno: PropTypes.instanceOf(Object),
};
