// 4. 컴포넌트에서 redux 사용

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

         // 적은 내용이 이메일이 서버로 보내지고, 이메일을 찾고 비밀번호를 비교한 후 토큰을 생성해서 쿠키에 저장하여 클라이언트에게 전해줌

        let body = {
            email: Email,
            password: Password
        }

        /* 
        (3) Dispatch 
        : Action Creater로 return 해준 Action을 파라메터로 받아 
          store의 reducer에게 넘겨주는 역할을 해주는 열차
        */
        
        // dispatch를 하여 로그인 완료 후 처음 페이지로 이동
        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess) {
                props.history.push('/')
            } else {
                alert('Error')
            }
        }) 
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
        }}>
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit = {onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)
