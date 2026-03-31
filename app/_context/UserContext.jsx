import React, { createContext, useState, useEffect } from "react";


export const UserContext = createContext({ userData: null, setUserData: () => {} });

export function UserProvider({ children }) {
	const [userData, setUserData] = useState(null);


	useEffect(() => {
		// no-op for now
	}, []);

	return (
		<UserContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserContext.Provider>
	);
}