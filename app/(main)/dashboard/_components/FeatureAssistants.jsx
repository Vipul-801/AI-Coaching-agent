"use client"
import { useUser } from "@stackframe/stack";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react"; // Corrected import
import Image from "next/image";
import { BlurFade } from "../../../../@/components/ui/blur-fade";
import UserInputDialog from "./UserInputDialog";
import CoachingOptions, { CoachingExpert } from '../../../../lib/coachingOptions';

function FeatureAssistants() {
    const user = useUser();
   
    return (
        <div>
            <div className='flex justify-between items-center '>
                <div>
                    <h1 className='font-Medium  text-grey-500'> My Workspace </h1>
                    <h2 className=' text-3xl font-bold'> Welcome Back { user?.displayName }</h2>
                </div>
                <Button className='border border-blue-400'>Profile</Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-10 mt-10">
                {CoachingOptions.map((Option,index)=>(
                      <BlurFade key={Option.icon} delay={0.25 + index * 0.05} inView>
                        <div key={index} className="p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center">
                        <UserInputDialog CoachingOptions={Option}>
                    <div key={index} className="flex flex-col justify-center items-center">
                        <Image src={Option.icon} alt={Option.name}
                        width={150}
                        height={150}
                        className='h-[70px] w-[70px] hover:rotate-12 cursor-pointer transition-all'
                        />
                        <h2 className='mt-2'>{Option.name} </h2>
                    </div>
                    </UserInputDialog>
                    </div>
                    </BlurFade>
                ))}
            </div>
        </div>
    );
}
export default FeatureAssistants;