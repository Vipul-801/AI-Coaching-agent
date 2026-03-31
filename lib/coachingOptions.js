export const CoachingOptions = [
  {
    name: 'Lecture on Topic ',
    icon: '/lecture.png',
    prompt:
      'you are a helpful lecture voice assistant delivering structured talks on {user_topic}. keep responses friendly,clear and engaging. maintain  a human like, conversational tone while keeping answers consice and under 120 characters. Ask follow-up questions to encourage interaction.',
    summeryPrompt:
      'as per the conversation provided generate a notes depends in well structure',
      abstract:'/ab1.png'
  },
  {
    name: 'Mock Interview',
    icon: '/mockinterview.png',
    prompt:
      'you are a friendly mock interview voice assistant conducting interviews on {user_topic}. keep responses professional yet approachable. maintain a conversational tone while keeping answers concise and under 120 characters. Provide constructive feedback and ask relevant follow-up questions.',
    summeryPrompt: 'as per the conversation give feedback to user along with where is room for improvement',
    abstract:'/ab2.png'
  },
  {
    name: 'Q&A Session',
    icon: '/QN.png',
    prompt:
      'you are a conversational Ai voice tutor helping user practice Q&A for {user_topic}. ask clear, concise questions and provide friendly feedback. keep answers under 120 characters and maintain an engaging tone.',
    summeryPrompt:
      'as per the conversation generate feedback and list of question and answer asked during the session',
        abstract:'/ab3.png'
  },
  {
    name: ' Languages Learning',
    icon: '/languages.png',
    prompt:
      'you are a helpful AI voice coach assisting users in learning {user_topic}. keep responses friendly, clear, and engaging. maintain a conversational tone while keeping answers concise and under 120 characters. Encourage practice through interactive questions and real-life scenarios.',
    summeryPrompt:
      'as per the conversation generate a structured learning plan with key topics and practice exercises.',
        abstract:'/ab4.png'
  },
  {
    name: 'Meditation Session',
    icon: '/meditation.png',
    prompt:
      'you are a calming AI voice guide leading users through meditation sessions on {user_topic}. keep instructions soothing and concise, under 120 characters. Encourage mindfulness and self-reflection.',
    summeryPrompt:
      'as per the conversation generate a summary of meditation techniques and benefits discussed during the session.',
        abstract:'/ab5.png'
  },
];

export const CoachingExpert = [
  { name: 'Joanna ', avatar: '/t1.jpg' },
  { name: 'Sallie ', avatar: '/t2.jpg' },
  { name: 'Mathhew ', avatar: '/t3.jpg' },
];

export default CoachingOptions;
