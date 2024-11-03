import { usePageTitleContext } from "../context/PageTitleContext";

 
const SideBar = () => {
    const {pageTitle} = usePageTitleContext()
    
    return (
      <div
        id='sidebar'
        className='w-[80px] flex-shrink-0 hidden lg:flex h-screen bg-white dark:bg-slate-950 shadow-lg flex-col justify-between items-center relative z-20'
      >
        <div className='pointer-events-none text-right absolute h-[90px] w-[300px] uppercase text-sm top-[120px] font-extrabold transform -rotate-90 flex justify-end items-center dark:text-white'>
          {pageTitle}
        </div>
        <div
          id='pageLanguage'
          className='absolute  bottom-10 flex items-center justify-center dark:text-white'
        >
          <span>EN</span>
        </div>
      </div>
    )
}
 
export default SideBar;