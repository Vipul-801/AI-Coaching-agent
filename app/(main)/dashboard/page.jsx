import React from "react";
import FeatureAssistants from "./_components/FeatureAssistants"; // Corrected path
import History from "./_components/History";
import Feedback from "./_components/Feedback";

function Dashbord({}){
    return(
        <>
            <div>
                <FeatureAssistants />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-20'>
                <History/>

                <Feedback/>

            </div>
        </>
    )
}

export default Dashbord;