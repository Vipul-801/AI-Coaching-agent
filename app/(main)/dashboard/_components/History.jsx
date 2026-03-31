"use client";
import React, { useState, useContext, useEffect } from "react";
import { useConvex } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UserContext } from "../../../_context/UserContext";
import CoachingOptions from "@/lib/coachingOptions";
import moment from "moment";

function History() {
    const convex = useConvex();
    const { userData } = useContext(UserContext);
    const [discussionRoomList, setDiscussionRoomList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userData) return;
        let cancelled = false;

        const fetchRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await convex.query(api.discussionRooms.GetAllDiscussionRooms)({ uid: userData?.id });
                console.log('GetAllDiscussionRooms result:', result);
                if (!cancelled) setDiscussionRoomList(result ?? []);
            } catch (err) {
                console.error('GetAllDiscussionRooms failed', err);
                if (!cancelled) {
                    setError(err?.message || String(err));
                    setDiscussionRoomList([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRooms();
        return () => { cancelled = true; };
    }, [userData, convex]);

   const GetAbstractImages=()=>{
      const coachingOption=CoachingOptions.find((item)=>item.name==option)

      return coachingOption.abstract??'ab1.png';

   }



    return (
        <div>
            <h2 className="font-bold text-xl"> Your Previous Lectures </h2>

            {loading && <p className="text-gray-500">Loading…</p>}
            {error && <p className="text-red-500">Error loading rooms: {error}</p>}

            {!loading && discussionRoomList !== null && discussionRoomList.length === 0 && (
                <h2 className="text-gray-400"> You don't have any previous lectures</h2>
            )}

            <div className="space-y-3 mt-5">
                {Array.isArray(discussionRoomList) && discussionRoomList.map((item, index) => (
                    
                    <div key={item._id ?? item.id ?? index} className="border-b-[2px] pb-3 mb-4 group flex justify-between items-center cursor-pointer ">
                        <div>
                            <Image src={GetAbstractImages(item.coachingOption)} alt='abstract' width={70} height={70} className="rounded-full h-[50px] w-[50px] "/>
                        <div>
                            <h2 className="text-gray-400 text-sm">{moment(item._creationTime).fromNow()}</h2>
                        <h3 className="font-medium">{item.topic ?? item.coachingOption ?? 'Untitled'}</h3>
                        <p className="text-sm text-gray-500">Expert: {item.expertName ?? item.expert ?? 'Unknown'}</p>
                    </div>
                    </div>
                    <Button variant='outline' className='invisible group-hover:visible'>View Details</Button>
                    </div>
                    
                ))}
            </div>
        </div>
    );
}

export default History;