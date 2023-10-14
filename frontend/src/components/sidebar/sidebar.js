import React, { Suspense } from "react";
import "./sidebar.css";
import ErrorBoundary from "../Error/errorBoundary.js";
const Navbar = React.lazy(() => import("../navbar/navbar.js"));
const Search = React.lazy(() => import("../search/search.js"));
const Chats = React.lazy(() => import("../userChats/chats.js"));

function Sidebar() {
  // console.log("sidebar");
  return (
    <>
      <div className='sidebar'>
        <ErrorBoundary
          fallback={
            <p style={{ textAlign: "center" }}>
              Something went wrong.please refresh once.
            </p>
          }
        >
          <Suspense fallback={<p>loading...</p>}>
            <Navbar />
            <Search />
            <Chats />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
export default Sidebar;
