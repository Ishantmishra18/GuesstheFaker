const questionPairs = [
  { real: "What's one sense you could live without?", fake: "What's your strongest sense?" },
  { real: "What's your dream travel destination?", fake: "What's the last place you visited?" },
  { real: "Which subject did you enjoy the most in school?", fake: "What was your school's name?" },
  { real: "What's one food you hated as a child but love now?", fake: "What’s your favorite midnight snack?" },
  { real: "What's your biggest irrational fear?", fake: "What’s the last movie that scared you?" },
  { real: "Which video game requires the most skill?", fake: "What video game would you play with your future kids?" },
  { real: "How many days do you think you could survive in prison?", fake: "Pick a number between 1 and 30." },
  { real: "At what age should someone stop going to clubs?", fake: "Pick a range between 25 and 50." },
  { real: "What's your ultimate pump-up song?", fake: "What’s your favorite ringtone?" },
  { real: "How much money would it take for you to run naked down the street right now?", fake: "Pick a number between ₹100 and ₹1 Crore." },
  { real: "Which celebrity, living or dead, would you like to have dinner with?", fake: "Which celebrity creeps you out?" },
  { real: "What sport do you think you could go pro in?", fake: "What's the hardest sport to go pro in?" },
  { real: "What would the title of your autobiography be?", fake: "What's one word that describes you?" },
  { real: "If you could bring any object around you to life, what would it be?", fake: "Which object around you do you use the least?" },
  { real: "How many gifts should someone give their partner on Valentine's Day?", fake: "Pick a number between 1 and 10." },
  { real: "How long would it take you to become a famous musician?", fake: "Pick a number in years." },
  { real: "How many points could you score against your favorite athlete?", fake: "Pick a number between 0 and 10." },
  { real: "If you had to live in a fictional world, which would you choose?", fake: "What's the worst fictional world to live in?" },
  { real: "What's the weirdest thing you did as a kid?", fake: "What's one way you'd try to skip school?" },
  { real: "How many close friends does the average person have?", fake: "Pick a number between 5 and 10." },
  { real: "What's the best job someone could have?", fake: "What job would your best friend be good at?" },
  { real: "If you could pick any animal to be your best friend, what would it be?", fake: "What's the most dangerous animal?" },
  { real: "Could 100 humans defeat a silverback gorilla?", fake: "Pick between Yes or No." },
  { real: "How many days could you go without pooping?", fake: "Pick a number between 1 and 10." },
  { real: "How many days could you survive without eating?", fake: "Pick a number between 1 and 40." },
  { real: "How much can you deadlift right now?", fake: "How much could you bench after a year of training?" },
  { real: "How many people would show up to your birthday party?", fake: "Pick a number between 5 and 100." },
  { real: "At what age did you first earn money?", fake: "At what age do most people get their first salary?" },
  { real: "If you could pick anyone to be your dad, real or fictional, who would it be?", fake: "Who’s the best fictional villain?" },
  { real: "If you could transfer into an anime world, who would you become?", fake: "Name an underrated anime character." },
  { real: "What's the worst first date idea?", fake: "What's a good first date idea?" },
  { real: "What’s the average age someone should start working?", fake: "Pick a range between 15 and 30." },
  { real: "What’s a festival you secretly dislike?", fake: "What’s your favorite Indian festival?" },
  { real: "Which friend do you trust the least with secrets?", fake: "Name a friend who tells the best stories." },
  { real: "What’s the most embarrassing thing you've searched online?", fake: "What's the last thing you Googled?" },
  { real: "Which professor do you think is secretly cool?", fake: "Who’s the strictest professor in your college?" },
  { real: "What's one app you can't live without?", fake: "What's the last app you installed?" },
  { real: "If you could time travel once, when and where would you go?", fake: "Would you go to the past or future?" },
  { real: "What lie do you tell the most?", fake: "When was the last time you lied?" },
  { real: "What’s your biggest red flag?", fake: "What’s one thing that annoys you in others?" },
  { real: "If you were invisible for a day, what would you do?", fake: "What’s your favorite superpower?" },
  { real: "What college event do you secretly hate?", fake: "What’s the best fest in your college?" },
  { real: "What rumor have you heard about yourself?", fake: "What’s the funniest thing you’ve heard recently?" },
  { real: "What’s the worst gift you've ever received?", fake: "What’s your favorite birthday gift ever?" },
  { real: "Which of your friends would betray you in a game for money?", fake: "Who’s the most competitive person you know?" },
  { real: "What's your most useless talent?", fake: "What's a random skill you have?" },
  { real: "If your life was a meme, what would the caption be?", fake: "What's your favorite meme?" },
  { real: "What’s the wildest thing you've done in college?", fake: "What was your last college trip?" },
  { real: "If you had to drop out today, what would you do next?", fake: "What’s your dream job after college?" },
    {
    real: "What's one app you can't live without?",
    fake: "What's the last app you installed?"
  },
  {
    real: "If you could time travel once, when and where would you go?",
    fake: "Would you go to the past or future?"
  },
  {
    real: "What lie do you tell the most?",
    fake: "When was the last time you lied?"
  },
  {
    real: "What’s your biggest red flag?",
    fake: "What’s one thing that annoys you in others?"
  },
  {
    real: "If you were invisible for a day, what would you do?",
    fake: "What’s your favorite superpower?"
  },
  {
    real: "What college event do you secretly hate?",
    fake: "What’s the best fest in your college?"
  },
  {
    real: "What rumor have you heard about yourself?",
    fake: "What’s the funniest thing you’ve heard recently?"
  },
  {
    real: "What’s the worst gift you've ever received?",
    fake: "What’s your favorite birthday gift ever?"
  },
  {
    real: "Which of your friends would betray you in a game for money?",
    fake: "Who’s the most competitive person you know?"
  },
  {
    real: "What's your most useless talent?",
    fake: "What's a random skill you have?"
  },
  {
    real: "If your life was a meme, what would the caption be?",
    fake: "What's your favorite meme?"
  },
  {
    real: "What’s the wildest thing you've done in college?",
    fake: "What was your last college trip?"
  },
  {
    real: "If you had to drop out today, what would you do next?",
    fake: "What’s your dream job after college?"
  },
  {
    real: "What’s the dumbest way you’ve injured yourself?",
    fake: "What’s the last time you got hurt?"
  },
  {
    real: "What’s something you’ve stolen and never returned?",
    fake: "What’s the last thing you borrowed?"
  },
  {
    real: "If you could get away with one crime, what would it be?",
    fake: "What’s the worst crime you’ve read about?"
  },
  {
    real: "What’s the cringiest phase you’ve gone through?",
    fake: "What’s a trend you used to love?"
  }
];

const getRandomQuestionPair = () => {
  const index = Math.floor(Math.random() * questionPairs.length);
  return questionPairs[index];
};

module.exports = {
  getRandomQuestionPair,
  questionPairs
};