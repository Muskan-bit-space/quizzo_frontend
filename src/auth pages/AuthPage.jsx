import React from 'react'
import { Outlet, Link } from 'react-router-dom';

import SignUp from './SignUp'
const AuthPage = () => {
  return (
    <div>
      AuthPage
        <nav>
            <pre>
                <button>
                    <Link to="signup">signup</Link>

                </button> 
                |   
                <button>
                    <Link to="signin">signin</Link>

                </button>

            </pre>
        </nav>
        <Outlet/>
    </div>
  )
}

export default AuthPage
