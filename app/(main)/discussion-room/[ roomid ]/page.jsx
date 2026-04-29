"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '../../../../lib/coachingOptions';
import { UserButton } from '@stackframe/stack';
import Image from 'next/image';
import dynamic from "next/dynamic";
import {ChatBox} from './_components/ChatBox';
import { Toaster, toast } from 'sonner';
import { getToken, AIModel, ConvertTextToSpeech } from '../../../../services/GlobalServices';
import { Button } from '@nextui-org/react';
import { Loader2Icon } from 'lucide-react';
const RecordRTC = dynamic (()=> import('recordrtc'), { ssr: false });



function DiscussionRoom() {
   
    const params = useParams();
    const roomid = params.roomid ?? params[' roomid '] ?? Object.values(params)[0];

  const roomData = useQuery(api.discussionRooms.GetDiscussionRoom, { id: roomid });

    console.log("roomdata", roomData, 'params', params);
   const [enableFeedbackNotes,setEnableFeedbackNotes]=useState(false);
   const[expert,setExpert]=useState();
   const [conversation,setConversation]=useState([ {
    role:'assistant',
    content: "Hii"
   },
   {
    role:'user',
    content: 'Helllo how are you?'
   }
     
   ]);
   const [enableMic,setEnableMic]=useState(false);
   const [loading,setLoading]=useState(false);
   const recorder=useRef(null);
   const realtimeTranscriber=useRef(null);
   const [transcribe,setTranscribe]=useState('');
   const [audioURL,setAudioURL]=useState();
   const UpdateConversation=useMutation(api.discussionRooms.UpdateConversation);
   let silenceTimeout;
   let texts={};
  


 

   useEffect(()=>{
     if(roomData){
       
       const Expert = CoachingExpert.find(item => item.name === roomData.expertName || item.name === roomData.expert);
       console.log('resolved expert', Expert);
       setExpert(Expert);
     }
   },[roomData])

    const connectToServer= async() =>{
      setEnableMic(true);
      setLoading(true);

      
      const [{ default: RecordRTC }, { RealtimeTranscriber }] = await Promise.all([
        import('recordrtc'),
        import('assemblyai'),
      ]);

      
      let tokenRaw;
      try {
        tokenRaw = await getToken();
      } catch (err) {
        console.error('Failed to obtain realtime token:', err);
        
        setEnableMic(false);
        return;
      }

    
      const tokenStr = typeof tokenRaw === 'string'
        ? tokenRaw
        : (tokenRaw?.token ?? tokenRaw?.access_token ?? (Object.values(tokenRaw || {}).find(v => typeof v === 'string')));

      console.log('Resolved realtime token (string length):', typeof tokenStr === 'string' ? tokenStr.length : typeof tokenStr, tokenStr ? (typeof tokenStr === 'string' ? tokenStr.slice(0,8) + '...' : tokenStr) : tokenStr);

      realtimeTranscriber.current = new RealtimeTranscriber({
        token: tokenStr,
        sample_rate: 16000,
      });



      realtimeTranscriber.current.on('transcript', async (transcript) => {
   console.log(transcript);
    let msg = ''

       if(transcript.message_type === 'FinalTranscript') {
       setConversation(prev=>[...prev,{
        role:'user',
        content: transcript?.text
       }]);

       //calling ai test model for response
       const lastTwoMessages =conversation.slice(-2);
       const  aiResp=await AIModel(roomData?.topic,roomData?.coachingOption, transcript?.text);
         lastTwoMessages;
       console.log(aiResp);
        
        // Generate TTS for the AI response
        if (aiResp && aiResp.content) {
            const url = await ConvertTextToSpeech(aiResp.content);
            if (url) {
                setAudioURL(url);
            }
        }
        
        setConversation(prev=>[...prev,aiResp]);
    }


   texts[transcript.audio_start] = transcript?.text;
   const keys=Object.keys(texts);
   keys.sort((a,b)=>a-b);

   for (const key of keys) {
       if (texts[key]) {
           msg += `${texts[key]} `
       }

    }
    setTranscribe(msg);
 });

    
 
    await realtimeTranscriber.current.connect();
    setLoading(false);
    toast('Connected to transcription server');

   if (typeof window !== "undefined" && typeof navigator !== "undefined") {

    console.log('connectToServer: requesting microphone access');
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
      console.log('getUserMedia: stream obtained', stream);
      console.log('RecordRTC constructor available?', !!RecordRTC);
      recorder.current = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm;codecs=pcm',
                recorderType: RecordRTC.StereoAudioRecorder,
                timeSlice: 250,
                desiredSampRate: 16000,
                numberOfAudioChannels: 1,
                bufferSize: 4096,
                audioBitsPerSecond: 128000,
                ondataavailable: async (blob) => {
                    console.log('ondataavailable fired, blob:', blob, 'realtimeTranscriber:', !!realtimeTranscriber.current);
                    // If transcriber isn't ready, log and skip
                    if (!realtimeTranscriber.current) {
                      console.warn('ondataavailable: realtimeTranscriber.current is falsy; not sending audio');
                      return;
                    }
                    // Reset the silence detection timer on audio input
                    clearTimeout(silenceTimeout);
                    try {
                      const buffer = await blob.arrayBuffer();
                      console.log('audio buffer byteLength:', buffer.byteLength);
                      realtimeTranscriber.current.sendAudio(buffer);
                    } catch (err) {
                      console.error('Error converting/sending audio blob', err);
                    }
                    // Restart the silence detection timer
                    silenceTimeout = setTimeout(() => {
                        console.log('User stopped talking');
                      
                    }, 2000);
                },
            });
            try {
              recorder.current.startRecording();
              console.log('recorder started');
            } catch (err) {
              console.error('recorder.startRecording() failed', err);
            }
        })
        .catch((err) => {
          console.error('getUserMedia error', err);
          setEnableMic(false);
        });
}        
    }

    useEffect(() => {
      async function fetchData() {
        if(conversation[conversation.length - 1]?.role === 'user') {
          const lastTwoMessages =conversation.slice(-2);
          const aiResp=await AIModel(roomData?.topic,
            roomData?.coachingOption,
            lastTwoMessages);


            const url=await ConvertTextToSpeech(aiResp.content,roomData.expertName);
            console.log(url);
            setAudioURL(url);
          setConversation(prev=>[...prev,aiResp]);
        }
       
      }
    }, []);



    const disconnect = async (e) => {
      // If this was triggered by a button click event, prevent default navigation
      if (e && typeof e.preventDefault === 'function') e.preventDefault();

      setLoading(true);

      // Close realtime transcriber if present
      try {
        if (realtimeTranscriber.current && typeof realtimeTranscriber.current.close === 'function') {
          await realtimeTranscriber.current.close();
        }
      } catch (err) {
        console.error('Error closing realtime transcriber', err);
      }

  
      try {
        if (recorder.current) {
        
          if (typeof recorder.current.state === 'string' && recorder.current.state === 'recording' && typeof recorder.current.stop === 'function') {
            try { recorder.current.stop(); } catch(e) { console.warn('Error stopping MediaRecorder', e); }
          }

          // Fallback for RecordRTC
          else if (typeof recorder.current.pauseRecording === 'function') {
            try { recorder.current.pauseRecording(); } catch(e) { console.warn('Error pausing RecordRTC recorder', e); }
          }

          // Stop any underlying media tracks
          try {
            const stream = recorder.current.stream || recorder.current.mediaStream || null;
            if (stream && typeof stream.getTracks === 'function') {
              stream.getTracks().forEach((t) => { try { t.stop(); } catch (e) { /* ignore */ } });
            }
          } catch (err) {
            console.warn('Error stopping media tracks', err);
          }
        }
      } catch (err) {
        console.error('Error while stopping/pausing recorder', err);
      }

      // Clear refs and UI state
      recorder.current = null;
      realtimeTranscriber.current = null;
      setEnableMic(false);
      toast('Disconnected from transcription server');

      try {
        if (!roomid) {
          console.warn('UpdateConversation: missing roomid, skipping update');
        } else {
          await UpdateConversation({
            id: roomid,
            conversation: conversation,
          });
        }
      } catch (err) {
        console.error('UpdateConversation mutation failed', err);
      }

      // Normalize conversation to simple primitives before sending to Convex to
      // avoid schema validation issues (e.g. objects with unexpected shapes).
      try {
        if (!roomid) {
          console.warn('UpdateConversation: missing roomid, skipping update (final)');
        } else {
          const payloadConversation = Array.isArray(conversation)
            ? conversation.map((c) => ({
                role: String((c?.role) ?? ''),
                content: String((c?.content) ?? ''),
              }))
            : [];

          await UpdateConversation({
            id: roomid,
            conversation: payloadConversation,
          });
        }
      } catch (err) {
        console.error('UpdateConversation (final) mutation failed', err);
      }

      setLoading(false);
      setEnableFeedbackNotes(true);
    };


  return (
    <div className='-m-12'>
      <Toaster />
      <h2 className='text-lg font-bold'>{roomData?.coachingOption}</h2>
      <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
      <div className=" lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
        <img
          src={expert?.avatar}
          alt={expert?.name || 'expert avatar'}
          width={200}
          height={200}
          className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
        />
        <h2 className='text-gray-500'>{expert?.name}</h2>

        <audio src={audioURL} type="audio/mp3"  autoPlay />
        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
          <UserButton />
        </div>
      </div>

      
   <div className="grid grid-cols-2 gap-6">
     <ChatBox conversation={conversation}  
     enableFeedbackNotes={enableFeedbackNotes} 
     coachingOption={roomData?.coachingOption}
     />

  </div>



  <div className="mt-5 flex items-center justify-center gap-4">
        {!enableMic ? (
          <Button onPress={connectToServer} disabled={loading}> {loading&&<Loader2Icon className='animate-spin'/>}
            Connect
          </Button>
        ) : (
          <Button variant="destructive" onPress={disconnect} disabled={loading}>{loading&&<Loader2Icon className='animate-spin'/>}
            Disconnect
          </Button>
        )}
      </div>

  
</div>





      <div className="mt-6">
        <h2>{transcribe}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;