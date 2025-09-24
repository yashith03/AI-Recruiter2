import { UserDetailContext } from '@/context/UserDetailContext';
import React from 'react'
import {useState} from "react"
import {useEffect} from "react"

function Provider({children}) {
    const [user,setUser]=useState();
    useEffect(()=>{
        CreateNewUser();
    },[])

    const CreateNewUser = () =>{

        supabase.auth.getUser().then(async({data:{user}})=>{

        //Chceks if user already exist
        let { data: Users, error } = await supabase
         .from('Users')
         .select("*")
         .eq("email", user.email)

         console.log(Users)

        //If not then create new user
        if(Users?.length==0)
        {
            const {data,error}=await superbase
            .from("Users")
                .insert([
                    {
                        name:user?.user_metadata?.name,
                        email:user?.email,
                        picture:user?.user_metadata?.picture
                    },
                ]);
                console.log(data);
            
        }
    })
}
  return (
    <UserDetailContext.Provider value={{user, setUser}}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUser=()=>{
    const context=useContext(UserDetailContext);
    return context;
}
