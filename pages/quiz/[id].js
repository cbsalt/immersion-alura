import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

export default function QuizDaGaleraPage({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen
        externalQuestions={dbExterno.questions}
        externalBg={dbExterno.bg}
      />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');

  try {
    const dbExterno = await fetch(
      `https://${projectName}.${githubUser}.vercel.app/api/db`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Data error!');
      })
      .then((dataJson) => dataJson)
      .catch((err) => {
        console.log(err);
      });

    return {
      props: {
        dbExterno,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
}

QuizDaGaleraPage.propTypes = {
  dbExterno: PropTypes.instanceOf(Object).isRequired,
};
