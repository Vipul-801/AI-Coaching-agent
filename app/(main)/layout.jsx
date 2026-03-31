import React from "react";
import AppHeader from "./_components/AppHeader"; // Corrected path

function DashbordLayout({children}){
    return(
        <div>
         <AppHeader/>
         <div className = 'p-10 mt-14 md:px-20 lg:px-40 lx:px-60 2lx:px-76'>
            {children}
         </div>
            
        </div>
    )
}

export default DashbordLayout;