"use client"
import * as React from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { Button } from "../components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../components/ui/drawer"
import { auth, db } from '../lib/firebase'
import { toast } from 'sonner'
import { doc, setDoc, getDoc } from "firebase/firestore"

export default function AuthDrawer() {
  const [isLogin, setIsLogin] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [userData, setUserData] = React.useState<any>(null)
  const [open, setOpen] = React.useState(false)

  
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } else {
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAuth = async () => {
    setLoading(true)
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success("Muvaffaqiyatli kirish.")
        setOpen(false) 
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "users", res.user.uid), {
          firstName,
          lastName,
          email,
          createdAt: new Date()
        })
        toast.success("Hisob yaratildi")
        setOpen(false)
      }
     
      setEmail("")
      setPassword("")
      setFirstName("")
      setLastName("")
					 setLoading(false)
    } catch (error: any) {
      toast.error("Xatolik: " + error.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Tizimdan chiqdingiz")
						 setLoading(false)
      setOpen(false)
    } catch (error: any) {
      toast.error("Xatolik: " + error.message)
    }
  }

  
  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {user ? (
       
          <button className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            {getInitials()}
          </button>
        ) : (
        
          <Button variant={"default"} className='bg-white text-black hover:bg-transparent hover:text-white hover:border-white border-transparent border-2'>
            Kirish
          </Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent className="bg-white p-6 ">
        <DrawerHeader>
          <DrawerTitle>
            {user ? "Profil" : isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </DrawerTitle>
        </DrawerHeader>

        {user ? (
          // Agar user kirgan bo'lsa - Profil ma'lumotlari
          <div className="flex flex-col space-y-4 max-w-[400px] w-full mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                {getInitials()}
              </div>
              <h3 className="text-xl font-semibold">
                {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Chiqish
            </Button>
          </div>
        ) : (
          // Agar user kirmagan bo'lsa - Login/Register form
          <div className="flex flex-col space-y-4 max-w-[400px] w-full mx-auto">
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Ismingiz"
                  className="border p-2 rounded"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Familyangiz"
                  className="border p-2 rounded"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Emailingiz"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Parol"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleAuth} disabled={loading}>
              {loading ? "Yuklanmoqda..." : isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </Button>
            <button
              className="text-blue-600 text-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Akkount yo'qmi? Ro'yxatdan o'ting" : "Akkount bormi? Kirish"}
            </button>
          </div>
        )}

          <DrawerClose className='absolute right-1 lg:right-10' asChild>
            <Button variant="outline">Yopish</Button>
          </DrawerClose>
      
      </DrawerContent>
    </Drawer>
  )
}