import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
import { Button } from '@nextui-org/react'
import React,{ useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
export const ChatBox = ({ conversation,enableFeedbackNotes, CoachingOption }) => {

  const [loading,setLoading]=useState(false);
  const updateSummary = useMutation(api.discussionRooms.Updatesummary);

  const params = useParams();
  const roomid = params.roomid ?? params[' roomid '] ?? Object.values(params)[0];

  const GenerateFeedbackNotes = async () => {
    setLoading(true);
    try {
      const result = await AIModelToGenerateFeedbackAndNotes(conversation, CoachingOption);
      console.log(result?.content);

      if (roomid) {
        await updateSummary({ id: roomid, summary: result?.content ?? '' });
        toast('Feedback and notes generated and saved');
      } else {
        console.warn('No roomid available, skipping summary save');
        toast('Feedback generated (not saved)');
      }
    } catch (err) {
      console.error('GenerateFeedbackNotes error', err);
      toast('Error generating feedback and notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
 
    <div className="col-span-3 h-[60vh] bg-secondary border rounded-xl flex flex-col relative p-5  overflow-auto">
    
    
  {conversation.map((item, index) => (
     <div key={`${item?.role}-${index}`} className={`flex ${item.role=='user'&& 'justify-end'} `}>
      {item?.role=='assistant'?
      <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md'>{ item.content }</h2>
      :
      <h2 className='p-1 px-2 bg-gray-200 mt-2  inline-block rounded-md justify-end'> {item?.content}</h2>}
     </div>
      ))}
     
     
  </div>

 {!enableFeedbackNotes?
<h2 className="mt-5 text-gray-400 text-sm">
      At the end of your conversation we will generate feedback based on your
      performance
    </h2>

    :<Button  onPress={GenerateFeedbackNotes} disable={loading} className='mt-7 w-full '>
      {loading&&<LoaderCircle className='animate-spin'/>}Enable Feedback Notes</Button>}

  </div>
  )
}
