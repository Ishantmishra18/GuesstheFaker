const questionPairs = [
  {
    real: "What's the one sense you can live without?",
    fake: "What's your strongest sense?"
  },
  {
    real: "What's your dream travel destination?",
    fake: "What's the last place you visited?"
  },
  {
    real: "Which subject did you love most in school?",
    fake: "What was your school’s name?"
  },
  {
    real: "What's a food you hated as a child but love now?",
    fake: "What’s your go-to midnight snack?"
  },
  {
    real: "What's your biggest irrational fear?",
    fake: "What’s the last movie that scared you?"
  },
]

const getRandomQuestionPair = () => {
  const index = Math.floor(Math.random() * questionPairs.length)
  return questionPairs[index]
}

module.exports = {
  getRandomQuestionPair,
  questionPairs
}



