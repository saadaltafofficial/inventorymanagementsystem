import { IoIosMenu } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "./AuthContext";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, setToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogOut = () => {
    try {
      setIsLoading(true)
      localStorage.clear()
      setToken('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white p-4 fixed w-full top-0 left-0">
      <Link to={'/'} className="font-bold text-xl">Inventory Management System</Link>
      {isMenuOpen ?
        <button
          className="desktop:hidden flex items-center justify-center text-white bg-gray-700 rounded-full"
          onClick={toggleMenu}
        >
          <IoCloseOutline size={34} />
        </button> :
        <button
          className="desktop:hidden flex items-center justify-center text-white bg-gray-800"
          onClick={toggleMenu}
        >
          <IoIosMenu size={34} />
        </button>}
      <div
        className={`${isMenuOpen ? "block w-full" : "hidden"
          } fixed top-[4rem] right-0 bg-gray-800 desktop:flex desktop:static desktop:gap-4`}
      >
        <a
          href="/allitems"
          className="block py-2 px-4 text-center border-b border-gray-600 desktop:border-none desktop:inline-block"
        >
          All Items
        </a>
        {token ?
          <>
            <a
              href="/admin/allitems"
              className="block py-2 px-4 text-center border-b border-gray-600 desktop:border-none desktop:inline-block"
            >
              Dashboard
            </a>
            <a
              href="/admin/createitem"
              className="block py-2 px-4 text-center border-b border-gray-600 desktop:border-none desktop:inline-block"
            >
              Create Item
            </a>
            
            {isLoading ? (
              <div className="h-screen flex justify-center items-center">
                <TailSpin   // Type of spinner
                  height="80"
                  width="80"
                  color="#1f2937"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>
            ) : ( <a
              href="/signin"
              onClick={handleLogOut}
              className="flex justify-center items-center py-2 px-4 text-center border-b border-gray-600 desktop:border-none desktop:inline-block"
            >
              <LuLogOut size={22}/>
            </a> )}
          </>
          : <a
            href="/signin"
            className="block py-2 px-4 text-center border-b border-gray-600 desktop:border-none desktop:inline-block"
          >
            Login
          </a>
        }
      </div>
    </header>
  );
}
