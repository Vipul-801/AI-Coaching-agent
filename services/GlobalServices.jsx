import axios from "axios";


export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  const data = result.data;


  if (!data) throw new Error('Empty token response from /api/getToken');
  if (typeof data === 'string') return data;
  if (typeof data.token === 'string') return data.token;
  if (typeof data.access_token === 'string') return data.access_token;
 
  if (data.token && typeof data.token === 'object') {
    if (typeof data.token.token === 'string') return data.token.token;
    if (typeof data.token.access_token === 'string') return data.token.access_token;
  }


  for (const v of Object.values(data)) {
    if (typeof v === 'string') return v;
  }

  
  return JSON.stringify(data);
};
export const AIModel = async (topic, CoachingOptions, msg) => {
  try {
    const payload = { topic, CoachingOptions, msg };
    const res = await axios.post('/api/aiModel', payload);
    
    if (res.data?.error) throw new Error(res.data.error);
    return res.data?.result ?? null;
  } catch (err) {
    
    try {
      console.error('AIModel client proxy error - message:', err?.message);
      if (err?.response) {
        console.error('AIModel client proxy error - response status/data/headers:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      }
      if (err?.request) {
        console.error('AIModel client proxy error - request:', err.request);
      }
    
      console.error('AIModel client proxy error - full:', err.toJSON ? err.toJSON() : err);
    } catch (logErr) {
      console.error('Error while logging AIModel error', logErr, err);
    }
    return { role: 'assistant', content: 'Sorry, AI service unavailable.' };
  }
};

export const AIModelToGenerateFeedbackAndNotes = async (conversation, CoachingOptions) => {
  try {
   
    const payload = {
      lastTwoConversations: Array.isArray(conversation) ? conversation.slice(-2) : [],
      coachingOptionName: CoachingOptions,
    };

    const res = await axios.post('/api/aiModel', payload);
    if (res.data?.error) {
      console.error('AIModelToGenerateFeedbackAndNotes server error', res.data.error);
   
      return { role: 'assistant', content: 'Sorry, AI service unavailable.' };
    }
    return res.data?.result ?? { role: 'assistant', content: 'Sorry, AI service returned no content.' };
  } catch (err) {
    try {
      console.error('AIModelToGenerateFeedbackAndNotes client error - message:', err?.message);
      if (err?.response) {
        console.error('AIModelToGenerateFeedbackAndNotes client error - response status/data/headers:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      }
      if (err?.request) {
        console.error('AIModelToGenerateFeedbackAndNotes client error - request:', err.request);
      }
      console.error('AIModelToGenerateFeedbackAndNotes client error - full:', err.toJSON ? err.toJSON() : err);
    } catch (logErr) {
      console.error('Error while logging AIModelToGenerateFeedbackAndNotes error', logErr, err);
    }
    return { role: 'assistant', content: 'Sorry, AI service unavailable.' };
  }
};

export const ConvertTextToSpeech = async (text) => {
  try {
    const res = await axios.post('/api/tts', { text }, { responseType: 'blob' });
  
    return res.data;
  } catch (err) {
    console.error('ConvertTextToSpeech proxy error', err);
    return null;
  }
};

export const transcribeExample = async () => {
  try {
    // Proxy a transcription request to the server which will call ElevenLabs
    // or another provider. Server should accept a URL or upload the file.
    const res = await axios.post('/api/elevenlabs/transcribe', {
      url: 'https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3',
    });
    return res.data;
  } catch (err) {
    console.error('transcribeExample proxy error', err);
    return null;
  }
};
