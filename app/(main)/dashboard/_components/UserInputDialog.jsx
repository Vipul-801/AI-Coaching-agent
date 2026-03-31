"use client";
import React, { useState, useContext } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import CoachingOptions, { CoachingExpert } from '../../../../lib/coachingOptions';
import Image from "next/image";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@nextui-org/react";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../../_context/UserContext";

function UserInputDialog({ children, CoachingOptions: PassedCoachingOption }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [topic, setTopic] = useState("");
  const createRoom = useMutation("discussionRooms:createNewRoom");

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const { userData } = useContext(UserContext);

  const experts = Array.isArray(CoachingExpert) ? CoachingExpert : [];
  const coachingOption = PassedCoachingOption ?? (Array.isArray(CoachingOptions) ? CoachingOptions[0] : undefined);

  const onClickNext = async () => {
    setLoading(true);
    if (!userData?.id) {
      console.warn('Creating room without uid (user not authenticated)');
    }
    const result = await createRoom({
      CoachingOption: coachingOption?.name,
      expert: selectedExpert,
      topic: topic,
      
      uid: userData?.id ?? undefined,
    });
    console.log(result);
    setLoading(false);
    setOpenDialog(false);
    router.push('/discussion-room/' + result);
   }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coachingOption?.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
              <h2 className="text-black font-Medium">
                Enter a topic you want to learn about in {coachingOption?.name}
                <Textarea
                  placeholder="Enter your topic here...."
                  className="mt-2"
                  onChange={(e) => setTopic(e.target.value)}
                />
              </h2>

              <h2 className="text-black mt-5">
                Select an expert for {coachingOption?.name}
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                {experts.map((expert, index) => (
                  <div
                    key={`${expert.name ?? "expert"}-${index}`}
                    onClick={() => setSelectedExpert(expert.name)}
                    className={`text-center cursor-pointer p-1 ${
                      selectedExpert === expert.name ? "border" : ""
                    }`}
                  >
                    <Image
                      src={expert.avatar}
                      alt={expert.name ?? "expert"}
                      width={100}
                      height={100}
                      className="rounded-2xl h-[80px] w-[80px] object-cover hover:scale-105 transition-all"
                    />
                    <h2 className="text-center mt-2">{expert.name}</h2>
                  </div>
                ))}
              </div>

              <div className="flex gap-5 justify-end mt-5">
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>

                <Button disabled={!topic || !selectedExpert || loading} onPress={onClickNext}>
                  {loading && <LoaderCircle className="animate-spin" />}
                  Next
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;