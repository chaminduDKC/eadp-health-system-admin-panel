import '../../../styles/theme.css'
import './header.css'
import ThemeToggle from "../../../compos/themeToggle.jsx";
const Header = ({ sidebarVisible, toggleSidebar }) => {
    return(
     <>
         <div className="header">
             <div className="toggle">
                 {sidebarVisible ? (
                     <i onClick={toggleSidebar} className="fa-regular fa-square-caret-left"></i>
                 ): (
                     <i onClick={toggleSidebar} className="fa-regular fa-square-caret-right"></i>
                 )}

             </div>
             <h1>Hope health Admin Panel</h1>
            <div className="right">

                <div className='profile-info'>
                    <p className="email">myemail@gmail.com</p>
                    <i className="fa-solid fa-user"></i>
                </div>
                <ThemeToggle/>
            </div>
         </div>
     </>
    )

};

export default Header;